'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
    steps: string[];
    currentStep: number;
}

/**
 * ProgressStepper — premium horizontal step indicator
 * Centered, balanced, with smooth animated transitions
 */
export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
    return (
        <div className="mb-12 w-full">
            <div className="relative flex items-center justify-between">
                {/* Background connector track */}
                <div className="absolute left-0 right-0 top-[18px] h-px bg-slate-200" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={index}
                            className="relative z-10 flex flex-1 flex-col items-center"
                        >
                            {/* Animated connector fill */}
                            {index > 0 && (
                                <div className="absolute right-1/2 top-[18px] h-px w-full">
                                    <motion.div
                                        className="h-full origin-right bg-sky-500"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ transformOrigin: 'left' }}
                                    />
                                </div>
                            )}

                            {/* Step circle */}
                            <motion.div
                                className={cn(
                                    'relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-300',
                                    isCompleted
                                        ? 'border-sky-500 bg-sky-500'
                                        : isCurrent
                                            ? 'border-sky-500 bg-white'
                                            : 'border-slate-200 bg-white'
                                )}
                                animate={{ scale: isCurrent ? 1.08 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                                ) : (
                                    <span
                                        className={cn(
                                            'text-xs font-bold',
                                            isCurrent ? 'text-sky-600' : 'text-slate-400'
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                )}

                                {/* Current step pulse ring */}
                                {isCurrent && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-sky-400"
                                        initial={{ scale: 1, opacity: 0.6 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                                    />
                                )}
                            </motion.div>

                            {/* Label */}
                            <p
                                className={cn(
                                    'mt-2.5 text-center text-xs font-medium transition-colors duration-200',
                                    isCompleted || isCurrent ? 'text-slate-800' : 'text-slate-400'
                                )}
                            >
                                {step}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
