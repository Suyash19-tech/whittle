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

        // Evaluate all rules for this tool
        const toolRecs = new Map<string, ToolRecommendation>();

        for (const rule of TOOL_RULES) {
            const output = rule(ctx);
            if (!output) continue;

            // Only emit a recommendation if there's an actual saving
            const monthlySaving = tool.monthlySpend - output.recommendedMonthlyCost;
            if (monthlySaving <= 0) continue;

            const existing = toolRecs.get(output.recommendedPlanName);

            if (existing) {
                // Merge duplicate findings for the same recommended plan
                const confWeight = { high: 3, medium: 2, low: 1 };
                const newWeight = confWeight[output.confidence];
                const oldWeight = confWeight[existing.confidence];

                if (newWeight > oldWeight) {
                    // New rule has higher confidence, promote confidence and merge reasoning
                    toolRecs.set(output.recommendedPlanName, {
                        ...existing,
                        reasoning: `${output.reasoning} (Additional context: ${existing.reasoning})`,
                        confidence: output.confidence,
                        confidenceColor: CONFIDENCE_COLOR[output.confidence],
                    });
                } else if (newWeight === oldWeight) {
                    // Same confidence, merge reasoning
                    existing.reasoning = `${existing.reasoning} (Additional context: ${output.reasoning})`;
                } else {
                    // Old rule has higher confidence, keep old but append new reasoning
                    existing.reasoning = `${existing.reasoning} (Additional context: ${output.reasoning})`;
                }
            } else {
                toolRecs.set(output.recommendedPlanName, {
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
                    optimizationCategory: output.optimizationCategory,
                    priority: 0,
                });
            }
        }

        if (toolRecs.size === 0) {
            // Generate a lightweight KEEP verdict if no optimization rules matched
            const keepPhrases = [
                "appears well-aligned with your current team size and workflow requirements.",
                "is appropriately sized for your operational scale. No changes needed.",
                "fits your reported use case efficiently. Keep this configuration.",
            ];
            // Deterministic rotation based on string length to avoid identical repeated phrases
            const phrase = keepPhrases[tool.toolName.length % keepPhrases.length];

            toolRecs.set(tool.planName, {
                toolId: tool.toolId,
                toolName: tool.toolName,
                category: tool.category,
                currentPlan: tool.planName,
                currentMonthlyCost: tool.monthlySpend,
                recommendedPlan: tool.planName, // Keep current plan
                recommendedMonthlyCost: tool.monthlySpend, // No change in cost
                monthlySaving: 0,
                annualSaving: 0,
                reasoning: `${tool.toolName} ${tool.planName} ${phrase}`,
                confidence: 'high',
                confidenceColor: CONFIDENCE_COLOR['high'],
                optimizationCategory: 'keep',
                priority: 0,
            });
        }

        recommendations.push(...toolRecs.values());
    });

    // Group overlap recommendations to avoid repetitive cards
    const finalRecs: ToolRecommendation[] = [];
    const overlapGroups = new Map<string, ToolRecommendation[]>();

    for (const rec of recommendations) {
        if (rec.optimizationCategory === 'overlap') {
            // Group by the exact reasoning string, since overlap rules generate identical reasoning for the group
            const groupKey = rec.reasoning; 
            if (!overlapGroups.has(groupKey)) overlapGroups.set(groupKey, []);
            overlapGroups.get(groupKey)!.push(rec);
        } else {
            finalRecs.push(rec);
        }
    }

    for (const group of overlapGroups.values()) {
        if (group.length > 1) {
            const combinedSaving = group.reduce((sum, r) => sum + r.monthlySaving, 0);
            const toolNames = group.map(r => r.toolName).join(' & ');
            const toolIds = group.map(r => r.toolId).join(',');

            finalRecs.push({
                ...group[0],
                toolId: toolIds,
                toolName: toolNames,
                monthlySaving: combinedSaving,
                annualSaving: combinedSaving * 12,
                currentMonthlyCost: group.reduce((sum, r) => sum + r.currentMonthlyCost, 0),
                recommendedMonthlyCost: group.reduce((sum, r) => sum + r.recommendedMonthlyCost, 0),
            });
        } else {
            finalRecs.push(group[0]);
        }
    }

    // Sort by monthly saving descending, then assign priority rank
    finalRecs.sort((a, b) => b.monthlySaving - a.monthlySaving);
    finalRecs.forEach((rec, i) => {
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

    return { recommendations: finalRecs, insights };
}
