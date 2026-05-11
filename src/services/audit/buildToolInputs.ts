import { SUPPORTED_AI_TOOLS } from '@/constants';
import { computeMonthlySpend, isVariablePricing } from './pricingCatalog';
import type { ToolInput } from './rules/types';

/**
 * buildToolInputs
 *
 * Converts the Zustand store's toolConfigs into ToolInput[] for the engine.
 *
 * CRITICAL: monthlySpend is ALWAYS re-derived from the pricing catalog here,
 * not taken blindly from the store. This is the final consistency gate —
 * even if the store somehow holds a stale value, the engine always operates
 * on the mathematically correct (planPrice × seats) figure.
 *
 * Exception: variable-pricing plans (API tools) use the store value because
 * their spend is usage-based and cannot be derived from a fixed price.
 */
export function buildToolInputs(params: {
    selectedTools: string[];
    toolConfigs: Record<string, { plan: string; monthlySpend: number; seats: number }>;
}): ToolInput[] {
    const { selectedTools, toolConfigs } = params;

    return selectedTools.flatMap((toolId) => {
        const meta = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
        const config = toolConfigs[toolId];

        if (!meta || !config || !config.plan) return [];

        const planMeta = meta.plans.find((p) => p.id === config.plan);
        const planName = planMeta?.name ?? config.plan;

        // Re-derive spend from catalog — this is the single source of truth.
        // For variable pricing, fall back to the store value (user-entered).
        const catalogSpend = computeMonthlySpend(toolId, config.plan, config.seats);
        const monthlySpend = (catalogSpend !== null && !isVariablePricing(toolId, config.plan))
            ? catalogSpend
            : config.monthlySpend;

        return [{
            toolId: meta.id,
            toolName: meta.name,
            category: meta.category,
            planId: config.plan,
            planName,
            monthlySpend,
            seats: config.seats,
        } satisfies ToolInput];
    });
}
