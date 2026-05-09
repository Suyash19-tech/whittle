'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/shared/container';
import { GradientButton } from '@/components/ui/gradient-button';
import {
    SavingsHero,
    AuditScoreCard,
    RecommendationCard,
    OpportunityInsightChip,
    AISummaryCard,
} from '@/components/results';
import { loadReport } from '@/lib/shareReport';
import type { AuditResult } from '@/types/audit';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {children}
        </p>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
            <Container>
                <div className="mx-auto max-w-md py-24 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                            <ExternalLink className="h-6 w-6 text-slate-400" />
                        </div>
                    </div>
                    <h1 className="mb-3 text-xl font-bold text-slate-900">Report not found</h1>
                    <p className="mb-8 text-sm text-slate-500">
                        This report link may have expired or was opened in a different browser.
                        Shared reports are stored locally and can only be viewed on the device
                        that created them.
                    </p>
                    <Link href="/audit">
                        <GradientButton>
                            Run Your Own Audit
                            <ArrowRight className="h-4 w-4" />
                        </GradientButton>
                    </Link>
                </div>
            </Container>
        </main>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SharePage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : '';

    const [audit, setAudit] = useState<AuditResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) { setLoading(false); return; }
        const report = loadReport(id);
        setAudit(report?.audit ?? null);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
            </main>
        );
    }

    if (!audit) return <EmptyState />;

    const { summary, score, recommendations, insights, aiSummary } = audit;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

            {/* Top bar */}
            <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
                <Container>
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-cyan-500">
                                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 13 C5 7, 8 3, 13 2 C11 6, 9 9, 8 13 Z" fill="currentColor" />
                                    <path d="M3 13 C5 11, 7 11, 8 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-bold tracking-tight text-slate-900">Whittle</span>
                        </Link>

                        {/* Shared badge */}
                        <div className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1">
                            <ExternalLink className="h-3 w-3 text-sky-600" />
                            <span className="text-[11px] font-semibold text-sky-700">Shared Report</span>
                        </div>

                        {/* CTA */}
                        <Link href="/audit">
                            <GradientButton size="sm">
                                Run My Audit
                            </GradientButton>
                        </Link>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="mx-auto max-w-3xl py-12 sm:py-16">

                    {/* Report header */}
                    <motion.div {...fadeUp(0)}>
                        <div className="mb-10">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-sky-600">
                                    Shared Audit Report
                                </span>
                                <span className="text-[11px] text-slate-400">{summary.date}</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                AI Spend Analysis
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                {summary.teamSize} · {summary.useCase}
                            </p>
                        </div>
                    </motion.div>

                    {/* 1. Hero savings */}
                    <motion.div {...fadeUp(0.08)}>
                        <div className="mb-8">
                            <SavingsHero summary={summary} />
                        </div>
                    </motion.div>

                    {/* 2. Stack health */}
                    <motion.div {...fadeUp(0.14)}>
                        <div className="mb-8">
                            <SectionLabel>Stack Health</SectionLabel>
                            <AuditScoreCard score={score} />
                        </div>
                    </motion.div>

                    {/* 3. Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="mb-8">
                            <SectionLabel>Recommendations</SectionLabel>
                            <div className="space-y-3">
                                {recommendations.map((rec, i) => (
                                    <motion.div
                                        key={rec.toolId}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <RecommendationCard recommendation={rec} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. AI summary */}
                    <motion.div {...fadeUp(0.3)}>
                        <div className="mb-8">
                            <SectionLabel>AI Summary</SectionLabel>
                            <AISummaryCard aiSummary={aiSummary} />
                        </div>
                    </motion.div>

                    {/* 5. Insights */}
                    {insights.length > 0 && (
                        <motion.div {...fadeUp(0.36)}>
                            <div className="mb-12">
                                <SectionLabel>Opportunity Insights</SectionLabel>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {insights.map((insight, i) => (
                                        <motion.div
                                            key={insight.id}
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <OpportunityInsightChip insight={insight} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CTA — invite viewer to run their own audit */}
                    <motion.div {...fadeUp(0.42)}>
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Free · No sign-up required
                            </p>
                            <h2 className="mb-2 text-xl font-bold text-white">
                                Audit your own AI stack
                            </h2>
                            <p className="mx-auto mb-6 max-w-sm text-sm text-slate-400">
                                See how much your team could save on AI tools in under 60 seconds.
                            </p>
                            <Link href="/audit">
                                <GradientButton size="lg">
                                    Start Free Audit
                                    <ArrowRight className="h-4 w-4" />
                                </GradientButton>
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </Container>
        </main>
    );
}
