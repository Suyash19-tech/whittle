'use client';

import Link from 'next/link';
import { Container } from './container';

/**
 * Navbar — minimal, premium, Stripe-inspired
 */
export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
            <Container>
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                            <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none">
                                <path d="M3 13 C5 7, 8 3, 13 2 C11 6, 9 9, 8 13 Z" fill="currentColor" />
                                <path d="M3 13 C5 11, 7 11, 8 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>
                        <span className="text-[15px] font-bold tracking-tight text-slate-900">Whittle</span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden items-center gap-7 md:flex">
                        {['Features', 'Pricing', 'About'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link
                        href="/audit"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-all hover:bg-slate-700"
                    >
                        Start Audit
                    </Link>
                </div>
            </Container>
        </nav>
    );
}
