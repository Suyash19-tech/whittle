import type { InsightRuleFn } from './types';

// ─── Capability overlap groups ────────────────────────────────────────────────

const HIGH_OVERLAP_GROUPS: string[][] = [
    ['cursor', 'github-copilot', 'windsurf'],
];

const PROVIDER_MAP: Record<string, string> = {
    'chatgpt': 'OpenAI',
    'openai-api': 'OpenAI',
    'claude': 'Anthropic',
    'anthropic-api': 'Anthropic',
};

// ─── Insight rules ────────────────────────────────────────────────────────────

/** High capability overlap: same-purpose tools (e.g. Cursor + Copilot). */
export const capabilityOverlapInsight: InsightRuleFn = (allTools) => {
    const names: string[] = [];
    for (const group of HIGH_OVERLAP_GROUPS) {
        const inGroup = allTools.filter((t) => group.includes(t.toolId));
        if (inGroup.length >= 2) names.push(...inGroup.map((t) => t.toolName));
    }
    const unique = [...new Set(names)];
    if (unique.length < 2) return null;

    return {
        label: `${unique.join(' and ')} serve overlapping purposes — consolidation likely saves cost`,
        iconName: 'Layers',
        color: 'amber',
    };
};

/**
 * Provider overlap: multiple products from the same provider.
 * ChatGPT + OpenAI API is intentional — don't flag it.
 */
export const providerOverlapInsight: InsightRuleFn = (allTools) => {
    const byProvider: Record<string, string[]> = {};
    allTools.forEach((t) => {
        const p = PROVIDER_MAP[t.toolId];
        if (p) { byProvider[p] = byProvider[p] ?? []; byProvider[p].push(t.toolName); }
    });

    const nonObvious = Object.entries(byProvider)
        .filter(([, ts]) => ts.length > 1)
        .filter(([provider, ts]) => {
            if (provider === 'OpenAI' && ts.includes('ChatGPT') && ts.includes('OpenAI API')) return false;
            if (provider === 'Anthropic' && ts.includes('Claude') && ts.includes('Anthropic API')) return false;
            return true;
        });

    if (nonObvious.length === 0) return null;
    const [provider] = nonObvious[0];

    return {
        label: `Multiple ${provider} products in stack — review for redundancy`,
        iconName: 'Layers',
        color: 'sky',
    };
};

/**
 * API spend concentration.
 * High API spend is not inherently bad — recommend monitoring, not removal.
 */
export const apiSpendConcentration: InsightRuleFn = (allTools) => {
    const total = allTools.reduce((s, t) => s + t.monthlySpend, 0);
    if (total === 0) return null;
    const apiSpend = allTools.filter((t) => t.category === 'api').reduce((s, t) => s + t.monthlySpend, 0);
    const ratio = apiSpend / total;
    if (ratio < 0.50) return null;

    const pct = Math.round(ratio * 100);

    if (ratio >= 0.85) {
        return {
            label: `API infrastructure accounts for ${pct}% of AI spend — usage monitoring recommended`,
            iconName: 'AlertCircle',
            color: 'amber',
        };
    }
    if (ratio >= 0.70) {
        return {
            label: `API spend is dominant — consider caching repetitive generations to reduce token costs`,
            iconName: 'TrendingDown',
            color: 'sky',
        };
    }
    return {
        label: `API spend represents ${pct}% of total — audit token-heavy workflows for efficiency`,
        iconName: 'TrendingDown',
        color: 'slate',
    };
};

/** Enterprise plan on a small team — structural mismatch. */
export const enterpriseFeaturesUnderutilised: InsightRuleFn = (allTools, teamSize) => {
    const hasEnterprise = allTools.some((t) => t.planId === 'enterprise');
    if (!hasEnterprise) return null;
    if (['51-100', '100+'].includes(teamSize)) return null;

    return {
        label: 'Enterprise-tier features are unlikely to be fully utilised at your current team size',
        iconName: 'AlertCircle',
        color: 'sky',
    };
};

/** Significant recoverable savings — positive reinforcement. */
export const significantSavingsAvailable: InsightRuleFn = (allTools) => {
    const subscriptionSpend = allTools
        .filter((t) => t.category !== 'api')
        .reduce((s, t) => s + t.monthlySpend, 0);
    const annualEstimate = Math.round(subscriptionSpend * 0.25 * 12);
    if (annualEstimate < 600) return null;

    return {
        label: `Estimated annual savings of $${annualEstimate.toLocaleString()}+ are within reach`,
        iconName: 'TrendingDown',
        color: 'teal',
    };
};

/**
 * Multiple LLMs — nuanced.
 * 2 LLMs is fine (ChatGPT + Claude is common). Only flag 3+.
 */
export const multipleLLMsInsight: InsightRuleFn = (allTools) => {
    const llms = allTools.filter((t) => t.category === 'llm');
    if (llms.length < 3) return null;

    return {
        label: `${llms.length} LLMs in stack — verify each serves a distinct workflow`,
        iconName: 'Layers',
        color: 'sky',
    };
};

/** Stack complexity: many paid subscriptions. */
export const stackComplexity: InsightRuleFn = (allTools) => {
    const paid = allTools.filter((t) => !['free', 'payg'].includes(t.planId));
    if (paid.length <= 4) return null;

    return {
        label: `${paid.length} active paid subscriptions — a periodic stack review is recommended`,
        iconName: 'Zap',
        color: 'slate',
    };
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const INSIGHT_RULES: InsightRuleFn[] = [
    capabilityOverlapInsight,
    providerOverlapInsight,
    apiSpendConcentration,
    enterpriseFeaturesUnderutilised,
    significantSavingsAvailable,
    multipleLLMsInsight,
    stackComplexity,
];
