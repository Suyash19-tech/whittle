import type { ToolRecommendation, OpportunityInsight, ToolCategory, AccentColor } from '@/types/audit';

// ─── Rule engine input ────────────────────────────────────────────────────────

/**
 * A single tool entry as submitted by the user in the audit form.
 * This is the raw input the rules engine operates on.
 */
export interface ToolInput {
    /** Matches an id in SUPPORTED_AI_TOOLS */
    toolId: string;
    /** Display name, e.g. "ChatGPT" */
    toolName: string;
    /** Broad category — used for overlap detection */
    category: ToolCategory;
    /** The plan id the user selected, e.g. "team" */
    planId: string;
    /** The plan display name, e.g. "Team" */
    planName: string;
    /** Monthly spend as entered by the user, in USD */
    monthlySpend: number;
    /** Number of seats/licenses */
    seats: number;
}

/**
 * Full context passed to every rule function.
 * Rules may inspect any field to decide whether they apply.
 */
export interface RuleContext {
    /** The specific tool being evaluated */
    tool: ToolInput;
    /** All tools in the audit — needed for overlap/duplicate detection */
    allTools: ToolInput[];
    /** Team size bucket from the audit form, e.g. "1-5" | "6-20" | "21-50" */
    teamSize: string;
    /** Primary use case id, e.g. "coding" | "writing" | "mixed" */
    useCase: string;
}

// ─── Rule output ──────────────────────────────────────────────────────────────

/**
 * What a rule returns when it fires.
 * Maps directly onto ToolRecommendation — the engine assembles the full
 * object after collecting all rule outputs.
 */
export interface RuleOutput {
    recommendedPlanName: string;
    recommendedMonthlyCost: number;
    reasoning: string;
    confidence: ToolRecommendation['confidence'];
    /** Optimization category label shown in future UI breakdowns */
    optimizationCategory: 'plan-downgrade' | 'seat-reduction' | 'overlap' | 'enterprise-flag';
}

/**
 * A rule function signature.
 * Returns RuleOutput if the rule fires, null if it does not apply.
 * Rules are pure functions — no side effects, no mutations.
 */
export type RuleFn = (ctx: RuleContext) => RuleOutput | null;

// ─── Insight output ───────────────────────────────────────────────────────────

/**
 * Structural insight generated from the full tool list.
 * Insights describe patterns across tools, not individual tool issues.
 */
export type InsightOutput = Omit<OpportunityInsight, 'id'>;

/**
 * An insight rule operates on the full tool list and audit context.
 * Returns an InsightOutput if the pattern is detected, null otherwise.
 */
export type InsightRuleFn = (
    allTools: ToolInput[],
    teamSize: string,
    useCase: string
) => InsightOutput | null;

// ─── Confidence → color mapping ───────────────────────────────────────────────

export const CONFIDENCE_COLOR: Record<ToolRecommendation['confidence'], AccentColor> = {
    high: 'teal',
    medium: 'sky',
    low: 'amber',
};
