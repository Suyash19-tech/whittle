import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
}

/**
 * GradientButton — primary CTA button
 * Consistent sizing, focus ring, active state, disabled state.
 */
export function GradientButton({
    children,
    size = 'md',
    variant = 'primary',
    className,
    disabled,
    ...props
}: GradientButtonProps) {
    const sizeClasses = {
        sm: 'h-8  px-4  text-xs  gap-1.5',
        md: 'h-10 px-5  text-sm  gap-2',
        lg: 'h-11 px-7  text-sm  gap-2',
    };

    const variantClasses = {
        primary:
            'bg-gradient-to-r from-sky-500 to-cyan-500 text-white ' +
            'hover:from-sky-600 hover:to-cyan-600 ' +
            'active:from-sky-700 active:to-cyan-700 ' +
            'shadow-[0_2px_8px_rgba(14,165,233,0.25)]',
        secondary:
            'bg-slate-900 text-white ' +
            'hover:bg-slate-800 ' +
            'active:bg-slate-950',
    };

    return (
        <button
            disabled={disabled}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-semibold',
                'transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
