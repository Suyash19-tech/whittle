/**
 * Pricing Catalog — single source of truth for all AI tool pricing.
 *
 * All prices are per-seat per-month in USD (monthly billing).
 * Annual billing typically saves 15–20% but we use monthly rates as the baseline.
 *
 * Sources (verified May 2026):
 *   Cursor:         https://docs.cursor.com/account/pricing
 *   GitHub Copilot: https://github.com/features/copilot/plans
 *   Claude:         https://www.anthropic.com/pricing
 *   ChatGPT:        https://openai.com/chatgpt/pricing/
 *   Gemini:         https://gemini.google/subscriptions/
 *   Windsurf:       https://codeium.com/pricing
 *   OpenAI API:     https://openai.com/api/pricing/ (variable — user enters actual)
 *   Anthropic API:  https://www.anthropic.com/api  (variable — user enters actual)
 *
 * Last reviewed: May 12, 2026
 */

export type PlanId = string;
export type ToolId = string;

export interface PlanDefinition {
    id: PlanId;
    name: string;
    /** Price per seat per month in USD. null = custom/contact sales. */
    pricePerSeat: number | null;
    /** If true, price is usage-based — user must enter actual spend */
    isVariablePricing?: boolean;
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export const PRICING_CATALOG: Record<ToolId, PlanDefinition[]> = {

    // ── Cursor ──────────────────────────────────────────────────────────────────
    // Hobby (free), Pro $20/mo, Business $40/seat/mo
    // Source: cursor.com/pricing (May 2026)
    cursor: [
        { id: 'hobby', name: 'Hobby', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 20 },
        { id: 'business', name: 'Business', pricePerSeat: 40 },
    ],

    // ── GitHub Copilot ───────────────────────────────────────────────────────────
    // Free, Individual $10, Business $19, Enterprise $39/seat/mo
    // Source: github.com/features/copilot/plans (May 2026)
    'github-copilot': [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'individual', name: 'Individual', pricePerSeat: 10 },
        { id: 'business', name: 'Business', pricePerSeat: 19 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: 39 },
    ],

    // ── Claude (Anthropic) ───────────────────────────────────────────────────────
    // Free, Pro $20/mo, Max $100/mo (5x), Max $200/mo (20x), Team $30/seat/mo
    // Enterprise: custom pricing (null)
    // Source: anthropic.com/pricing (May 2026)
    claude: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 20 },
        { id: 'max-5x', name: 'Max (5x)', pricePerSeat: 100 },
        { id: 'max-20x', name: 'Max (20x)', pricePerSeat: 200 },
        { id: 'team', name: 'Team', pricePerSeat: 30 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: null },
        { id: 'api', name: 'API (direct)', pricePerSeat: 0, isVariablePricing: true },
    ],

    // ── ChatGPT (OpenAI) ─────────────────────────────────────────────────────────
    // Free, Plus $20/mo, Pro $200/mo, Team $30/seat/mo, Enterprise custom
    // Source: openai.com/chatgpt/pricing/ (May 2026)
    chatgpt: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'plus', name: 'Plus', pricePerSeat: 20 },
        { id: 'pro', name: 'Pro', pricePerSeat: 200 },
        { id: 'team', name: 'Team', pricePerSeat: 30 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: null },
        { id: 'api', name: 'API (direct)', pricePerSeat: 0, isVariablePricing: true },
    ],

    // ── OpenAI API ───────────────────────────────────────────────────────────────
    // Pure usage-based — no fixed seat price
    // Source: openai.com/api/pricing/ (May 2026)
    'openai-api': [
        { id: 'payg', name: 'Pay-as-you-go', pricePerSeat: 0, isVariablePricing: true },
    ],

    // ── Anthropic API ────────────────────────────────────────────────────────────
    // Pure usage-based — no fixed seat price
    // Source: anthropic.com/api (May 2026)
    'anthropic-api': [
        { id: 'payg', name: 'Pay-as-you-go', pricePerSeat: 0, isVariablePricing: true },
    ],

    // ── Gemini (Google) ──────────────────────────────────────────────────────────
    // Free, AI Pro $19.99/mo (bundled with Google One AI Premium)
    // AI Ultra: higher tier, ~$249.99/mo (Google One AI Ultra)
    // Source: gemini.google/subscriptions/ (May 2026)
    gemini: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'ai-pro', name: 'AI Pro', pricePerSeat: 19.99 },
        { id: 'ai-ultra', name: 'AI Ultra', pricePerSeat: 249.99 },
        { id: 'api', name: 'API (direct)', pricePerSeat: 0, isVariablePricing: true },
    ],

    // ── Windsurf (Codeium) ───────────────────────────────────────────────────────
    // Free (25 credits/mo), Pro $20/mo, Teams $40/seat/mo, Enterprise $60/seat/mo
    // Source: codeium.com/pricing (May 2026)
    windsurf: [
        { id: 'free', name: 'Free', pricePerSeat: 0 },
        { id: 'pro', name: 'Pro', pricePerSeat: 20 },
        { id: 'teams', name: 'Teams', pricePerSeat: 40 },
        { id: 'enterprise', name: 'Enterprise', pricePerSeat: 60 },
    ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getPlanPrice(toolId: ToolId, planId: PlanId): number | null {
    const plan = PRICING_CATALOG[toolId]?.find((p) => p.id === planId);
    return plan?.pricePerSeat ?? null;
}

export function computeMonthlySpend(
    toolId: ToolId,
    planId: PlanId,
    seats: number
): number | null {
    const price = getPlanPrice(toolId, planId);
    if (price === null) return null;
    return price * Math.max(1, seats);
}

export function isVariablePricing(toolId: ToolId, planId: PlanId): boolean {
    const plan = PRICING_CATALOG[toolId]?.find((p) => p.id === planId);
    return plan?.isVariablePricing === true;
}

export function getPlansForTool(toolId: ToolId): PlanDefinition[] {
    return PRICING_CATALOG[toolId] ?? [];
}
