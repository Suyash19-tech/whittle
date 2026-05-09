import { SUPPORTED_AI_TOOLS } from '@/constants';
import type { ToolInput } from './rules/types';

/**
 * buildToolInputs
 *
 * Converts the Zustand audit store's toolConfigs shape into the
 * ToolInput[] format the rules engine expects.
 *
 * This is the adapter between the form layer and the engine layer.
 * It resolves tool metadata (name, category) from SUPPORTED_AI_TOOLS
 * and merges it with the user-entered config (plan, spend, seats).
 *
 * @example
 *   const tools = buildToolInputs({
 *     selectedTools: ['chatgpt', 'cursor'],
 *     toolConfigs: {
 *       chatgpt: { plan: 'team', monthlySpend: 150, seats: 5 },
 *       cursor:  { plan: 'business', monthlySpend: 160, seats: 4 },
 *     },
 *   });
 */
export function buildToolInputs(params: {
    selectedTools: string[];
    toolConfigs: Record<string, { plan: string; monthlySpend: number; seats: number }>;
}): ToolInput[] {
    const { selectedTools, toolConfigs } = params;

    return selectedTools.flatMap((toolId) => {
        const meta = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
        const config = toolConfigs[toolId];

        // Skip if metadata or config is missing
        if (!meta || !config) return [];

        // Resolve plan display name from the tool's plan list
        const planMeta = meta.plans.find((p) => p.id === config.plan);
        const planName = planMeta?.name ?? config.plan;

        return [
            {
                toolId: meta.id,
                toolName: meta.name,
                category: meta.category,
                planId: config.plan,
                planName,
                monthlySpend: config.monthlySpend,
                seats: config.seats,
            } satisfies ToolInput,
        ];
    });
}
