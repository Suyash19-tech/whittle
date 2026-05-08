'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface StepContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
    isActive: boolean;
    stepKey: number;
}

/**
 * StepContainer — animated wrapper for each audit step
 * Smooth directional slide transitions between steps
 */
export function StepContainer({
    title,
    description,
    children,
    isActive,
    stepKey,
}: StepContainerProps) {
    if (!isActive) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={stepKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Step heading */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-2 text-base text-slate-500">{description}</p>
                    )}
                </div>

                <div className="space-y-5">{children}</div>
            </motion.div>
        </AnimatePresence>
    );
}
