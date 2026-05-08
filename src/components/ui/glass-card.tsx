import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

/**
 * GlassCard — refined glassmorphism card
 * Subtle blur, clean border, soft shadow
 */
export function GlassCard({ children, className, hover = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm',
                'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]',
                hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
                className
            )}
        >
            {children}
        </div>
    );
}
