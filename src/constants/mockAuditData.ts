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
    AISummary,
} from '@/types/audit';
import { computeAuditSummary } from '@/services/audit/computeAuditSummary';
import { generateRecommendations } from '@/services/audit/rules/engine';
import { buildToolInputs } from '@/services/audit/buildToolInputs';

// ─── Mock tool inputs ─────────────────────────────────────────────────────────
// These represent what a user would submit via the audit form.
// Changing these values will cascade through the engine, calculators,
// and score — no other files need to be updated.

const MOCK_TOOL_INPUTS = buildToolInputs({
    selectedTools: ['chatgpt', 'claude', 'cursor'],
    toolConfigs: {
        chatgpt: { plan: 'team', monthlySpend: 150, seats: 5 },
        claude: { plan: 'pro', monthlySpend: 102, seats: 5 },
        cursor: { plan: 'business', monthlySpend: 160, seats: 4 },
    },
});

const MOCK_TEAM_SIZE = '6-20';
const MOCK_USE_CASE = 'coding';

// ─── Engine-generated recommendations + insights ──────────────────────────────
// recommendations and insights are now produced by the rules engine.
// The engine evaluates each tool against the rule set and returns
// typed ToolRecommendation[] and OpportunityInsight[].

const { recommendations, insights } = generateRecommendations({
    tools: MOCK_TOOL_INPUTS,
    teamSize: MOCK_TEAM_SIZE,
    useCase: MOCK_USE_CASE,
});

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
    toolInputs: MOCK_TOOL_INPUTS,
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
