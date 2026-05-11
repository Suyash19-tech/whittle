import type { RuleFn } from './types';
import { computeMonthlySpend } from '../pricingCatalog';

/** Safely compute catalog price, falling back to 0 */
function catalogCost(toolId: string, planId: string, seats: number): number {
    return computeMonthlySpend(toolId, planId, seats) ?? 0;
}

// ─── ChatGPT ──────────────────────────────────────────────────────────────────

/** Team → Plus: very small seat count (≤ 3). High confidence regardless of use case. */
export const chatgptTeamToPlusSmallSeats: RuleFn = ({ tool }) => {
    if (tool.toolId !== 'chatgpt') return null;
    if (tool.planId !== 'team') return null;
    if (tool.seats > 3) return null;

    return {
        recommendedPlanName: 'Plus',
        recommendedMonthlyCost: catalogCost('chatgpt', 'plus', tool.seats),
        reasoning:
            `ChatGPT Team is designed for shared workspaces and centralised admin — features that add value at larger headcounts. ` +
            `With ${tool.seats} seat${tool.seats > 1 ? 's' : ''}, individual Plus plans cover the same model capabilities at a meaningfully lower recurring cost.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

/** Team → Plus: small team (1-5 or 6-20), coding use case. High confidence. */
export const chatgptTeamToPlusCoding: RuleFn = ({ tool, teamSize, useCase }) => {
    if (tool.toolId !== 'chatgpt') return null;
    if (tool.planId !== 'team') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;
    if (!['coding', 'data-analysis'].includes(useCase)) return null;

    return {
        recommendedPlanName: 'Plus',
        recommendedMonthlyCost: catalogCost('chatgpt', 'plus', tool.seats),
        reasoning:
            `For coding-focused teams, ChatGPT Team's collaboration features — shared workspaces, usage analytics, admin controls — ` +
            `are rarely the primary workflow. Individual Plus plans provide the same model access at a lower per-seat rate.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

/** Team → Plus: small team, writing/research use case. Medium confidence — collaboration may be used. */
export const chatgptTeamToPlusWriting: RuleFn = ({ tool, teamSize, useCase }) => {
    if (tool.toolId !== 'chatgpt') return null;
    if (tool.planId !== 'team') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;
    if (!['writing', 'research', 'mixed'].includes(useCase)) return null;

    return {
        recommendedPlanName: 'Plus',
        recommendedMonthlyCost: catalogCost('chatgpt', 'plus', tool.seats),
        reasoning:
            `ChatGPT Team's shared workspace features can add value for content and research workflows, ` +
            `though for smaller teams the collaboration overhead may not justify the premium. ` +
            `Individual Plus plans are worth evaluating if team-wide sharing is not actively used.`,
        confidence: 'medium',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Cursor ───────────────────────────────────────────────────────────────────

/** Business → Pro: small team (not 51+). Confidence scales with team size. */
export const cursorBusinessToPro: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'cursor') return null;
    if (tool.planId !== 'business') return null;
    if (['51-100', '100+'].includes(teamSize)) return null;

    const confidence = teamSize === '1-5' ? 'high' : 'medium';

    return {
        recommendedPlanName: 'Pro',
        recommendedMonthlyCost: catalogCost('cursor', 'pro', tool.seats),
        reasoning:
            `Cursor Business unlocks SSO, audit logs, and centralised billing — capabilities that justify the premium at 50+ seats. ` +
            `At your current team size, Pro provides identical AI code generation and context features without the administrative overhead.`,
        confidence,
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── GitHub Copilot ───────────────────────────────────────────────────────────

/** Business → Individual: very small team (1-5). High confidence. */
export const copilotBusinessToIndividual: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'github-copilot') return null;
    if (tool.planId !== 'business') return null;
    if (teamSize !== '1-5') return null;

    return {
        recommendedPlanName: 'Individual',
        recommendedMonthlyCost: catalogCost('github-copilot', 'individual', tool.seats),
        reasoning:
            `GitHub Copilot Business adds organisation-wide policy controls and usage reporting — ` +
            `features designed for larger engineering organisations. For a team of your size, ` +
            `Individual plans provide the same in-editor AI assistance at half the per-seat cost.`,
        confidence: 'high',
        optimizationCategory: 'plan-downgrade',
    };
};

/** Business → Individual: small team (6-20). Medium confidence. */
export const copilotBusinessToIndividualMedium: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'github-copilot') return null;
    if (tool.planId !== 'business') return null;
    if (teamSize !== '6-20') return null;

    return {
        recommendedPlanName: 'Individual',
        recommendedMonthlyCost: catalogCost('github-copilot', 'individual', tool.seats),
        reasoning:
            `GitHub Copilot Business policy controls and audit features become more valuable as teams scale. ` +
            `For a team of your current size, Individual plans may cover most workflows — ` +
            `worth evaluating whether the Business-tier controls are actively used.`,
        confidence: 'medium',
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Claude ───────────────────────────────────────────────────────────────────

/** Pro → Free: secondary LLM (another LLM already in stack). Low confidence. */
export const claudeProToFreeSecondary: RuleFn = ({ tool, allTools, useCase }) => {
    if (tool.toolId !== 'claude') return null;
    if (tool.planId !== 'pro') return null;

    const hasOtherLLM = allTools.some((t) => t.toolId !== 'claude' && t.category === 'llm');
    if (!hasOtherLLM) return null;

    // Writing teams may actively use Claude as a primary tool — be less aggressive
    if (['writing', 'research'].includes(useCase)) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning:
            `With another LLM already in your stack, Claude Pro is likely serving as a secondary model for specific tasks. ` +
            `The free tier provides sufficient access for supplementary use — Pro access can be reinstated if Claude becomes a primary workflow dependency.`,
        confidence: 'low',
        optimizationCategory: 'plan-downgrade',
    };
};

/** Team → Pro: small team. Confidence depends on team size. */
export const claudeTeamToPro: RuleFn = ({ tool, teamSize }) => {
    if (tool.toolId !== 'claude') return null;
    if (tool.planId !== 'team') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;

    const confidence = teamSize === '1-5' ? 'high' : 'medium';

    return {
        recommendedPlanName: 'Pro',
        recommendedMonthlyCost: catalogCost('claude', 'pro', tool.seats),
        reasoning:
            `Claude Team's shared workspace and admin features are most valuable when managing access across a larger organisation. ` +
            `For your team size, individual Pro plans provide the same model capabilities without the collaboration overhead.`,
        confidence,
        optimizationCategory: 'plan-downgrade',
    };
};

// ─── Windsurf ─────────────────────────────────────────────────────────────────

/** Windsurf + Cursor overlap: high capability overlap, recommend consolidation. */
export const windsurfOverlapWithCursor: RuleFn = ({ tool, allTools }) => {
    if (tool.toolId !== 'windsurf') return null;
    const hasCursor = allTools.some((t) => t.toolId === 'cursor');
    if (!hasCursor) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning:
            `Windsurf and Cursor are both AI-native code editors with substantially overlapping feature sets. ` +
            `Running both simultaneously is likely redundant — consolidating to a single editor would eliminate this subscription without impacting development capability.`,
        confidence: 'medium',
        optimizationCategory: 'overlap',
    };
};

// ─── Enterprise overkill ──────────────────────────────────────────────────────

/**
 * Enterprise → Team: confidence scales with seat count.
 * Writing/content workflows: lower confidence (Enterprise may be justified for compliance).
 * Coding workflows: higher confidence (Enterprise rarely needed at small scale).
 */
export const enterpriseOverkill: RuleFn = ({ tool, teamSize, useCase }) => {
    if (tool.planId !== 'enterprise') return null;
    if (['21-50', '51-100', '100+'].includes(teamSize)) return null;

    // Check if the tool has a 'team' plan in the catalog
    const teamCost = computeMonthlySpend(tool.toolId, 'team', tool.seats);
    if (teamCost === null) return null; // No team plan available

    // Confidence: 1-5 seats → high, 6-20 → medium
    // Writing/research workflows → one step lower confidence
    let confidence: 'high' | 'medium' | 'low' =
        teamSize === '1-5' ? 'high' : 'medium';

    if (['writing', 'research'].includes(useCase)) {
        confidence = confidence === 'high' ? 'medium' : 'low';
    }

    const workflowNote = ['writing', 'research'].includes(useCase)
        ? ' For content-focused workflows, verify whether compliance or SSO features are actively required before downgrading.'
        : '';

    return {
        recommendedPlanName: 'Team',
        recommendedMonthlyCost: teamCost,
        reasoning:
            `Enterprise plans bundle SLA guarantees, dedicated support, and compliance tooling that typically become necessary at 100+ seats or in regulated industries. ` +
            `A Team plan would cover your current requirements at a significantly lower cost.${workflowNote}`,
        confidence,
        optimizationCategory: 'enterprise-flag',
    };
};

// ─── Rule registry ────────────────────────────────────────────────────────────

export const TOOL_RULES = [
    // ChatGPT — most specific first
    chatgptTeamToPlusSmallSeats,
    chatgptTeamToPlusCoding,
    chatgptTeamToPlusWriting,
    // Cursor
    cursorBusinessToPro,
    // GitHub Copilot
    copilotBusinessToIndividual,
    copilotBusinessToIndividualMedium,
    // Claude
    claudeProToFreeSecondary,
    claudeTeamToPro,
    // Windsurf
    windsurfOverlapWithCursor,
    // Enterprise (generic, last — catches any tool)
    enterpriseOverkill,
];
