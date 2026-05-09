'use client';

import { Layers, TrendingDown, AlertCircle, Zap, Users, DollarSign } from 'lucide-react';
import type { OpportunityInsight, AccentColor } from '@/types/audit';

interface OpportunityInsightChipProps {
    insight: OpportunityInsight;
}

// ─── Icon resolver ────────────────────────────────────────────────────────────
// Data layer stores icon names as strings to stay React-free.
// Resolved here at the UI boundary only.
const ICON_MAP = { Layers, TrendingDown, AlertCircle, Zap, Users, DollarSign } as const;

// ─── Color maps ───────────────────────────────────────────────────────────────
const CHIP_COLORS: Record<AccentColor, string> = {
    teal: 'border-teal-100  bg-teal-50/60  text-teal-700',
    sky: 'border-sky-100   bg-sky-50/60   text-sky-700',
    amber: 'border-amber-100 bg-amber-50/60 text-amber-700',
    slate: 'border-slate-200 bg-slate-50    text-slate-600',
    red: 'border-red-100   bg-red-50/60   text-red-700',
};

const ICON_COLORS: Record<AccentColor, string> = {
    teal: 'bg-teal-100  text-teal-600',
    sky: 'bg-sky-100   text-sky-600',
    amber: 'bg-amber-100 text-amber-600',
    slate: 'bg-slate-100 text-slate-500',
    red: 'bg-red-100   text-red-600',
};

/**
 * OpportunityInsightChip
 * Renders a single scannable insight chip with icon and label.
 * Fully driven by OpportunityInsight — no hardcoded values.
 */
export function OpportunityInsightChip({ insight }: OpportunityInsightChipProps) {
    const Icon = ICON_MAP[insight.iconName];

    return (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${CHIP_COLORS[insight.color]}`}>
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${ICON_COLORS[insight.color]}`}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
            </div>
            <p className="text-sm font-medium">{insight.label}</p>
        </div>
    );
}
