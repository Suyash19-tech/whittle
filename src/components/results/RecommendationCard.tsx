'use client';

import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { ToolRecommendation, AccentColor, ConfidenceLevel } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

interface RecommendationCardProps {
    recommendation: ToolRecommendation;
}

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
            aria-label={`${level} confidence recommendation`}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${CHIP_STYLES[color] ?? 'bg-slate-50 text-slate-600 border-slate-100'
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[color] ?? 'bg-slate-400'}`} aria-hidden="true" />
            {level} confidence
        </span>
    );
}

export function RecommendationCard({ recommendation: rec }: RecommendationCardProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <p className="text-sm font-semibold text-slate-900">{rec.toolName}</p>
                        <ConfidenceBadge level={rec.confidence} color={rec.confidenceColor} />
                    </div>
                    {/* Plan change */}
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                            {rec.currentPlan}
                        </span>
                        <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        <span className="rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                            {rec.recommendedPlan}
                        </span>
                    </div>
                </div>

                {/* Savings */}
                <div className="text-right" aria-label={`Save $${rec.monthlySaving} per month`}>
                    <p className="text-lg font-bold text-teal-700">
                        −{formatCurrency(rec.monthlySaving)}
                        <span className="text-xs font-normal text-slate-400">/mo</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                        {formatCurrency(rec.currentMonthlyCost)} → {formatCurrency(rec.recommendedMonthlyCost)}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        {formatCurrency(rec.annualSaving)}/yr
                    </p>
                </div>
            </div>

            {/* Reasoning */}
            <div className="flex items-start gap-3 px-6 py-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-slate-500">{rec.reasoning}</p>
            </div>
        </article>
    );
}
