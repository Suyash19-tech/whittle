import type { SummaryInput } from './openrouter';
import { buildFallbackSummary } from './openrouter';

/**
 * fetchAISummary
 *
 * Client-side function that calls the /api/audit/summarise route.
 * Safe to import in client components — no API key exposure.
 *
 * Always resolves with string[] — falls back to local summary on any error
 * so the UI never shows a broken state.
 *
 * @example
 *   const paragraphs = await fetchAISummary({ summary, score, recommendations, insights });
 */
export async function fetchAISummary(input: SummaryInput): Promise<string[]> {
    try {
        const res = await fetch('/api/audit/summarise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(15_000),
        });

        if (!res.ok) {
            console.warn('[Whittle] summarise API returned', res.status, '— using fallback');
            return buildFallbackSummary(input);
        }

        const data = await res.json() as { paragraphs?: string[] };

        if (!Array.isArray(data.paragraphs) || data.paragraphs.length === 0) {
            return buildFallbackSummary(input);
        }

        return data.paragraphs;
    } catch (err) {
        console.warn('[Whittle] fetchAISummary failed — using fallback:', err);
        return buildFallbackSummary(input);
    }
}
