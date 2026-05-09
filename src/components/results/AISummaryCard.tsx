'use client';

import { Sparkles } from 'lucide-react';
import type { AISummary } from '@/types/audit';

interface AISummaryCardProps {
    aiSummary: AISummary;
}

/**
 * AISummaryCard
 * Renders the AI-generated narrative summary.
 * Paragraphs come from the data layer as an array — no string splitting.
 * Falls back to "Whittle Intelligence" if no headline is provided.
 */
export function AISummaryCard({ aiSummary }: AISummaryCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-7 backdrop-blur-sm shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                    {aiSummary.headline ?? 'Whittle Intelligence'}
                </p>
            </div>

            {/* Paragraphs — rendered from array, no string splitting */}
            <div className="space-y-3">
                {aiSummary.paragraphs.map((para, i) => (
                    <p key={i} className="text-sm leading-[1.75] text-slate-600">
                        {para}
                    </p>
                ))}
            </div>
        </div>
    );
}
