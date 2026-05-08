import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * Container Component
 * Responsive max-width wrapper with consistent padding
 * Ensures content stays readable and properly spaced on all screen sizes
 */
export function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
                className
            )}
        >
            {children}
        </div>
    );
}
