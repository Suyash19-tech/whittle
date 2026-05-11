import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

/**
 * GlassCard — unified glassmorphism card.
 * backdrop-blur-md, border-slate-200/70, bg-white/75 — consistent across the product.
 */
export function GlassCard({ children, className, hover = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-slate-200/70 bg-white/75 p-6 backdrop-blur-md',
                'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]',
                hover && 'transition-smooth hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]',
                className
            )}
        >
            {children}
        </div>
    );
}
