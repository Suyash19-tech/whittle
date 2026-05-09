import type { RuleFn } from './types';

/**
 * Tool-level recommendation rules.
 *
 * Each rule is a pure function: (RuleContext) => RuleOutput | null.
 * Return null if the rule does not apply to the given context.
 *
 * Rules are evaluated in order by the engine. The FIRST rule that fires
 * for a given tool wins — subsequent rules for the same tool are skipped.
 * This keeps recommendations focused and avoids conflicting advice.
 *
 * Authoring guidelines:
 *   - One clear condition per rule
 *   - Reasoning must be calm, specific, and financially grounded
 *   - Confidence reflects how certain the signal is:
 *       high   → clear structural mismatch (e.g. Team plan for 1 person)
 *       medium → probable inefficiency (e.g. Business plan for small team)
 *       low    → possible inefficiency (e.g. secondary tool with low spend)
 */

// ─── ChatGPT rules ────────────────────────────────────────────────────────────

/**
 * ChatGPT Team → Plus when seats are very small.
 * Team plan is designed for shared workspaces and admin controls.
 * For 1–2 users, individual Plus plans cover the same workflows at lower cost.
 */
export const chatgptTeamToPlus: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'chatgpt') return null;
    if (tool.planId !== 'team') return null;
    if (tool.seats > 3) return null;

    const perSeatCost = 20; // Plus is $20/seat
    const recommendedCost = tool.seats * perSeatCost;

    return {
        recommendedPlanName: 'Plus',
        recommendedMonthlyCost: recommendedCost,
        reasoning:
            `ChatGPT Team is designed for shared workspaces and centralised admin — features that add value at larger headcounts. ` +
            `With ${tool.seats} seat${tool.seats > 1 ? 's' : ''}, individual Plus plans would cover the same workflows ` +
            `at a meaningfully lower recurring cost.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

/**
 * ChatGPT Team → Plus for small teams (6–20 range).
 * Collaboration features are underutilised when the team is small
 * and primarily using ChatGPT for individual productivity tasks.
 */
export const chatgptTeamSmallTeam: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'chatgpt') return null;
    if (tool.planId !== 'team') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;

    const recommendedCost = Math.round(tool.monthlySpend * 0.45);

    return {
        recommendedPlanName: 'Plus',
        recommendedMonthlyCost: recommendedCost,
        reasoning:
            `For smaller engineering teams, ChatGPT Team's collaboration functionality — shared workspaces, ` +
            `usage analytics, and admin controls — may not justify the additional recurring cost. ` +
            `Individual Plus plans provide the same model access at a lower per-seat rate.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Cursor rules ─────────────────────────────────────────────────────────────

/**
 * Cursor Business → Pro for small teams.
 * Business tier adds SSO, audit logs, and centralised billing —
 * features that become relevant at 50+ seats. Below that threshold,
 * Pro provides identical AI capabilities without the overhead.
 */
export const cursorBusinessToProSmallTeam: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'cursor') return null;
    if (tool.planId !== 'business') return null;
    if (['51-100', '100+'].includes(teamSize)) return null;

    const proPrice = 20; // Cursor Pro is $20/seat
    const recommendedCost = tool.seats * proPrice;

    return {
        recommendedPlanName: 'Pro',
        recommendedMonthlyCost: recommendedCost,
        reasoning:
            `Cursor Business unlocks SSO, audit logs, and centralised billing — capabilities that ` +
            `typically justify the premium at 50+ seats. At your current team size, Pro provides ` +
            `identical AI code generation and context features without the administrative overhead.`,
        confidence: 'medium',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── GitHub Copilot rules ─────────────────────────────────────────────────────

/**
 * GitHub Copilot Business → Individual for very small teams.
 * Business adds policy management and organisation-wide controls.
 * For teams under 5, individual plans are sufficient.
 */
export const copilotBusinessToIndividual: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'github-copilot') return null;
    if (tool.planId !== 'business') return null;
    if (teamSize !== '1-5') return null;

    const individualPrice = 10;
    const recommendedCost = tool.seats * individualPrice;

    return {
        recommendedPlanName: 'Individual',
        recommendedMonthlyCost: recommendedCost,
        reasoning:
            `GitHub Copilot Business adds organisation-wide policy controls and usage reporting — ` +
            `features designed for larger engineering organisations. For a team of your size, ` +
            `Individual plans provide the same in-editor AI assistance at half the per-seat cost.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Claude rules ─────────────────────────────────────────────────────────────

/**
 * Claude Pro → Free when it appears to be a secondary tool.
 * If the team already has ChatGPT or another primary LLM, Claude Pro
 * is likely used infrequently. The free tier covers occasional use.
 */
export const claudeProToFreeSecondary: RuleFn = ({ tool, allTools }) => {
    if (tool.toolId !== 'claude') return null;
    if (tool.planId !== 'pro') return null;

    // Check if another LLM is present — makes Claude secondary
    const hasOtherLLM = allTools.some(
        (t) => t.toolId !== 'claude' && t.category === 'llm'
    );
    if (!hasOtherLLM) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning:
            `With another LLM already in your stack, Claude Pro is likely serving as a secondary ` +
            `model for specific tasks. The free tier provides sufficient access for supplementary ` +
            `use — Pro access can be reinstated if Claude becomes a primary workflow dependency.`,
        confidence: 'low',
        optimizationCategory: 'plan-downgrade',
    };
};

/**
 * Claude Team → Pro for small teams.
 * Team plan adds shared workspaces and admin features.
 * Small teams rarely need centralised Claude administration.
 */
export const claudeTeamToProSmallTeam: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'claude') return null;
    if (tool.planId !== 'team') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;

    const proPrice = 20;
    const recommendedCost = tool.seats * proPrice;

    return {
        recommendedPlanName: 'Pro',
        recommendedMonthlyCost: recommendedCost,
        reasoning:
            `Claude Team's shared workspace and admin features are most valuable when managing ` +
            `access across a larger organisation. For your team size, individual Pro plans ` +
            `provide the same model capabilities without the collaboration overhead.`,
        confidence: 'medium',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Windsurf rules ───────────────────────────────────────────────────────────

/**
 * Windsurf: flag if both Windsurf and Cursor are present.
 * These tools serve the same purpose — AI code editor.
 * Running both is likely redundant.
 */
export const windsurfOverlapWithCursor: RuleFn = ({ tool, allTools }) => {
    if (tool.toolId !== 'windsurf') return null;

    const hasCursor = allTools.some((t) => t.toolId === 'cursor');
    if (!hasCursor) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning:
            `Windsurf and Cursor are both AI-native code editors with overlapping feature sets. ` +
            `Running both simultaneously is likely redundant. Consolidating to a single editor ` +
            `would eliminate this subscription without impacting development capability.`,
        confidence: 'medium',
        optimizationCategory: 'overlap',
    };
};

// ─── Generic enterprise flag ──────────────────────────────────────────────────

/**
 * Flag any enterprise-tier plan for teams under 20.
 * Enterprise plans include SLAs, dedicated support, and compliance features
 * that are rarely necessary below a certain organisational scale.
 */
export const enterpriseOverkillSmallTeam: RuleFn = ({ tool, teamSize }) => {
    if (!['enterprise'].includes(tool.planId)) return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;

    const estimatedCost = Math.round(tool.monthlySpend * 0.35);

    return {
        recommendedPlanName: 'Team',
        recommendedMonthlyCost: estimatedCost,
        reasoning:
            `Enterprise plans bundle SLA guarantees, dedicated support, and compliance tooling ` +
            `that typically become necessary at 100+ seats or in regulated industries. ` +
            `A Team plan would cover your current requirements at a significantly lower cost.`,
        confidence: 'medium',
        optimizationCategory: 'enterprise-flag',
    };
};

// ─── Rule registry ────────────────────────────────────────────────────────────

/**
 * Ordered list of all tool-level rules.
 * The engine evaluates rules in this order and stops at the first match
 * for each tool. Place more specific rules before more general ones.
 */
export const TOOL_RULES: RuleFn[] = [
    // ChatGPT — most specific first
    chatgptTeamToPlus,
    chatgptTeamSmallTeam,
    // Cursor
    cursorBusinessToProSmallTeam,
    // GitHub Copilot
    copilotBusinessToIndividual,
    // Claude
    claudeProToFreeSecondary,
    claudeTeamToProSmallTeam,
    // Windsurf
    windsurfOverlapWithCursor,
    // Generic
    enterpriseOverkillSmallTeam,
];
