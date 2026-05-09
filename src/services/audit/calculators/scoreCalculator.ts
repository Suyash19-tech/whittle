import type { ToolRecommendation, AuditScore, ScoreLabel, ConfidenceLevel } from '@/types/audit';

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface ScoreInput {
    recommendations: ToolRecommendation[];
    /** Total current monthly spend — used to compute waste ratio */
    currentMonthlySpend: number;
}

// ─── Score band table ─────────────────────────────────────────────────────────

/**
 * Score bands with label and explanation template.
 * Bands are checked from highest to lowest — first match wins.
 *
 * Future: swap explanation for a dynamic template that references
 * specific tools or savings amounts.
 */
const SCORE_BANDS: Array<{
    min: number;
    label: ScoreLabel;
    explanation: string;
}> = [
        {
            min: 90,
            label: 'Fully Optimized',
            explanation:
                'Your AI stack is lean and well-matched to your team size. There is little recoverable spend remaining.',
        },
        {
            min: 75,
            label: 'Well Optimized',
            explanation:
                'Your stack is in good shape with minor inefficiencies. A small number of targeted changes would close the gap.',
        },
        {
            min: 55,
            label: 'Moderately Optimized',
            explanation:
                'Your stack is functional but carries redundant spend. A few targeted changes could meaningfully reduce costs without impacting productivity.',
        },
        {
            min: 40,
            label: 'Below Average',
            explanation:
                'Several tools are over-provisioned for your current scale. Addressing the highest-impact recommendations would recover meaningful budget.',
        },
        {
            min: 0,
            label: 'Needs Attention',
            explanation:
                'Your AI spend has significant structural inefficiencies. Immediate action on the top recommendations would produce substantial savings.',
        },
    ];

// ─── Penalty weights ──────────────────────────────────────────────────────────

/**
 * Each penalty reduces the base score of 100.
 * Weights are intentionally small and additive — the score degrades
 * gradually rather than collapsing on a single signal.
 *
 * Penalty sources:
 *   wasteRatio      — proportion of spend that is recoverable
 *   highConfidence  — each high-confidence recommendation is a clear inefficiency
 *   mediumConfidence — medium-confidence recommendations are probable inefficiencies
 *   lowConfidence   — low-confidence recommendations are possible inefficiencies
 *   duplicateCategory — multiple tools in the same category suggest overlap
 */
const WEIGHTS = {
    wasteRatioMultiplier: 60,   // up to 60 pts from waste ratio alone
    highConfidence: 8,           // per high-confidence recommendation
    mediumConfidence: 4,         // per medium-confidence recommendation
    lowConfidence: 2,            // per low-confidence recommendation
    duplicateCategory: 5,        // per category with more than one tool
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Count recommendations by confidence level */
function countByConfidence(
    recs: ToolRecommendation[],
    level: ConfidenceLevel
): number {
    return recs.filter((r) => r.confidence === level).length;
}

/**
 * Count categories that appear more than once across recommendations.
 * A category appearing twice means two tools overlap in purpose.
 */
function countDuplicateCategories(recs: ToolRecommendation[]): number {
    const counts = recs.reduce<Record<string, number>>((acc, r) => {
        acc[r.category] = (acc[r.category] ?? 0) + 1;
        return acc;
    }, {});
    return Object.values(counts).filter((n) => n > 1).length;
}

/** Map a numeric score to the first matching band */
function getBand(score: number): (typeof SCORE_BANDS)[number] {
    return (
        SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1]
    );
}

// ─── Calculator ───────────────────────────────────────────────────────────────

/**
 * calculateScore
 *
 * Produces a 0–100 optimization score from recommendation data.
 * Starts at 100 and subtracts penalties for:
 *   - Waste ratio (how much of current spend is recoverable)
 *   - High/medium/low confidence recommendations
 *   - Duplicate tool categories (overlap signal)
 *
 * Pure function — deterministic, no side effects.
 *
 * @example
 *   const score = calculateScore({ recommendations, currentMonthlySpend: 412 });
 *   // { value: 72, label: 'Moderately Optimized', explanation: '...' }
 */
export function calculateScore({ recommendations, currentMonthlySpend }: ScoreInput): AuditScore {
    if (recommendations.length === 0 || currentMonthlySpend === 0) {
        const band = getBand(100);
        return { value: 100, label: band.label, explanation: band.explanation };
    }

    // Waste ratio: what fraction of current spend is recoverable
    const totalSavings = recommendations.reduce((sum, r) => sum + r.monthlySaving, 0);
    const wasteRatio = Math.min(totalSavings / currentMonthlySpend, 1);

    // Accumulate penalties
    let penalty = 0;
    penalty += wasteRatio * WEIGHTS.wasteRatioMultiplier;
    penalty += countByConfidence(recommendations, 'high') * WEIGHTS.highConfidence;
    penalty += countByConfidence(recommendations, 'medium') * WEIGHTS.mediumConfidence;
    penalty += countByConfidence(recommendations, 'low') * WEIGHTS.lowConfidence;
    penalty += countDuplicateCategories(recommendations) * WEIGHTS.duplicateCategory;

    const raw = 100 - penalty;
    const value = Math.round(Math.min(Math.max(raw, 0), 100));

    const band = getBand(value);
    return { value, label: band.label, explanation: band.explanation };
}
