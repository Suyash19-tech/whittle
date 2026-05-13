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

// ─── Capability Mapping ────────────────────────────────────────────────────────
const CAPABILITY_MAP: Record<string, string> = {
    'chatgpt': 'chat-assistant',
    'claude': 'chat-assistant',
    'gemini': 'chat-assistant',
    'cursor': 'coding-assistant',
    'github-copilot': 'coding-assistant',
    'windsurf': 'coding-assistant',
    'openai-api': 'api-platform',
    'anthropic-api': 'api-platform',
    'perplexity': 'research',
    'midjourney': 'creative',
};

function getCapability(toolId: string) {
    return CAPABILITY_MAP[toolId] || 'other';
}

// ─── Capability Overlap ───────────────────────────────────────────────────────

/** Chat Assistant Overlap: team size <= 5, 3+ chat assistants */
export const chatAssistantOverlap: RuleFn = ({ tool, allTools, teamSize }) => {
    if (getCapability(tool.toolId) !== 'chat-assistant') return null;
    if (!['1-5'].includes(teamSize)) return null;

    const chatAssistants = allTools.filter(t => getCapability(t.toolId) === 'chat-assistant');
    if (chatAssistants.length < 3) return null;

    // Keep the most expensive one as primary
    const sorted = [...chatAssistants].sort((a, b) => b.monthlySpend - a.monthlySpend);
    if (sorted[0].toolId === tool.toolId) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning: `Your team currently provisions ${chatAssistants.length} distinct chat assistants. Standardising on a primary tool (like ${sorted[0].toolName}) and moving others to a free tier eliminates redundant license overlap without sacrificing capability.`,
        confidence: 'high',
        optimizationCategory: 'overlap',
    };
};

/** Coding Assistant Overlap: 2+ coding assistants on small team */
export const codingAssistantOverlap: RuleFn = ({ tool, allTools, teamSize }) => {
    if (getCapability(tool.toolId) !== 'coding-assistant') return null;
    if (!['1-5', '6-20'].includes(teamSize)) return null;

    const codingAssistants = allTools.filter(t => getCapability(t.toolId) === 'coding-assistant');
    if (codingAssistants.length < 2) return null;

    const sorted = [...codingAssistants].sort((a, b) => b.monthlySpend - a.monthlySpend);
    if (sorted[0].toolId === tool.toolId) return null;

    return {
        recommendedPlanName: 'Free',
        recommendedMonthlyCost: 0,
        reasoning: `You are running ${codingAssistants.length} distinct AI coding assistants. Consolidating to your primary editor (${sorted[0].toolName}) avoids context-switching and reduces duplicated software expenditure.`,
        confidence: 'medium',
        optimizationCategory: 'overlap',
    };
};

// ─── Enterprise overkill ──────────────────────────────────────────────────────

/**
 * Enterprise → Team: confidence scales with seat count.
 * Strengthened rule: high confidence if team <= 20, very explicit reasoning.
 */
export const enterpriseOverkill: RuleFn = ({ tool, teamSize, useCase }) => {
    if (tool.planId !== 'enterprise') return null;
    if (['51-100', '100+'].includes(teamSize)) return null;

    // Find the next logical downgrade plan (Team, Teams, or Business)
    const possiblePlans = ['team', 'teams', 'business'];
    let fallbackPlanId: string | null = null;
    let teamCost: number | null = null;
    
    for (const pid of possiblePlans) {
        teamCost = computeMonthlySpend(tool.toolId, pid, tool.seats);
        if (teamCost !== null) {
            fallbackPlanId = pid;
            break;
        }
    }

    if (teamCost === null || fallbackPlanId === null) return null;

    // Confidence: 1-5 and 6-20 seats -> high. 21-50 -> medium.
    let confidence: 'high' | 'medium' | 'low' = ['1-5', '6-20'].includes(teamSize) ? 'high' : 'medium';

    if (['writing', 'research'].includes(useCase)) {
        confidence = confidence === 'high' ? 'medium' : 'low';
    }

    const workflowNote = ['writing', 'research'].includes(useCase)
        ? ' For content-focused workflows, verify whether compliance or SSO features are actively required before downgrading.'
        : '';

    const fallbackName = fallbackPlanId.charAt(0).toUpperCase() + fallbackPlanId.slice(1);

    return {
        recommendedPlanName: fallbackName,
        recommendedMonthlyCost: teamCost,
        reasoning:
            `Enterprise plans bundle SLA guarantees, dedicated support, and compliance tooling that are typically unnecessary for a ${teamSize.split('-')[1] ?? teamSize}-person team. ` +
            `A ${fallbackName} plan securely covers your core requirements at a more proportionate cost.${workflowNote}`,
        confidence,
        optimizationCategory: 'enterprise-flag',
    };
};

// ─── Seat count rightsizing ──────────────────────────────────────────────────
const TEAM_SIZE_MAP: Record<string, number> = {
    '1-5': 5,
    '6-20': 20,
    '21-50': 50,
    '51-100': 100,
    '100+': 1000,
};

/** If seats > estimated max team size → trigger low-confidence rightsizing review */
export const seatCountOverEstimatedMax: RuleFn = ({ tool, teamSize }) => {
    const maxSeats = TEAM_SIZE_MAP[teamSize] || 1000;
    if (tool.seats <= maxSeats) return null;

    // Estimate unit cost per seat to calculate potential savings
    const unitCost = tool.monthlySpend / tool.seats;
    const optimizedCost = unitCost * maxSeats;

    return {
        recommendedPlanName: tool.planName,
        recommendedMonthlyCost: optimizedCost,
        reasoning: 
            `You have ${tool.seats} seats provisioned for ${tool.toolName}, which exceeds your reported team size cap of ${maxSeats}. ` +
            `Standardising seat counts to match your actual headcount can prevent "zombie" license spend.`,
        confidence: 'low',
        optimizationCategory: 'seat-reduction',
    };
};

// ─── Rule registry ────────────────────────────────────────────────────────────

export const TOOL_RULES = [
    chatgptTeamToPlusSmallSeats,
    chatgptTeamToPlusCoding,
    chatgptTeamToPlusWriting,
    cursorBusinessToPro,
    copilotBusinessToIndividual,
    copilotBusinessToIndividualMedium,
    claudeProToFreeSecondary,
    claudeTeamToPro,
    chatAssistantOverlap,
    codingAssistantOverlap,
    enterpriseOverkill,
    seatCountOverEstimatedMax,
];
