'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, TrendingDown, AlertCircle, CheckCircle2, Sparkles, Download, Share2, ChevronRight, Layers, Zap, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Container } from '@/components/shared/container';
import { GradientButton } from '@/components/ui/gradient-button';
import { MOCK_AUDIT } from '@/constants/mockAuditData';
import { useAuditStore } from '@/store/audit.store';
import { saveReport, buildShareUrl } from '@/lib/shareReport';
import type { AccentColor, ConfidenceLevel } from '@/types/audit';

const ICON_MAP = { Layers, TrendingDown, AlertCircle, Zap } as const;

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const stagger = (i: number) => fadeUp(0.1 + i * 0.07);

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {children}
        </p>
    );
}

function ConfidenceBadge({ level, color }: { level: ConfidenceLevel; color: AccentColor }) {
    const chip: Record<string, string> = {
        teal: 'bg-teal-50 text-teal-700 border-teal-100',
        sky: 'bg-sky-50 text-sky-700 border-sky-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
    };
    const dot: Record<string, string> = {
        teal: 'bg-teal-500', sky: 'bg-sky-500', amber: 'bg-amber-500',
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${chip[color] ?? 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot[color] ?? 'bg-slate-400'}`} />
            {level} confidence
        </span>
    );
}

export default function ResultsDemoPage() {
    const storeResults = useAuditStore((s) => s.auditResults);
    const hasHydrated = useAuditStore((s) => s._hasHydrated);

    // Wait for Zustand to rehydrate from localStorage before deciding
    // which data to show. Without this, the first render always sees null
    // and falls back to mock data even when a real audit exists.
    const { summary, score, recommendations, insights, aiSummary } =
        (hasHydrated ? storeResults : null) ?? MOCK_AUDIT;

    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleShare = useCallback(async () => {
        if (isSaving) return;
        setIsSaving(true);
        const audit = storeResults ?? MOCK_AUDIT;
        const id = await saveReport(audit);
        setIsSaving(false);
        if (!id) {
            setShareUrl('error');
            return;
        }
        const url = buildShareUrl(id);
        setShareUrl(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        try {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).catch(() => { });
            } else {
                const el = document.createElement('textarea');
                el.value = url;
                el.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
        } catch {
            // Clipboard blocked — URL is still visible in the banner
        }
    }, [storeResults, isSaving]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
                <Container>
                    <div className="flex h-14 items-center justify-between">
                        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Back to home
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-cyan-500">
                                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 13 C5 7, 8 3, 13 2 C11 6, 9 9, 8 13 Z" fill="currentColor" />
                                    <path d="M3 13 C5 11, 7 11, 8 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-bold tracking-tight text-slate-900">Whittle</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShare}
                                disabled={isSaving}
                                className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
                                        <span>Saving…</span>
                                    </>
                                ) : copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 text-teal-500" />
                                        <span className="text-teal-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="h-3.5 w-3.5" />Share
                                    </>
                                )}
                            </button>
                            <button className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50">
                                <Download className="h-3.5 w-3.5" />Export
                            </button>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="mx-auto max-w-3xl py-12 sm:py-16">

                    {/* Share URL banner */}
                    {shareUrl && shareUrl !== 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                                <Check className="h-4 w-4 flex-shrink-0 text-teal-600" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-teal-800">
                                        {copied ? 'Link copied to clipboard!' : 'Share link ready'}
                                    </p>
                                    <p className="mt-0.5 truncate font-mono text-xs text-teal-700">{shareUrl}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard?.writeText(shareUrl);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2500);
                                    }}
                                    className="flex-shrink-0 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                                >
                                    {copied ? 'Copied!' : 'Copy link'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {shareUrl === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                                <p className="text-xs font-medium text-amber-800">
                                    Could not save report. Please try again.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <motion.div {...fadeUp(0)}>
                        <div className="mb-10">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-sky-600">Audit Report</span>
                                <span className="text-[11px] text-slate-400">{summary.date}</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your AI Spend Analysis</h1>
                            <p className="mt-1.5 text-sm text-slate-500">{summary.teamSize} · {summary.useCase}</p>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.08)}>
                        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                            <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400" />
                            <div className="p-7 sm:p-8">
                                <div className="mb-8 text-center">
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Potential monthly savings</p>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl">${summary.monthlySavings}</span>
                                        <span className="text-lg font-medium text-slate-400">/mo</span>
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-teal-600">${summary.annualSavings.toLocaleString()} saved per year</p>
                                </div>
                                <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60">
                                    {[
                                        { label: 'Current spend', value: `$${summary.currentMonthlySpend}`, sub: 'per month', cls: 'text-slate-900' },
                                        { label: 'Optimized spend', value: `$${summary.optimizedMonthlySpend}`, sub: 'per month', cls: 'text-teal-700' },
                                        { label: 'Reduction', value: `${summary.savingsPercentage}%`, sub: 'cost decrease', cls: 'text-sky-700' },
                                    ].map((m) => (
                                        <div key={m.label} className="px-5 py-4 text-center">
                                            <p className="text-[11px] font-medium text-slate-500">{m.label}</p>
                                            <p className={`mt-1 text-xl font-bold ${m.cls}`}>{m.value}</p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">{m.sub}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 space-y-2.5">
                                    <div className="flex items-center gap-3">
                                        <span className="w-28 text-right text-xs text-slate-500">Current</span>
                                        <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                                            <div className="h-2.5 w-full rounded-full bg-slate-300" />
                                        </div>
                                        <span className="w-14 text-xs font-semibold text-slate-700">${summary.currentMonthlySpend}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-28 text-right text-xs text-slate-500">Optimized</span>
                                        <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(summary.optimizedMonthlySpend / summary.currentMonthlySpend) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                style={{ height: '10px', borderRadius: '9999px', background: 'linear-gradient(to right, #38bdf8, #2dd4bf)' }}
                                            />
                                        </div>
                                        <span className="w-14 text-xs font-semibold text-teal-700">${summary.optimizedMonthlySpend}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.14)}>
                        <div className="mb-8">
                            <SectionLabel>Stack Health</SectionLabel>
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center gap-6">
                                    <div className="relative flex-shrink-0">
                                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                                            <motion.circle
                                                cx="40" cy="40" r="32" fill="none" stroke="url(#scoreGrad)" strokeWidth="7" strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 32}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score.value / 100) }}
                                                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                            <defs>
                                                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#38bdf8" />
                                                    <stop offset="100%" stopColor="#2dd4bf" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-bold text-slate-900">{score.value}</span>
                                            <span className="text-[10px] font-medium text-slate-400">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-semibold text-slate-900">{score.label}</p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{score.explanation}</p>
                                    </div>
                                </div>
                                <div className="mt-5 overflow-hidden rounded-full bg-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score.value}%` }}
                                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ height: '6px', borderRadius: '9999px', background: 'linear-gradient(to right, #38bdf8, #2dd4bf)' }}
                                    />
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                                    <span>Needs work</span>
                                    <span>Fully optimized</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mb-8">
                        <SectionLabel>Recommendations</SectionLabel>
                        <div className="space-y-3">
                            {recommendations.map((rec, i) => (
                                <motion.div key={rec.toolId} {...stagger(i)}>
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
                                            <div>
                                                <div className="flex items-center gap-2.5">
                                                    <p className="text-sm font-semibold text-slate-900">{rec.toolName}</p>
                                                    <ConfidenceBadge level={rec.confidence} color={rec.confidenceColor} />
                                                </div>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs">
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">{rec.currentPlan}</span>
                                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                                    <span className="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700">{rec.recommendedPlan}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-teal-700">-${rec.monthlySaving}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                                                <p className="text-[11px] text-slate-400">${rec.currentMonthlyCost} to ${rec.recommendedMonthlyCost}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 px-6 py-4">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" />
                                            <p className="text-sm leading-relaxed text-slate-500">{rec.reasoning}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div {...fadeUp(0.3)}>
                        <div className="mb-8">
                            <SectionLabel>AI Summary</SectionLabel>
                            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-7 backdrop-blur-sm shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                                        <Sparkles className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">{aiSummary.headline ?? 'Whittle Intelligence'}</p>
                                </div>
                                <div className="space-y-3">
                                    {aiSummary.paragraphs.map((para, i) => (
                                        <p key={i} className="text-sm leading-[1.75] text-slate-600">{para}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.36)}>
                        <div className="mb-12">
                            <SectionLabel>Opportunity Insights</SectionLabel>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {insights.map((insight, i) => {
                                    const Icon = ICON_MAP[insight.iconName as keyof typeof ICON_MAP];
                                    const chip: Record<AccentColor, string> = {
                                        teal: 'border-teal-100 bg-teal-50/60 text-teal-700',
                                        sky: 'border-sky-100 bg-sky-50/60 text-sky-700',
                                        amber: 'border-amber-100 bg-amber-50/60 text-amber-700',
                                        slate: 'border-slate-200 bg-slate-50 text-slate-600',
                                        red: 'border-red-100 bg-red-50/60 text-red-700',
                                    };
                                    const iconBox: Record<AccentColor, string> = {
                                        teal: 'bg-teal-100 text-teal-600',
                                        sky: 'bg-sky-100 text-sky-600',
                                        amber: 'bg-amber-100 text-amber-600',
                                        slate: 'bg-slate-100 text-slate-500',
                                        red: 'bg-red-100 text-red-600',
                                    };
                                    return (
                                        <motion.div key={insight.id} {...stagger(i)}>
                                            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${chip[insight.color]}`}>
                                                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${iconBox[insight.color]}`}>
                                                    {Icon && <Icon className="h-3.5 w-3.5" />}
                                                </div>
                                                <p className="text-sm font-medium">{insight.label}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.42)}>
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Next step</p>
                            <h2 className="mb-2 text-xl font-bold text-white">Ready to implement these changes?</h2>
                            <p className="mx-auto mb-6 max-w-sm text-sm text-slate-400">Start a new audit with your real data and get a personalised optimisation plan.</p>
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <Link href="/audit">
                                    <GradientButton size="lg">
                                        Run Your Audit
                                        <ArrowRight className="h-4 w-4" />
                                    </GradientButton>
                                </Link>
                                <button
                                    onClick={handleShare}
                                    disabled={isSaving}
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-6 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving…
                                        </>
                                    ) : copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-teal-400" />
                                            <span className="text-teal-400">Link copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-4 w-4" />
                                            Share this report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </Container>
        </main>
    );
}
