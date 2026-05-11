import type { ToolRecommendation, AuditScore, ScoreLabel } from '@/types/audit';
import type { ToolInput } from '../rules/types';

// ─── I/O ──────────────────────────────────────────────────────────────────────

export interface ScoreInput {
    recommendations: ToolRecommendation[];
    toolInputs: ToolInput[];
    currentMonthlySpend: number;
}

// ─── Score bands ──────────────────────────────────────────────────────────────

const SCORE_BANDS: Array<{ min: number; label: ScoreLabel; explanation: string }> = [
    {
        min: 88,
        label: 'Fully Optimized',
        explanation:
            'Your AI stack is lean and well-matched to your team size. Spend is proportionate to capability, and there is little recoverable budget remaining.',
    },
    {
        min: 72,
        label: 'Well Optimized',
        explanation:
            'Your stack is in good shape with minor inefficiencies. A small number of targeted changes would close the gap without disrupting workflows.',
    },
    {
        min: 52,
        label: 'Moderately Optimized',
        explanation:
            'Your stack is functional but carries some redundant spend. A few targeted changes could meaningfully reduce costs without impacting productivity.',
    },
    {
        min: 35,
        label: 'Below Average',
        explanation:
            'Several tools appear over-provisioned for your current scale. Addressing the highest-impact recommendations would recover meaningful budget.',
    },
    {
        min: 0,
        label: 'Needs Attention',
        explanation:
            'Your AI spend has significant structural inefficiencies. Immediate action on the top recommendations would produce substantial savings.',
    },
];

// ─── Weighted factor system ───────────────────────────────────────────────────

/**
 * Scoring factors — each contributes a positive or negative delta.
 *
 * Base score: 100. Penalties reduce it. Bonuses can partially offset.
 * Final score is clamped to [0, 100].
 *
 * Factor design principles:
 * - Waste ratio is the dominant signal (up to -55 pts)
 * - Confidence-weighted recommendations add nuance
 * - API-heavy stacks are penalised less aggressively (API spend is often justified)
 * - Capability overlap (same-purpose tools) penalises more than provider diversity
 * - Enterprise overkill at small scale is a clear inefficiency
 * - Seat inefficiency (high-tier plan, very few seats) adds a small penalty
 */
const FACTORS = {
    // Waste ratio: recoverable spend / total spend, scaled to max -55 pts
    wasteRatioMax: 55,

    // Per recommendation by confidence
    highConfidenceRec: 10,
    mediumConfidenceRec: 5,
    lowConfidenceRec: 2,

    // Capability overlap (same-purpose tools, e.g. Cursor + Copilot)
    capabilityOverlap: 8,

    // Provider overlap (same provider, different products, e.g. ChatGPT + OpenAI API)
    providerOverlap: 3,

    // Enterprise plan on a small team (< 10 seats)
    enterpriseOverkill: 7,

    // API spend concentration penalty (applied at thresholds)
    apiConcentrationMedium: 3,   // 50–70% of spend is API
    apiConcentrationHigh: 6,   // 70–85%
    apiConcentrationCritical: 10, // 85%+

    // Seat inefficiency: high-tier plan with ≤ 2 seats
    seatInefficiency: 4,

    // Stack complexity: more than 4 paid tools
    stackComplexity: 3,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Tools that are considered the same capability (high overlap)
const CAPABILITY_GROUPS: string[][] = [
    ['cursor', 'github-copilot', 'windsurf'],   // AI code editors
    ['chatgpt', 'claude', 'gemini'],             // General LLMs (low overlap — different strengths)
];

// Provider groupings for provider-overlap detection
const PROVIDER_GROUPS: Record<string, string> = {
    'chatgpt': 'openai',
    'openai-api': 'openai',
    'claude': 'anthropic',
    'anthropic-api': 'anthropic',
    'gemini': 'google',
    'cursor': 'cursor',
    'github-copilot': 'github',
    'windsurf': 'codeium',
};

function countCapabilityOverlap(tools: ToolInput[]): number {
    let overlaps = 0;
    for (const group of CAPABILITY_GROUPS) {
        const inGroup = tools.filter((t) => group.includes(t.toolId));
        // Code editors: 2+ is high overlap. LLMs: 3+ is overlap (2 is fine).
        const threshold = group.includes('cursor') ? 2 : 3;
        if (inGroup.length >= threshold) overlaps++;
    }
    return overlaps;
}

function countProviderOverlap(tools: ToolInput[]): number {
    const providerCounts: Record<string, number> = {};
    tools.forEach((t) => {
        const p = PROVIDER_GROUPS[t.toolId];
        if (p) providerCounts[p] = (providerCounts[p] ?? 0) + 1;
    });
    return Object.values(providerCounts).filter((n) => n > 1).length;
}

function apiSpendRatio(tools: ToolInput[]): number {
    const total = tools.reduce((s, t) => s + t.monthlySpend, 0);
    if (total === 0) return 0;
    const apiSpend = tools
        .filter((t) => t.category === 'api')
        .reduce((s, t) => s + t.monthlySpend, 0);
    return apiSpend / total;
}

function hasEnterpriseOverkill(tools: ToolInput[]): boolean {
    return tools.some((t) => t.planId === 'enterprise' && t.seats < 10);
}

function hasSeatInefficiency(tools: ToolInput[]): boolean {
    // High-tier plan (not free/payg) with only 1–2 seats
    return tools.some(
        (t) => !['free', 'payg'].includes(t.planId) && t.seats <= 2
    );
}

function getBand(score: number): (typeof SCORE_BANDS)[number] {
    return SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

// ─── Calculator ───────────────────────────────────────────────────────────────

/**
 * calculateScore
 *
 * Weighted intelligence scoring system.
 * Starts at 100 and applies factor-based penalties.
 *
 * Key improvements over the previous version:
 * - API-heavy stacks are not penalised as aggressively (API spend is often justified)
 * - Capability overlap (same-purpose tools) penalises more than provider diversity
 * - Enterprise overkill at small scale is a clear inefficiency signal
 * - Seat inefficiency adds a small but real penalty
 * - Stack complexity (too many paid tools) adds a minor penalty
 * - Score bands are tighter — 90+ is genuinely hard to achieve
 */
export function calculateScore({ recommendations, toolInputs, currentMonthlySpend }: ScoreInput): AuditScore {
    if (toolInputs.length === 0 || currentMonthlySpend === 0) {
        const band = getBand(82); // No data → "Well Optimized" by default, not perfect
        return { value: 82, label: band.label, explanation: band.explanation };
    }

    let penalty = 0;

    // 1. Waste ratio — dominant signal
    const totalSavings = recommendations.reduce((s, r) => s + r.monthlySaving, 0);
    const wasteRatio = Math.min(totalSavings / currentMonthlySpend, 1);
    penalty += wasteRatio * FACTORS.wasteRatioMax;

    // 2. Confidence-weighted recommendations
    recommendations.forEach((r) => {
        if (r.confidence === 'high') penalty += FACTORS.highConfidenceRec;
        if (r.confidence === 'medium') penalty += FACTORS.mediumConfidenceRec;
        if (r.confidence === 'low') penalty += FACTORS.lowConfidenceRec;
    });

    // 3. Capability overlap (same-purpose tools)
    penalty += countCapabilityOverlap(toolInputs) * FACTORS.capabilityOverlap;

    // 4. Provider overlap (same provider, multiple products)
    penalty += countProviderOverlap(toolInputs) * FACTORS.providerOverlap;

    // 5. API spend concentration
    const apiRatio = apiSpendRatio(toolInputs);
    if (apiRatio >= 0.85) penalty += FACTORS.apiConcentrationCritical;
    else if (apiRatio >= 0.70) penalty += FACTORS.apiConcentrationHigh;
    else if (apiRatio >= 0.50) penalty += FACTORS.apiConcentrationMedium;

    // 6. Enterprise overkill
    if (hasEnterpriseOverkill(toolInputs)) penalty += FACTORS.enterpriseOverkill;

    // 7. Seat inefficiency
    if (hasSeatInefficiency(toolInputs)) penalty += FACTORS.seatInefficiency;

    // 8. Stack complexity
    const paidTools = toolInputs.filter((t) => !['free', 'payg'].includes(t.planId));
    if (paidTools.length > 4) penalty += FACTORS.stackComplexity;

    const value = Math.round(Math.min(Math.max(100 - penalty, 0), 100));
    const band = getBand(value);
    return { value, label: band.label, explanation: band.explanation };
}
