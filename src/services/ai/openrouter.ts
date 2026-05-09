/**
 * Gemini AI Service (via Google Generative Language API)
 *
 * Generates concise, financially intelligent audit summaries.
 * Used server-side only (API route) — the API key never reaches the browser.
 *
 * Model: gemini-2.5-flash
 * Fallback: local deterministic summary if the API call fails for any reason.
 */

import type { AuditSummary, AuditScore, ToolRecommendation, OpportunityInsight } from '@/types/audit';

// ─── Input type ───────────────────────────────────────────────────────────────

export interface SummaryInput {
    summary: AuditSummary;
    score: AuditScore;
    recommendations: ToolRecommendation[];
    insights: OpportunityInsight[];
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: SummaryInput): string {
    const { summary, score, recommendations, insights } = input;

    const recLines = recommendations
        .map(
            (r) =>
                `- ${r.toolName}: switch from ${r.currentPlan} to ${r.recommendedPlan}, saving $${r.monthlySaving}/month (${r.confidence} confidence)`
        )
        .join('\n');

    const insightLines = insights.map((i) => `- ${i.label}`).join('\n');

    return `You are a financial advisor writing a concise audit summary for a startup founder.

AUDIT DATA:
- Team size: ${summary.teamSize}
- Use case: ${summary.useCase}
- Current monthly AI spend: $${summary.currentMonthlySpend}
- Optimized monthly spend: $${summary.optimizedMonthlySpend}
- Monthly savings potential: $${summary.monthlySavings}
- Annual savings potential: $${summary.annualSavings}
- Stack health score: ${score.value}/100 (${score.label})

RECOMMENDATIONS:
${recLines || '- No specific plan changes recommended'}

INSIGHTS:
${insightLines || '- No structural issues detected'}

Write a 3-paragraph summary in plain English. Requirements:
- Tone: calm, financially intelligent, advisor-like. NOT robotic or startup-hype.
- Paragraph 1: Describe the current spend situation and what is driving it.
- Paragraph 2: Summarise the key optimisation opportunities and their impact.
- Paragraph 3: One sentence closing with a practical next step.
- No bullet points, no markdown, no headers. Plain paragraphs only.
- Each paragraph should be 2-3 sentences maximum.
- Do not use phrases like "I recommend" or "you should". Use neutral financial language.`;
}

// ─── Fallback generator ───────────────────────────────────────────────────────

/**
 * buildFallbackSummary
 * Deterministic local fallback — used when the API is unavailable.
 * The product should never appear broken.
 */
export function buildFallbackSummary(input: SummaryInput): string[] {
    const { summary, score, recommendations } = input;

    const para1 =
        summary.currentMonthlySpend > 0
            ? `Your current AI tooling spend of $${summary.currentMonthlySpend}/month has been reviewed across your selected tools. The primary cost drivers appear to be plan tier selections that may not align with your team's current scale and usage patterns.`
            : `Your AI tooling stack has been reviewed. Based on the configuration provided, your current spend appears modest relative to your team size.`;

    let para2: string;
    if (recommendations.length > 0) {
        const topRec = recommendations[0];
        para2 = `The most impactful opportunity is adjusting ${topRec.toolName} from the ${topRec.currentPlan} plan to ${topRec.recommendedPlan}, which could recover $${topRec.monthlySaving}/month. Across all recommendations, the total potential saving is $${summary.monthlySavings}/month — $${summary.annualSavings.toLocaleString()} annually.`;
    } else {
        para2 = `No significant plan mismatches were detected for your current team size and use case. Your stack health score of ${score.value}/100 suggests your current configuration is reasonably well-matched to your needs.`;
    }

    const para3 = `Review the recommendations below and apply the changes that align with your team's workflows. Even partial implementation would meaningfully reduce your recurring AI spend.`;

    return [para1, para2, para3];
}

// ─── Gemini API call ──────────────────────────────────────────────────────────

/**
 * generateAISummary
 *
 * Calls Gemini 2.5 Flash to generate a 3-paragraph audit summary.
 * Returns paragraphs as string[] matching AISummary.paragraphs shape.
 *
 * Always resolves — falls back to buildFallbackSummary on any failure.
 * SERVER-SIDE ONLY. Do not import in client components.
 */
export async function generateAISummary(input: SummaryInput): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('[Whittle] GEMINI_API_KEY not set — using fallback summary');
        return buildFallbackSummary(input);
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: buildPrompt(input) }] }],
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.4,
                    },
                }),
                signal: AbortSignal.timeout(15_000),
            }
        );

        if (!response.ok) {
            console.warn(`[Whittle] Gemini returned ${response.status} — using fallback`);
            return buildFallbackSummary(input);
        }

        const data = await response.json() as {
            candidates?: Array<{
                content?: { parts?: Array<{ text?: string }> };
            }>;
        };

        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!raw) {
            console.warn('[Whittle] Empty response from Gemini — using fallback');
            return buildFallbackSummary(input);
        }

        // Split on double newlines to get paragraphs
        const paragraphs = raw
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);

        if (paragraphs.length < 2) {
            console.warn('[Whittle] Unexpected response format — using fallback');
            return buildFallbackSummary(input);
        }

        return paragraphs;
    } catch (err) {
        console.warn('[Whittle] Gemini call failed — using fallback:', err);
        return buildFallbackSummary(input);
    }
}
