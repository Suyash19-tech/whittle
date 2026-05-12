/**
 * Pricing Catalog — single source of truth for all AI tool pricing.
 *
 * All prices are per-seat per-month in USD.
 * Variable/usage-based plans use 0 as the base (user enters actual spend).
 *
 * This catalog is the ONLY place prices are defined.
 * The form, engine, and calculators all derive from here.
 *
 * Last reviewed: May 12, 2026
 * Sources: official pricing pages for each provider.
 */

export type PlanId = string;
export type ToolId = string;

export interface PlanDefinition {
    id: PlanId;
    name: string;
    /** Price per seat per month in USD. null = custom/contact sales. */
    pricePerSeat: number | null;
    /** If true, price is usage-based and user must enter actual spend */
    isVariablePricing?: boolean;
}

export interface ToolPricing {
    toolId: ToolId;
    plans: PlanDefinition[];
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export const PRICING_CATALOG: Record<ToolId, PlanDefinition[]> = {
    chatgpt: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'plus', name: 'Plus', pricePerSeat: 20 },
        { id: 'team', name: 'Team', pricePerSeat: 30 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: 60 },
    ],
    claude: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 20 },
        { id: 'max', name: 'Max', pricePerSeat: 100 },
        { id: 'team', name: 'Team', pricePerSeat: 30 },
    ],
    cursor: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 20 },
        { id: 'business', name: 'Business', pricePerSeat: 40 },
    ],
    'github-copilot': [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'individual', name: 'Individual', pricePerSeat: 10 },
        { id: 'business', name: 'Business', pricePerSeat: 21 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: 39 },
    ],
    gemini: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'advanced', name: 'Advanced', pricePerSeat: 20 },
    ],
    windsurf: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 15 },
    ],
    'openai-api': [
        { id: 'payg', name: 'Pay-as-you-go', pricePerSeat: 0, isVariablePricing: true },
    ],
    'anthropic-api': [
        { id: 'payg', name: 'Pay-as-you-go', pricePerSeat: 0, isVariablePricing: true },
    ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * getPlanPrice
 * Returns the per-seat price for a given tool + plan combination.
 * Returns null for custom/enterprise pricing.
 * Returns 0 for variable pricing (user enters actual spend).
 */
export function getPlanPrice(toolId: ToolId, planId: PlanId): number | null {
    const plans = PRICING_CATALOG[toolId];
    if (!plans) return null;
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return null;
    return plan.pricePerSeat;
}

/**
 * computeMonthlySpend
 * Derives monthly spend from plan price × seats.
 * Returns null if the plan has custom pricing (user must enter manually).
 * Returns 0 for variable pricing (user enters actual spend separately).
 */
export function computeMonthlySpend(
    toolId: ToolId,
    planId: PlanId,
    seats: number
): number | null {
    const price = getPlanPrice(toolId, planId);
    if (price === null) return null; // custom pricing
    return price * Math.max(1, seats);
}

/**
 * isVariablePricing
 * Returns true if the plan is usage-based (API tools).
 */
export function isVariablePricing(toolId: ToolId, planId: PlanId): boolean {
    const plans = PRICING_CATALOG[toolId];
    if (!plans) return false;
    const plan = plans.find((p) => p.id === planId);
    return plan?.isVariablePricing === true;
}

/**
 * getPlansForTool
 * Returns the plan list for a tool, falling back to an empty array.
 */
export function getPlansForTool(toolId: ToolId): PlanDefinition[] {
    return PRICING_CATALOG[toolId] ?? [];
}
