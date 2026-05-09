'use client';

import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { ToolRecommendation, AccentColor, ConfidenceLevel } from '@/types/audit';

interface RecommendationCardProps {
    recommendation: ToolRecommendation;
}

// ─── Confidence badge ─────────────────────────────────────────────────────────

const CHIP_STYLES: Record<string, string> = {
    teal: 'bg-teal-50  text-teal-700  border-teal-100',
    sky: 'bg-sky-50   text-sky-700   border-sky-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
};

const DOT_STYLES: Record<string, string> = {
    teal: 'bg-teal-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
};

function ConfidenceBadge({ level, color }: { level: ConfidenceLevel; color: AccentColor }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${CHIP_STYLES[color] ?? 'bg-slate-50 text-slate-600 border-slate-100'
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[color] ?? 'bg-slate-400'}`} />
            {level} confidence
        </span>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

/**
 * RecommendationCard
 * Renders a single tool recommendation with plan change, savings callout,
 * confidence badge, and reasoning text.
 * Fully driven by ToolRecommendation — no hardcoded values.
 */
export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <p className="text-sm font-semibold text-slate-900">{rec.toolName}</p>
                        <ConfidenceBadge level={rec.confidence} color={rec.confidenceColor} />
                    </div>
                    {/* Plan change */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                            {rec.currentPlan}
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                        <span className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700">
                            {rec.recommendedPlan}
                        </span>
                    </div>
                </div>

                {/* Savings callout */}
                <div className="text-right">
                    <p className="text-lg font-bold text-teal-700">
                        -${rec.monthlySaving}
                        <span className="text-xs font-normal text-slate-400">/mo</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                        ${rec.currentMonthlyCost} → ${rec.recommendedMonthlyCost}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        ${rec.annualSaving.toLocaleString()}/yr
                    </p>
                </div>
            </div>

            {/* Reasoning */}
            <div className="flex items-start gap-3 px-6 py-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" />
                <p className="text-sm leading-relaxed text-slate-500">{rec.reasoning}</p>
            </div>
        </div>
    );
}
