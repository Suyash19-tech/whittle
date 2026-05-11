'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
    steps: string[];
    currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
    return (
        <div className="mb-10 w-full" role="list" aria-label="Audit steps">
            <div className="relative flex items-center justify-between">
                {/* Background track */}
                <div className="absolute left-0 right-0 top-[18px] h-px bg-slate-200" aria-hidden="true" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={index}
                            role="listitem"
                            aria-current={isCurrent ? 'step' : undefined}
                            className="relative z-10 flex flex-1 flex-col items-center"
                        >
                            {/* Animated connector fill */}
                            {index > 0 && (
                                <div className="absolute right-1/2 top-[18px] h-px w-full" aria-hidden="true">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ height: '100%', transformOrigin: 'left', background: '#0ea5e9' }}
                                    />
                                </div>
                            )}

                            {/* Step circle */}
                            <motion.div
                                aria-label={`Step ${index + 1}: ${step}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                                animate={{ scale: isCurrent ? 1.06 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={cn(
                                    'relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-200',
                                    isCompleted ? 'border-sky-500 bg-sky-500'
                                        : isCurrent ? 'border-sky-500 bg-white'
                                            : 'border-slate-200 bg-white'
                                )}>
                                    {isCompleted ? (
                                        <Check className="h-4 w-4 text-white" strokeWidth={2.5} aria-hidden="true" />
                                    ) : (
                                        <span className={cn('text-xs font-bold', isCurrent ? 'text-sky-600' : 'text-slate-400')}>
                                            {index + 1}
                                        </span>
                                    )}

                                    {/* Pulse ring on current step */}
                                    {isCurrent && (
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                                            aria-hidden="true"
                                            style={{ position: 'absolute', inset: 0, borderRadius: '9999px', border: '2px solid #38bdf8' }}
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* Label */}
                            <p className={cn(
                                'mt-2.5 text-center text-[11px] font-medium tracking-[0.04em] transition-colors duration-200',
                                isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'
                            )}>
                                {step}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
