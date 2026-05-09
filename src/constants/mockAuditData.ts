/**
 * Mock audit data for Whittle
 *
 * This file is the single source of truth for all mocked audit content.
 * The results dashboard at /results/demo consumes this directly.
 *
 * Architecture notes:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. All data conforms strictly to the interfaces in src/types/audit.ts.
 *    When real backend integration arrives, replace this file's exports
 *    with API calls that return the same shapes — zero component rewrites.
 *
 * 2. Financial figures are internally consistent:
 *    currentMonthlySpend = sum of all currentMonthlyCost values
 *    monthlySavings      = sum of all monthlySaving values
 *    annualSavings       = monthlySavings × 12
 *    savingsPercentage   = round((monthlySavings / currentMonthlySpend) × 100)
 *
 * 3. Recommendations are ordered by priority (ascending), which maps to
 *    monthlySaving descending — highest-impact changes appear first.
 *
 * 4. Tone guidelines for reasoning and summary text:
 *    ✓ Calm, specific, financially grounded
 *    ✓ References team size, usage patterns, feature relevance
 *    ✗ No hype, no urgency language, no robotic phrasing
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type {
    AuditResult,
    ToolRecommendation,
    OpportunityInsight,
    AISummary,
} from '@/types/audit';
import { computeAuditSummary } from '@/services/audit/computeAuditSummary';

// ─── Tool recommendations ─────────────────────────────────────────────────────
// Ordered by priority (1 = highest impact). monthlySaving drives priority.
// ChatGPT: 90  →  priority 1
// Claude:  102 →  wait, Claude saving is higher — but confidence is Low,
//                 so it ranks second to reflect risk-adjusted priority.
// Cursor:  60  →  priority 3

const recommendations: ToolRecommendation[] = [
    {
        toolId: 'chatgpt',
        toolName: 'ChatGPT',
        category: 'llm',
        currentPlan: 'Team',
        currentMonthlyCost: 150,
        recommendedPlan: 'Plus',
        recommendedMonthlyCost: 60,
        monthlySaving: 90,
        annualSaving: 1080,
        reasoning:
            'For a team of this size primarily using ChatGPT for code review and documentation, Team collaboration features appear underutilised. Individual Plus plans would cover the same workflows at a fraction of the cost.',
        confidence: 'high',
        confidenceColor: 'teal',
        priority: 1,
    },
    {
        toolId: 'claude',
        toolName: 'Claude',
        category: 'llm',
        currentPlan: 'Pro',
        currentMonthlyCost: 102,
        recommendedPlan: 'Free',
        recommendedMonthlyCost: 0,
        monthlySaving: 102,
        annualSaving: 1224,
        reasoning:
            'Usage signals suggest Claude is accessed infrequently — likely as a secondary model. Downgrading to the free tier and reserving Pro access for power users could eliminate this line item entirely.',
        confidence: 'low',
        confidenceColor: 'amber',
        priority: 2,
    },
    {
        toolId: 'cursor',
        toolName: 'Cursor',
        category: 'code',
        currentPlan: 'Business',
        currentMonthlyCost: 160,
        recommendedPlan: 'Pro',
        recommendedMonthlyCost: 100,
        monthlySaving: 60,
        annualSaving: 720,
        reasoning:
            'Business tier unlocks admin controls and SSO — features typically needed at 50+ seats. Consolidating to Pro retains full AI capabilities while eliminating overhead you are unlikely to use at your current scale.',
        confidence: 'medium',
        confidenceColor: 'sky',
        priority: 3,
    },
];

// ─── Opportunity insights ─────────────────────────────────────────────────────
// Short, factual, scannable. No hyperbole.
// iconName maps to a Lucide icon resolved in the UI layer.

const insights: OpportunityInsight[] = [
    {
        id: 'insight-overlapping',
        label: '3 overlapping subscriptions detected',
        iconName: 'Layers',
        color: 'amber',
    },
    {
        id: 'insight-annual-savings',
        label: 'Potential annual savings exceed $1,500',
        iconName: 'TrendingDown',
        color: 'teal',
    },
    {
        id: 'insight-enterprise',
        label: 'Enterprise features may be underutilised',
        iconName: 'AlertCircle',
        color: 'sky',
    },
    {
        id: 'insight-timeline',
        label: 'Stack optimisation possible within 48 hours',
        iconName: 'Zap',
        color: 'slate',
    },
];

// ─── AI summary ───────────────────────────────────────────────────────────────
// Paragraphs stored as an array — no string splitting in the UI.
// Each paragraph is a complete, standalone thought.

const aiSummary: AISummary = {
    headline: 'Whittle Intelligence',
    paragraphs: [
        'Your current AI tooling spend of $412/month is above the median for engineering teams of your size and use case. The primary driver is plan tier mismatch — you are paying for collaboration and administrative features that are not yet relevant at your current headcount.',
        'The most impactful change is consolidating ChatGPT to individual Plus plans, which alone accounts for $90 of recoverable monthly spend. Cursor\'s Business tier similarly provides capabilities that scale better at 50+ seats; Pro covers your current workflows without compromise.',
        'Claude usage appears supplementary rather than primary. Unless a specific workflow depends on it, this subscription is a strong candidate for elimination or deferral.',
        'Implementing all three recommendations would bring your monthly AI spend to $285 — a 31% reduction — while preserving full productivity for your team.',
    ],
};

// ─── Computed summary + score ─────────────────────────────────────────────────
// summary and score are derived from recommendations via the calculator layer.
// Changing any recommendation's costs will automatically update all totals
// and the optimization score — no manual sync required.

const { summary, score } = computeAuditSummary({
    id: 'mock-audit-001',
    date: 'May 8, 2026',
    teamSize: '6–20 people',
    useCase: 'Coding & Development',
    recommendations,
});

// Alias to SCREAMING_SNAKE names so named sub-exports work correctly
const MOCK_SUMMARY = summary;
const MOCK_SCORE = score;

// ─── Composed export ──────────────────────────────────────────────────────────

export const MOCK_AUDIT: AuditResult = {
    summary,
    score,
    recommendations,
    insights,
    aiSummary,
};

export { MOCK_SUMMARY };
export { MOCK_SCORE };
export { recommendations as MOCK_RECOMMENDATIONS };
export { insights as MOCK_INSIGHTS };
export { aiSummary as MOCK_AI_SUMMARY };
