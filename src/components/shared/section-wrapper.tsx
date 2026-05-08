import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

/**
 * SectionWrapper Component
 * Provides consistent vertical spacing and styling for page sections
 * Ensures premium whitespace system is maintained throughout the app
 */
export function SectionWrapper({
    children,
    className,
    id,
}: SectionWrapperProps) {
    return (
        <section
            id={id}
            className={cn('w-full py-16 sm:py-20 lg:py-24', className)}
        >
            {children}
        </section>
    );
}
