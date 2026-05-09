'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/shared/container';
import { GradientButton } from '@/components/ui/gradient-button';
import { MOCK_AUDIT } from '@/constants/mockAuditData';
import {
  SavingsHero,
  AuditScoreCard,
  RecommendationCard,
  OpportunityInsightChip,
  AISummaryCard,
} from '@/components/results';

// Shared animation helper — delay increases per section
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

/**
 * ResultsDemoPage — /results/demo
 *
 * Pure orchestrator: pulls data from MOCK_AUDIT and passes typed props
 * to each section component. No rendering logic lives here.
 *
 * To connect real data later: replace MOCK_AUDIT with an API call
 * returning AuditResult — zero component changes required.
 */
export default function ResultsDemoPage() {
  const { summary, score, recommendations, insights, aiSummary } = MOCK_AUDIT;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Top bar */}
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
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50">
                <Share2 className="h-3.5 w-3.5" />Share
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

          {/* Report header */}
          <motion.div {...fadeUp(0)}>
            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-sky-600">
                  Audit Report
                </span>
                <span className="text-[11px] text-slate-400">{summary.date}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your AI Spend Analysis
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

          {/* 2. Stack health score */}
          <motion.div {...fadeUp(0.14)}>
            <div className="mb-8">
              <SectionLabel>Stack Health</SectionLabel>
              <AuditScoreCard score={score} />
            </div>
          </motion.div>

          {/* 3. Recommendations — mapped from array */}
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

          {/* 4. AI summary */}
          <motion.div {...fadeUp(0.3)}>
            <div className="mb-8">
              <SectionLabel>AI Summary</SectionLabel>
              <AISummaryCard aiSummary={aiSummary} />
            </div>
          </motion.div>

          {/* 5. Opportunity insights — mapped from array */}
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

          {/* CTA footer */}
          <motion.div {...fadeUp(0.42)}>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Next step
              </p>
              <h2 className="mb-2 text-xl font-bold text-white">
                Ready to implement these changes?
              </h2>
              <p className="mx-auto mb-6 max-w-sm text-sm text-slate-400">
                Start a new audit with your real data and get a personalised optimisation plan.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/audit">
                  <GradientButton size="lg">
                    Run Your Audit
                    <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </Link>
                <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-transparent px-6 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800">
                  <Share2 className="h-4 w-4" />
                  Share this report
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </main>
  );
}
