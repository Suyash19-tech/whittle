import type { ToolRecommendation } from '@/types/audit';
import type { ToolInput } from '../rules/types';

// ─── I/O types ────────────────────────────────────────────────────────────────

/**
 * SpendInput accepts BOTH the raw tool inputs AND the recommendations.
 *
 * Why both?
 * - currentMonthlySpend must sum ALL selected tools (including those with no
 *   recommendation — e.g. a tool already on the optimal plan).
 * - optimizedMonthlySpend sums recommended costs for tools that have a
 *   recommendation, and the original cost for tools that don't (no change).
 *
 * Previous bug: only recommendations were used, so tools without a matching
 * rule were silently dropped from totals, causing understated spend figures.
 */
export interface SpendInput {
    /** All tools the user configured — the canonical source of current spend */
    toolInputs: ToolInput[];
    /** Engine output — only tools with an actionable recommendation appear here */
    recommendations: ToolRecommendation[];
}

export interface SpendResult {
    /** Sum of monthlySpend across ALL configured tools */
    currentMonthlySpend: number;
    /** Optimized spend: recommended cost where available, original cost otherwise */
    optimizedMonthlySpend: number;
    /** currentMonthlySpend - optimizedMonthlySpend */
    monthlySavings: number;
    /** monthlySavings * 12 */
    annualSavings: number;
    /** Percentage reduction, rounded to nearest integer */
    savingsPercentage: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const dollars = (n: number): number => Math.round(n);
const clamp = (n: number, min: number, max: number): number =>
    Math.min(Math.max(n, min), max);

// ─── Calculator ───────────────────────────────────────────────────────────────

/**
 * calculateSpend
 *
 * Derives all spend totals from the full tool list and recommendations.
 * Pure function — deterministic, no side effects.
 *
 * Algorithm:
 *   currentMonthlySpend  = sum of toolInputs[*].monthlySpend
 *   optimizedMonthlySpend = for each tool:
 *     - if a recommendation exists → use recommendedMonthlyCost
 *     - otherwise                  → use original monthlySpend (no change)
 */
export function calculateSpend({ toolInputs, recommendations }: SpendInput): SpendResult {
    if (toolInputs.length === 0) {
        return {
            currentMonthlySpend: 0,
            optimizedMonthlySpend: 0,
            monthlySavings: 0,
            annualSavings: 0,
            savingsPercentage: 0,
        };
    }

    // Build a lookup map for fast recommendation access
    const recByToolId = new Map(recommendations.map((r) => [r.toolId, r]));

    const currentMonthlySpend = dollars(
        toolInputs.reduce((sum, t) => sum + t.monthlySpend, 0)
    );

    const optimizedMonthlySpend = dollars(
        toolInputs.reduce((sum, t) => {
            const rec = recByToolId.get(t.toolId);
            // If a recommendation exists, use its projected cost; otherwise no change
            return sum + (rec ? rec.recommendedMonthlyCost : t.monthlySpend);
        }, 0)
    );

    const monthlySavings = dollars(currentMonthlySpend - optimizedMonthlySpend);
    const annualSavings = dollars(monthlySavings * 12);
    const savingsPercentage = currentMonthlySpend > 0
        ? Math.round((monthlySavings / currentMonthlySpend) * 100)
        : 0;

    return {
        currentMonthlySpend,
        optimizedMonthlySpend,
        monthlySavings: clamp(monthlySavings, 0, currentMonthlySpend),
        annualSavings: clamp(annualSavings, 0, currentMonthlySpend * 12),
        savingsPercentage: clamp(savingsPercentage, 0, 100),
    };
}
