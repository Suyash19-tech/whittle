import { NextRequest, NextResponse } from 'next/server';
import { generateAISummary } from '@/services/ai/openrouter';
import type { SummaryInput } from '@/services/ai/openrouter';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/audit/summarise
 *
 * Accepts audit data and returns AI-generated summary paragraphs.
 * The OpenRouter API key lives here on the server — never sent to the client.
 *
 * Request body: SummaryInput (summary, score, recommendations, insights)
 * Response:     { paragraphs: string[] }
 *
 * Always returns 200 — on any failure the service returns a fallback summary
 * so the client never sees an error state for this non-critical feature.
 */
export async function POST(req: NextRequest) {
    try {
        const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
        if (!checkRateLimit(ip, 5, 60000)) { // 5 requests per minute
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const body = await req.json() as SummaryInput;

        // Basic shape validation — reject obviously malformed requests
        if (!body.summary || !body.score || !Array.isArray(body.recommendations)) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        const paragraphs = await generateAISummary(body);

        return NextResponse.json({ paragraphs });
    } catch {
        // If even JSON parsing fails, return a generic fallback
        return NextResponse.json(
            {
                paragraphs: [
                    'Your AI tooling stack has been reviewed based on the information provided.',
                    'Review the recommendations below to identify the most impactful cost reduction opportunities for your team.',
                    'Applying even a subset of these changes could meaningfully reduce your recurring AI spend.',
                ],
            },
            { status: 200 }
        );
    }
}
