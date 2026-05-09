import type { ToolRecommendation, OpportunityInsight } from '@/types/audit';
import type { ToolInput, RuleContext } from './types';
import { CONFIDENCE_COLOR } from './types';
import { TOOL_RULES } from './toolRules';
import { INSIGHT_RULES } from './insightRules';

// ─── Engine I/O ───────────────────────────────────────────────────────────────

export interface EngineInput {
    tools: ToolInput[];
    teamSize: string;
    useCase: string;
}

export interface EngineOutput {
    /** Tool-level recommendations, sorted by monthlySaving descending */
    recommendations: ToolRecommendation[];
    /** Cross-stack structural insights */
    insights: OpportunityInsight[];
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * generateRecommendations
 *
 * The main entry point for the rules engine.
 * Evaluates all tool rules and insight rules against the provided input
 * and returns a fully typed EngineOutput.
 *
 * Tool rules: evaluated per tool, first match wins.
 * Insight rules: evaluated against the full tool list, all matches collected.
 *
 * Pure function — deterministic, no side effects.
 *
 * @example
 *   const { recommendations, insights } = generateRecommendations({
 *     tools,
 *     teamSize: '6-20',
 *     useCase: 'coding',
 *   });
 */
export function generateRecommendations(input: EngineInput): EngineOutput {
    const { tools, teamSize, useCase } = input;

    // ── Tool-level recommendations ──────────────────────────────────────────────
    const recommendations: ToolRecommendation[] = [];

    tools.forEach((tool) => {
        // Skip tools that are already on the cheapest plan (free / pay-as-you-go)
        if (['free', 'payg'].includes(tool.planId)) return;

        const ctx: RuleContext = { tool, allTools: tools, teamSize, useCase };

        // Evaluate rules in order — stop at first match for this tool
        for (const rule of TOOL_RULES) {
            const output = rule(ctx);
            if (!output) continue;

            // Only emit a recommendation if there's an actual saving
            const monthlySaving = tool.monthlySpend - output.recommendedMonthlyCost;
            if (monthlySaving <= 0) break;

            recommendations.push({
                toolId: tool.toolId,
                toolName: tool.toolName,
                category: tool.category,
                currentPlan: tool.planName,
                currentMonthlyCost: tool.monthlySpend,
                recommendedPlan: output.recommendedPlanName,
                recommendedMonthlyCost: output.recommendedMonthlyCost,
                monthlySaving,
                annualSaving: monthlySaving * 12,
                reasoning: output.reasoning,
                confidence: output.confidence,
                confidenceColor: CONFIDENCE_COLOR[output.confidence],
                // Priority assigned after sorting — placeholder for now
                priority: 0,
            });

            break; // First matching rule wins
        }
    });

    // Sort by monthly saving descending, then assign priority rank
    recommendations.sort((a, b) => b.monthlySaving - a.monthlySaving);
    recommendations.forEach((rec, i) => {
        rec.priority = i + 1;
    });

    // ── Structural insights ─────────────────────────────────────────────────────
    const insights: OpportunityInsight[] = [];

    INSIGHT_RULES.forEach((rule, i) => {
        const output = rule(tools, teamSize, useCase);
        if (!output) return;

        insights.push({
            id: `insight-${i}-${output.iconName.toLowerCase()}`,
            label: output.label,
            iconName: output.iconName,
            color: output.color,
        });
    });

    return { recommendations, insights };
}
