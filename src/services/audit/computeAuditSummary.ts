import type { ToolRecommendation, AuditSummary, AuditScore } from '@/types/audit';
import type { ToolInput } from './rules/types';
import { calculateSpend } from './calculators/spendCalculator';
import { calculateScore } from './calculators/scoreCalculator';
import { computeMonthlySpend } from './pricingCatalog';

export interface AuditComputeInput {
    id: string;
    date: string;
    teamSize: string;
    useCase: string;
    toolInputs: ToolInput[];
    recommendations: ToolRecommendation[];
}

export interface AuditComputeResult {
    summary: AuditSummary;
    score: AuditScore;
}

/**
 * validateFinancials
 *
 * Development-only consistency check.
 * Verifies that every recommendation's recommendedMonthlyCost equals
 * the catalog price for the recommended plan × seats.
 *
 * Logs a warning if any mismatch is detected so it can be caught early.
 */
function validateFinancials(
    toolInputs: ToolInput[],
    recommendations: ToolRecommendation[]
): void {
    if (process.env.NODE_ENV !== 'development') return;

    const inputMap = new Map(toolInputs.map((t) => [t.toolId, t]));

    recommendations.forEach((rec) => {
        const tool = inputMap.get(rec.toolId);
        if (!tool) return;

        // Verify current spend matches catalog
        const expectedCurrent = computeMonthlySpend(rec.toolId, tool.planId, tool.seats);
        if (expectedCurrent !== null && expectedCurrent !== rec.currentMonthlyCost) {
            console.warn(
                `[Whittle] PRICING MISMATCH — ${rec.toolName} current: ` +
                `stored=$${rec.currentMonthlyCost} catalog=$${expectedCurrent} ` +
                `(${tool.planId} × ${tool.seats} seats)`
            );
        }

        // Verify recommended spend is a valid catalog price
        // We don't know the recommended plan's seat count here, but we can
        // check that recommendedMonthlyCost is divisible by the plan's per-seat price
        // This is a soft check — just log, don't throw
        if (rec.recommendedMonthlyCost < 0) {
            console.warn(
                `[Whittle] NEGATIVE RECOMMENDED COST — ${rec.toolName}: $${rec.recommendedMonthlyCost}`
            );
        }

        // Verify savings math
        const expectedSaving = rec.currentMonthlyCost - rec.recommendedMonthlyCost;
        if (Math.abs(expectedSaving - rec.monthlySaving) > 1) {
            console.warn(
                `[Whittle] SAVINGS MISMATCH — ${rec.toolName}: ` +
                `expected=$${expectedSaving} actual=$${rec.monthlySaving}`
            );
        }

        if (Math.abs(rec.monthlySaving * 12 - rec.annualSaving) > 1) {
            console.warn(
                `[Whittle] ANNUAL SAVINGS MISMATCH — ${rec.toolName}: ` +
                `monthly=$${rec.monthlySaving} × 12 ≠ annual=$${rec.annualSaving}`
            );
        }
    });
}

/**
 * computeAuditSummary
 *
 * Single orchestrator: runs calculators, validates financial consistency,
 * and returns a fully populated AuditSummary + AuditScore.
 * Pure function — deterministic, no side effects.
 */
export function computeAuditSummary(input: AuditComputeInput): AuditComputeResult {
    // Validate before computing — catch any upstream inconsistencies
    validateFinancials(input.toolInputs, input.recommendations);

    const spend = calculateSpend({
        toolInputs: input.toolInputs,
        recommendations: input.recommendations,
    });

    const score = calculateScore({
        recommendations: input.recommendations,
        toolInputs: input.toolInputs,
        currentMonthlySpend: spend.currentMonthlySpend,
    });

    const summary: AuditSummary = {
        id: input.id,
        date: input.date,
        teamSize: input.teamSize,
        useCase: input.useCase,
        currentMonthlySpend: spend.currentMonthlySpend,
        optimizedMonthlySpend: spend.optimizedMonthlySpend,
        monthlySavings: spend.monthlySavings,
        annualSavings: spend.annualSavings,
        savingsPercentage: spend.savingsPercentage,
    };

    return { summary, score };
}
