'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOL_ICON_MAP } from './tool-icons';

interface ToolCardProps {
    id: string;
    name: string;
    provider: string;
    isSelected: boolean;
    onClick: () => void;
}

/**
 * ToolCard — professional selectable card with SVG icon
 * No emojis. Clean, fintech-grade visual treatment.
 */
export function ToolCard({ id, name, provider, isSelected, onClick }: ToolCardProps) {
    const Icon = TOOL_ICON_MAP[id];

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'group relative w-full rounded-xl border p-5 text-left transition-all duration-200',
                isSelected
                    ? 'border-sky-400 bg-sky-50/60 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
            )}
        >
            {/* Selection check */}
            <motion.div
                className={cn(
                    'absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200',
                    isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-200 bg-white'
                )}
                animate={{ scale: isSelected ? 1 : 0.85, opacity: isSelected ? 1 : 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </motion.div>

            {/* Icon */}
            <div
                className={cn(
                    'mb-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200',
                    isSelected
                        ? 'border-sky-200 bg-sky-100 text-sky-700'
                        : 'border-slate-100 bg-slate-50 text-slate-600 group-hover:border-slate-200'
                )}
            >
                {Icon ? (
                    <Icon className="h-5 w-5" />
                ) : (
                    <span className="text-xs font-bold">{name[0]}</span>
                )}
            </div>

            {/* Text */}
            <p className={cn('text-sm font-semibold', isSelected ? 'text-sky-900' : 'text-slate-900')}>
                {name}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{provider}</p>
        </motion.button>
    );
}
