import type { ToolRecommendation, AuditSummary, AuditScore } from '@/types/audit';
import { calculateSpend } from './calculators/spendCalculator';
import { calculateScore } from './calculators/scoreCalculator';

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface AuditComputeInput {
    /** Stable identifier for this audit run */
    id: string;
    /** Display date string, e.g. "May 8, 2026" */
    date: string;
    /** Human-readable team size, e.g. "6–20 people" */
    teamSize: string;
    /** Primary use case label */
    useCase: string;
    /** The full list of tool recommendations */
    recommendations: ToolRecommendation[];
}

export interface AuditComputeResult {
    /** Fully computed summary — ready to pass to SavingsHero */
    summary: AuditSummary;
    /** Fully computed score — ready to pass to AuditScoreCard */
    score: AuditScore;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

/**
 * computeAuditSummary
 *
 * Single entry point that runs both calculators and returns a fully
 * populated AuditSummary and AuditScore.
 *
 * This is the function the results page (and eventually the API route)
 * should call. It keeps the page free of calculation logic.
 *
 * Pure function — deterministic, no side effects.
 *
 * @example
 *   const { summary, score } = computeAuditSummary({
 *     id: 'audit-001',
 *     date: 'May 8, 2026',
 *     teamSize: '6–20 people',
 *     useCase: 'Coding & Development',
 *     recommendations,
 *   });
 */
export function computeAuditSummary(input: AuditComputeInput): AuditComputeResult {
    const spend = calculateSpend({ recommendations: input.recommendations });

    const score = calculateScore({
        recommendations: input.recommendations,
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
