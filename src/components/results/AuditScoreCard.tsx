'use client';

import { motion } from 'framer-motion';
import type { AuditScore } from '@/types/audit';

interface AuditScoreCardProps {
    score: AuditScore;
}

const CIRCUMFERENCE = 2 * Math.PI * 32; // r = 32

/**
 * AuditScoreCard
 * Animated SVG ring showing the 0–100 stack health score,
 * a qualitative label, and an explanation sentence.
 */
export function AuditScoreCard({ score }: AuditScoreCardProps) {
    const dashOffset = CIRCUMFERENCE * (1 - score.value / 100);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-6">
                {/* Ring */}
                <div className="relative flex-shrink-0">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                        {/* Track */}
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                        {/* Progress */}
                        <motion.circle
                            cx="40" cy="40" r="32"
                            fill="none"
                            stroke="url(#scoreGrad)"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={CIRCUMFERENCE}
                            initial={{ strokeDashoffset: CIRCUMFERENCE }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <defs>
                            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#2dd4bf" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Number overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-900">{score.value}</span>
                        <span className="text-[10px] font-medium text-slate-400">/ 100</span>
                    </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900">{score.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{score.explanation}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score.value}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        height: '6px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(to right, #38bdf8, #2dd4bf)',
                    }}
                />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                <span>Needs work</span>
                <span>Fully optimized</span>
            </div>
        </div>
    );
}
