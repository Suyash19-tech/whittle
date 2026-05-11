'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, X, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOL_ICON_MAP } from './tool-icons';
import { computeMonthlySpend, isVariablePricing, getPlansForTool } from '@/services/audit/pricingCatalog';

interface ToolConfigCardProps {
    id: string;
    name: string;
    selectedPlan: string;
    monthlySpend: number;
    seats: number;
    onPlanChange: (planId: string) => void;
    onSpendChange: (spend: number) => void;
    onSeatsChange: (seats: number) => void;
    onRemove: () => void;
}

export function ToolConfigCard({
    id,
    name,
    selectedPlan,
    monthlySpend,
    seats,
    onPlanChange,
    onSpendChange,
    onSeatsChange,
    onRemove,
}: ToolConfigCardProps) {
    const Icon = TOOL_ICON_MAP[id];
    const plans = getPlansForTool(id);

    // Spend is auto-derived from catalog unless it's variable pricing
    const isVariable = selectedPlan ? isVariablePricing(id, selectedPlan) : false;
    const derivedSpend = selectedPlan ? computeMonthlySpend(id, selectedPlan, seats) : null;
    // Display the derived value if available, otherwise what's in the store
    const displaySpend = derivedSpend !== null ? derivedSpend : monthlySpend;

    const adjustSeats = (delta: number) => {
        onSeatsChange(Math.max(1, seats + delta));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-600">
                        {Icon ? <Icon className="h-4 w-4" /> : (
                            <span className="text-xs font-bold">{name[0]}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{name}</p>
                        {selectedPlan && !isVariable && derivedSpend !== null && (
                            <p className="text-xs text-sky-600 font-medium">
                                ${derivedSpend}/mo · auto-calculated
                            </p>
                        )}
                        {!selectedPlan && (
                            <p className="text-xs text-slate-400">Select a plan to continue</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label={`Remove ${name}`}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Fields */}
            <div className="grid gap-5 p-6 sm:grid-cols-3">

                {/* Plan */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Plan
                    </label>
                    <div className="relative">
                        <select
                            value={selectedPlan}
                            onChange={(e) => onPlanChange(e.target.value)}
                            className={cn(
                                'w-full appearance-none rounded-xl border border-slate-200 bg-white',
                                'py-2.5 pl-3.5 pr-9 text-sm font-medium',
                                'transition-all duration-150',
                                'hover:border-slate-300',
                                'focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20',
                                selectedPlan ? 'text-slate-900' : 'text-slate-400'
                            )}
                        >
                            <option value="" disabled>Select plan</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name}
                                    {plan.pricePerSeat !== null && plan.pricePerSeat > 0
                                        ? ` — $${plan.pricePerSeat}/seat`
                                        : plan.isVariablePricing
                                            ? ' — Variable'
                                            : ' — Free'}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                {/* Monthly Spend */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Monthly Spend
                    </label>
                    {isVariable ? (
                        // Variable pricing — user enters actual spend
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">$</span>
                            <input
                                type="number"
                                value={monthlySpend}
                                onChange={(e) => onSpendChange(Math.max(0, Number(e.target.value)))}
                                placeholder="Enter actual spend"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-semibold text-slate-900 transition-all hover:border-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                                min="0"
                            />
                        </div>
                    ) : (
                        // Fixed pricing — auto-computed, read-only display
                        <div className={cn(
                            'flex h-10 items-center gap-2 rounded-xl border px-3.5',
                            selectedPlan
                                ? 'border-sky-200 bg-sky-50/60'
                                : 'border-slate-200 bg-slate-50'
                        )}>
                            <span className="text-sm font-medium text-slate-400">$</span>
                            <span className={cn(
                                'flex-1 text-sm font-bold',
                                selectedPlan ? 'text-sky-700' : 'text-slate-400'
                            )}>
                                {selectedPlan ? displaySpend : '—'}
                            </span>
                            <Lock className="h-3.5 w-3.5 text-slate-300" aria-label="Auto-calculated" />
                        </div>
                    )}
                </div>

                {/* Seats */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Seats
                    </label>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => adjustSeats(-1)}
                            disabled={seats <= 1}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-900">
                            {seats}
                        </div>
                        <button
                            onClick={() => adjustSeats(1)}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
