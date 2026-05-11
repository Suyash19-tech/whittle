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

export function ToolCard({ id, name, provider, isSelected, onClick }: ToolCardProps) {
    const Icon = TOOL_ICON_MAP[id];

    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-pressed={isSelected}
            aria-label={`${isSelected ? 'Deselect' : 'Select'} ${name}`}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'group relative w-full rounded-xl border p-5 text-left',
                'transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:ring-offset-2',
                isSelected
                    ? 'border-sky-400 bg-sky-50/60 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
            )}
        >
            {/* Check indicator */}
            <motion.div
                className={cn(
                    'absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-150',
                    isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-200 bg-white'
                )}
                animate={{ scale: isSelected ? 1 : 0.85, opacity: isSelected ? 1 : 0.4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
                {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />}
            </motion.div>

            {/* Icon */}
            <div className={cn(
                'mb-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-150',
                isSelected
                    ? 'border-sky-200 bg-sky-100 text-sky-700'
                    : 'border-slate-100 bg-slate-50 text-slate-600 group-hover:border-slate-200'
            )}>
                {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : (
                    <span className="text-xs font-bold" aria-hidden="true">{name[0]}</span>
                )}
            </div>

            <p className={cn('text-sm font-semibold', isSelected ? 'text-sky-900' : 'text-slate-900')}>
                {name}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{provider}</p>
        </motion.button>
    );
}
