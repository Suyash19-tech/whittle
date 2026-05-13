'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingDown, BarChart3, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { GradientButton } from '@/components/ui/gradient-button';
import { Container } from '@/components/shared/container';
import { LogoMarquee } from '@/components/shared/logo-marquee';
import { Footer } from '@/components/shared/footer';

export default function Home() {
    return (
        <>
        <main id="main-content" className="min-h-screen">

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pb-0 pt-24 sm:pt-32">
                {/* Subtle background grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <Container>
                    <div className="mx-auto max-w-2xl text-center">

                        {/* Badge */}
                        <div className="mb-6 animate-fade-in inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            <span className="text-xs font-semibold tracking-wide text-sky-700 uppercase">
                                AI Spend Intelligence
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="animate-slide-up mb-5 text-[2.75rem] font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-6xl">
                            Stop overpaying for{' '}
                            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                                AI tools
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="animate-slide-up mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-500">
                            Audit your AI stack and uncover unnecessary spend in under 60 seconds.
                            Built for startup founders and engineering teams.
                        </p>

                        {/* CTAs */}
                        <div className="animate-slide-up flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Link href="/audit">
                                <GradientButton size="lg">
                                    Start Free Audit
                                    <ArrowRight className="h-4 w-4" />
                                </GradientButton>
                            </Link>
                            <Link href="/results/demo" className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                                See how it works
                            </Link>
                        </div>

                        {/* Social proof */}
                        <p className="mt-5 text-xs text-slate-400">
                            No credit card required · Free forever for small teams
                        </p>
                    </div>

                    {/* ─── Dashboard Preview Card ─────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative mx-auto mt-16 max-w-4xl">
                            {/* Glow */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-sky-200/40 to-transparent blur-xl" />

                            <div className="relative rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                                {/* Window chrome */}
                                <div className="flex items-center gap-1.5 border-b border-slate-100 px-5 py-3.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    <span className="ml-3 text-xs font-medium text-slate-400">
                                        whittle.app / audit / results
                                    </span>
                                </div>

                                <div className="p-6 sm:p-8">
                                    {/* Header row */}
                                    <div className="mb-6 flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                                Audit Report
                                            </p>
                                            <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                Your AI Spend Analysis
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1.5">
                                            <BarChart3 className="h-4 w-4 text-sky-600" />
                                            <span className="text-xs font-semibold text-sky-700">Live Preview</span>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                                            <p className="text-xs font-medium text-slate-500">Current Spend</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">$1,240</p>
                                            <p className="mt-0.5 text-xs text-slate-400">per month</p>
                                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                                <div className="h-full w-full rounded-full bg-slate-400" />
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-5">
                                            <p className="text-xs font-medium text-slate-500">Optimized Spend</p>
                                            <p className="mt-2 text-2xl font-bold text-teal-700">$760</p>
                                            <p className="mt-0.5 text-xs text-slate-400">per month</p>
                                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-teal-100">
                                                <div className="h-full w-[61%] rounded-full bg-teal-500" />
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-5">
                                            <p className="text-xs font-medium text-slate-500">Potential Savings</p>
                                            <p className="mt-2 text-2xl font-bold text-sky-700">$480</p>
                                            <p className="mt-0.5 text-xs text-slate-400">per month</p>
                                            <div className="mt-4 flex items-center gap-1.5">
                                                <TrendingDown className="h-3.5 w-3.5 text-sky-600" />
                                                <span className="text-xs font-semibold text-sky-600">$5,760 / year</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                            Top Recommendations
                                        </p>
                                        <div className="space-y-2.5">
                                            {[
                                                {
                                                    action: 'Downgrade ChatGPT Team → ChatGPT Plus',
                                                    saving: 'Save $200/mo',
                                                    note: '83% of your team uses basic features only',
                                                },
                                                {
                                                    action: 'Switch Cursor Business → Cursor Pro',
                                                    saving: 'Save $280/mo',
                                                    note: 'Consolidate to a single plan',
                                                },
                                            ].map((rec, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                                                >
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-slate-900">{rec.action}</p>
                                                        <p className="text-xs text-slate-500">{rec.note}</p>
                                                    </div>
                                                    <span className="flex-shrink-0 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                                                        {rec.saving}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* ─── Trusted By / Marquee ─────────────────────────────── */}
            <LogoMarquee />

            {/* ─── Features ─────────────────────────────────────────── */}
            <section className="py-24 sm:py-32">
                <Container>
                    <div className="mx-auto mb-14 max-w-xl text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-sky-600">
                            Why Whittle
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Financial intelligence for your AI stack
                        </h2>
                        <p className="mt-4 text-base text-slate-500">
                            Built for teams that treat AI spend as a real line item.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                Icon: Clock,
                                title: '60-second audit',
                                body: 'Answer a few questions about your stack. Get a full spend breakdown instantly.',
                            },
                            {
                                Icon: TrendingDown,
                                title: 'Actionable savings',
                                body: 'Specific, ranked recommendations — not generic advice. See exact dollar impact.',
                            },
                            {
                                Icon: Shield,
                                title: 'Trusted by operators',
                                body: 'Built for founders and engineering leads who treat cost as a competitive advantage.',
                            },
                        ].map(({ Icon, title, body }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                                        <Icon className="h-5 w-5 text-sky-600" />
                                    </div>
                                    <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────── */}
            <section className="pb-24 sm:pb-32">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 px-8 py-14 text-center sm:px-16 sm:py-20">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-sky-200">
                                Get started free
                            </p>
                            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                                Ready to optimize your AI spend?
                            </h2>
                            <p className="mx-auto mb-8 max-w-md text-base text-sky-100">
                                Join founders already saving thousands per year on AI tooling.
                            </p>
                            <Link href="/audit">
                                <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-sky-700 transition-all hover:bg-sky-50 hover:shadow-lg">
                                    Start Your Free Audit
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </Container>
            </section>

        </main>
        <Footer />
        </>
    );
}
