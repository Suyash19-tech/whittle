/**
 * Audit domain types for Whittle
 *
 * These interfaces define the full shape of an audit result.
 * All components and mock data conform to these contracts so that
 * swapping in real backend data later requires zero component rewrites.
 *
 * Naming conventions:
 *   - Interfaces describe data shapes (nouns)
 *   - Union types describe constrained string values
 *   - No `any` — every field is explicitly typed
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Confidence level for a recommendation, ordered low → high */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/** Visual accent color mapped from confidence or insight severity */
export type AccentColor = 'teal' | 'sky' | 'amber' | 'slate' | 'red';

/** Broad category a tool belongs to */
export type ToolCategory = 'llm' | 'code' | 'api' | 'productivity' | 'other';

/** Qualitative label for the overall stack health score */
export type ScoreLabel =
    | 'Needs Attention'
    | 'Below Average'
    | 'Moderately Optimized'
    | 'Well Optimized'
    | 'Fully Optimized';

// ─── Audit summary ────────────────────────────────────────────────────────────

/**
 * Top-level financial summary for an audit.
 * Drives the hero savings card on the results page.
 */
export interface AuditSummary {
    /** Unique identifier — will be a UUID from the backend */
    id: string;

    /** ISO 8601 date string, e.g. "2026-05-08" */
    date: string;

    /** Human-readable team size range, e.g. "6–20 people" */
    teamSize: string;

    /** Primary use case label, e.g. "Coding & Development" */
    useCase: string;

    /** Total monthly spend across all tools, in USD */
    currentMonthlySpend: number;

    /** Projected monthly spend after applying all recommendations, in USD */
    optimizedMonthlySpend: number;

    /** currentMonthlySpend − optimizedMonthlySpend */
    monthlySavings: number;

    /** monthlySavings × 12 */
    annualSavings: number;

    /** Percentage reduction: (monthlySavings / currentMonthlySpend) × 100, rounded */
    savingsPercentage: number;
}

// ─── Stack health score ───────────────────────────────────────────────────────

/**
 * Holistic score representing how well-optimized the AI stack is.
 * Displayed as a circular progress ring on the results page.
 */
export interface AuditScore {
    /** Integer 0–100 */
    value: number;

    /** Qualitative label derived from the score value */
    label: ScoreLabel;

    /**
     * One or two sentences explaining the score in plain language.
     * Tone: calm, financially rational, not alarmist.
     */
    explanation: string;
}

// ─── Tool recommendation ──────────────────────────────────────────────────────

/**
 * A single tool-level recommendation card.
 * Each card maps one current plan to a recommended plan with financial impact.
 */
export interface ToolRecommendation {
    /** Matches a tool id in SUPPORTED_AI_TOOLS */
    toolId: string;

    /** Display name, e.g. "ChatGPT" */
    toolName: string;

    /** Broad category for icon/grouping */
    category: ToolCategory;

    /** Current plan name, e.g. "Team" */
    currentPlan: string;

    /** Current monthly cost in USD */
    currentMonthlyCost: number;

    /** Recommended plan name, e.g. "Plus" */
    recommendedPlan: string;

    /** Projected monthly cost after switching, in USD */
    recommendedMonthlyCost: number;

    /** currentMonthlyCost − recommendedMonthlyCost */
    monthlySaving: number;

    /** monthlySaving × 12 */
    annualSaving: number;

    /**
     * One to three sentences explaining the rationale.
     * Should reference team size, usage patterns, or feature relevance.
     * Tone: calm, specific, financially grounded.
     */
    reasoning: string;

    /** How confident the recommendation engine is in this suggestion */
    confidence: ConfidenceLevel;

    /**
     * Accent color for the confidence badge.
     * Derived from confidence: high → teal, medium → sky, low → amber.
     */
    confidenceColor: AccentColor;

    /**
     * Display order — lower numbers appear first.
     * Typically sorted by monthlySaving descending.
     */
    priority: number;

    /** Optimization category for internal logic and UI tagging */
    optimizationCategory?: 'plan-downgrade' | 'seat-reduction' | 'overlap' | 'enterprise-flag' | 'optimized' | 'keep';
}

// ─── Opportunity insight ──────────────────────────────────────────────────────

/**
 * A short, scannable insight chip shown in the Opportunity Insights section.
 * Each insight highlights a structural pattern in the stack.
 */
export interface OpportunityInsight {
    /** Unique key for React rendering */
    id: string;

    /**
     * Single sentence, factual, no hyperbole.
     * Examples:
     *   "3 overlapping subscriptions detected"
     *   "Enterprise features may be underutilised"
     */
    label: string;

    /**
     * Lucide icon name — resolved to a component in the UI layer.
     * Keeping this as a string keeps the data layer free of React imports.
     */
    iconName: 'Layers' | 'TrendingDown' | 'AlertCircle' | 'Zap' | 'Users' | 'DollarSign';

    /** Visual accent color for the chip */
    color: AccentColor;
}

// ─── AI summary ───────────────────────────────────────────────────────────────

/**
 * The AI-generated narrative summary of the audit.
 * Paragraphs are stored as an array so the UI can render them
 * individually with proper spacing — no string splitting needed.
 */
export interface AISummary {
    /**
     * Ordered array of paragraph strings.
     * Each string is a complete paragraph — no markdown, no HTML.
     * Tone: calm, intelligent, financially rational.
     */
    paragraphs: string[];

    /**
     * Optional one-line headline above the paragraphs.
     * If omitted, the UI falls back to "Whittle Intelligence".
     */
    headline?: string;
}

// ─── Full audit result ────────────────────────────────────────────────────────

/**
 * The complete audit result object.
 * This is the single source of truth passed to the results page.
 * All sections derive their data from this shape.
 */
export interface AuditResult {
    summary: AuditSummary;
    score: AuditScore;
    recommendations: ToolRecommendation[];
    insights: OpportunityInsight[];
    aiSummary: AISummary;
}
