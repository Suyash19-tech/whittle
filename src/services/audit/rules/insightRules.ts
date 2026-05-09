import type { InsightRuleFn, ToolInput } from './types';

/**
 * Insight rules — structural patterns across the full tool list.
 *
 * Unlike tool rules (which evaluate one tool at a time), insight rules
 * look at the entire stack and surface cross-cutting observations.
 *
 * Each rule returns a single InsightOutput or null.
 * All matching insights are collected and shown in the Opportunity Insights section.
 */

// ─── Overlap detection ────────────────────────────────────────────────────────

/**
 * Detect multiple tools in the same category.
 * More than one LLM or more than one code editor is a common source of waste.
 */
export const overlappingSubscriptions: InsightRuleFn = (allTools) => {
    const categoryCounts = allTools.reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + 1;
        return acc;
    }, {});

    const overlapping = Object.values(categoryCounts).filter((n) => n > 1).length;
    if (overlapping === 0) return null;

    const total = Object.entries(categoryCounts)
        .filter(([, n]) => n > 1)
        .reduce((sum, [, n]) => sum + n, 0);

    return {
        label: `${total} overlapping subscription${total > 1 ? 's' : ''} detected`,
        iconName: 'Layers',
        color: 'amber',
    };
};

// ─── Savings threshold ────────────────────────────────────────────────────────

/**
 * Surface a positive insight when total potential savings exceed $1,000/year.
 * This reinforces the value of acting on recommendations.
 */
export const significantAnnualSavings: InsightRuleFn = (allTools) => {
    const totalMonthlySavings = allTools.reduce((sum, t) => {
        // We don't have recommended costs here — use a conservative 30% estimate
        // The real figure comes from the recommendation engine output
        return sum + t.monthlySpend * 0.3;
    }, 0);

    const annualEstimate = Math.round(totalMonthlySavings * 12);
    if (annualEstimate < 500) return null;

    return {
        label: `Potential annual savings exceed $${annualEstimate.toLocaleString()}`,
        iconName: 'TrendingDown',
        color: 'teal',
    };
};

// ─── Enterprise feature flag ──────────────────────────────────────────────────

/**
 * Flag when any tool is on an enterprise plan.
 * Enterprise tiers include features (SLA, compliance, SSO) that are
 * rarely necessary for early-stage teams.
 */
export const enterpriseFeaturesUnderutilised: InsightRuleFn = (allTools, teamSize) => {
    const hasEnterprise = allTools.some((t) => t.planId === 'enterprise');
    if (!hasEnterprise) return null;
    if (['51-100', '100+'].includes(teamSize)) return null;

    return {
        label: 'Enterprise features may be underutilised at your team size',
        iconName: 'AlertCircle',
        color: 'sky',
    };
};

// ─── Coding assistant overlap ─────────────────────────────────────────────────

/**
 * Specifically flag when multiple code editors are present.
 * Cursor, GitHub Copilot, and Windsurf all serve the same core purpose.
 */
export const multipleCodeEditors: InsightRuleFn = (allTools) => {
    const codeTools = allTools.filter((t) => t.category === 'code');
    if (codeTools.length < 2) return null;

    return {
        label: `${codeTools.length} AI code editors detected — consolidation possible`,
        iconName: 'Zap',
        color: 'amber',
    };
};

// ─── Quick win ────────────────────────────────────────────────────────────────

/**
 * Surface a quick-win insight when at least one high-confidence
 * recommendation exists. Encourages action.
 */
export const quickWinAvailable: InsightRuleFn = (allTools) => {
    // Proxy: if any tool is on a team/business plan with few seats, a quick win exists
    const hasQuickWin = allTools.some(
        (t) => ['team', 'business'].includes(t.planId) && t.seats <= 5
    );
    if (!hasQuickWin) return null;

    return {
        label: 'At least one high-confidence optimisation is immediately actionable',
        iconName: 'Zap',
        color: 'teal',
    };
};

// ─── Insight rule registry ────────────────────────────────────────────────────

/**
 * All insight rules, evaluated against the full tool list.
 * All matching rules fire (unlike tool rules which stop at first match).
 */
export const INSIGHT_RULES: InsightRuleFn[] = [
    overlappingSubscriptions,
    significantAnnualSavings,
    enterpriseFeaturesUnderutilised,
    multipleCodeEditors,
    quickWinAvailable,
];
