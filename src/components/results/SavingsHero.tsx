'use client';

import { motion } from 'framer-motion';
import type { AuditSummary } from '@/types/audit';
import { formatCurrency } from '@/lib/utils';

interface SavingsHeroProps {
    summary: AuditSummary;
}

/**
 * SavingsHero
 * Hero card showing the primary savings callout, three metric tiles,
 * and an animated spend comparison bar.
 * Receives typed AuditSummary — no hardcoded values.
 */
export function SavingsHero({ summary }: SavingsHeroProps) {
    const optimizedPct = summary.currentMonthlySpend > 0 
        ? (summary.optimizedMonthlySpend / summary.currentMonthlySpend) * 100 
        : 100;

    const tiles = [
        { label: 'Current spend', value: formatCurrency(summary.currentMonthlySpend), sub: 'per month', cls: 'text-slate-900' },
        { label: 'Optimized spend', value: formatCurrency(summary.optimizedMonthlySpend), sub: 'per month', cls: 'text-teal-700' },
        { label: 'Reduction', value: `${summary.savingsPercentage}%`, sub: 'cost decrease', cls: 'text-sky-700' },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400" />

            <div className="p-7 sm:p-8">
                {/* Primary callout */}
                <div className="mb-8 text-center">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Potential monthly savings
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl">
                            {formatCurrency(summary.monthlySavings).replace('$', '')}
                        </span>
                        <span className="text-lg font-medium text-slate-400">/mo</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-teal-600">
                        {formatCurrency(summary.annualSavings)} saved per year
                    </p>
                </div>

                {/* Metric tiles */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60">
                    {tiles.map((t) => (
                        <div key={t.label} className="px-5 py-4 text-center">
                            <p className="text-[11px] font-medium text-slate-500">{t.label}</p>
                            <p className={`mt-1 text-xl font-bold ${t.cls}`}>{t.value}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{t.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Spend bars */}
                <div className="mt-6 space-y-2.5">
                    <div className="flex items-center gap-3">
                        <span className="w-28 text-right text-xs text-slate-500">Current</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-2.5 w-full rounded-full bg-slate-300" />
                        </div>
                        <span className="w-14 text-xs font-semibold text-slate-700">
                            {formatCurrency(summary.currentMonthlySpend)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-28 text-right text-xs text-slate-500">Optimized</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${optimizedPct}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    height: '10px',
                                    borderRadius: '9999px',
                                    background: 'linear-gradient(to right, #38bdf8, #2dd4bf)',
                                }}
                            />
                        </div>
                        <span className="w-14 text-xs font-semibold text-teal-700">
                            {formatCurrency(summary.optimizedMonthlySpend)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
