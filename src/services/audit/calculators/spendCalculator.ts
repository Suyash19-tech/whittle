import type { ToolRecommendation } from '@/types/audit';

// ─── I/O types ────────────────────────────────────────────────────────────────

/** Input: the raw list of tool recommendations from the audit form */
export interface SpendInput {
    recommendations: ToolRecommendation[];
}

/** Output: all derived spend figures, rounded to the nearest dollar */
export interface SpendResult {
    /** Sum of currentMonthlyCost across all tools */
    currentMonthlySpend: number;
    /** Sum of recommendedMonthlyCost across all tools */
    optimizedMonthlySpend: number;
    /** currentMonthlySpend - optimizedMonthlySpend */
    monthlySavings: number;
    /** monthlySavings * 12 */
    annualSavings: number;
    /** Percentage reduction, rounded to nearest integer */
    savingsPercentage: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Round a float to the nearest integer dollar */
const dollars = (n: number): number => Math.round(n);

/** Clamp a value between min and max (inclusive) */
const clamp = (n: number, min: number, max: number): number =>
    Math.min(Math.max(n, min), max);

// ─── Calculator ───────────────────────────────────────────────────────────────

/**
 * calculateSpend
 *
 * Derives all spend totals from a list of tool recommendations.
 * Pure function — deterministic, no side effects, no external dependencies.
 *
 * @example
 *   const result = calculateSpend({ recommendations });
 *   // { currentMonthlySpend: 412, optimizedMonthlySpend: 285, ... }
 */
export function calculateSpend({ recommendations }: SpendInput): SpendResult {
    if (recommendations.length === 0) {
        return {
            currentMonthlySpend: 0,
            optimizedMonthlySpend: 0,
            monthlySavings: 0,
            annualSavings: 0,
            savingsPercentage: 0,
        };
    }

    const currentMonthlySpend = dollars(
        recommendations.reduce((sum, r) => sum + r.currentMonthlyCost, 0)
    );

    const optimizedMonthlySpend = dollars(
        recommendations.reduce((sum, r) => sum + r.recommendedMonthlyCost, 0)
    );

    const monthlySavings = dollars(currentMonthlySpend - optimizedMonthlySpend);
    const annualSavings = dollars(monthlySavings * 12);

    const savingsPercentage =
        currentMonthlySpend > 0
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
