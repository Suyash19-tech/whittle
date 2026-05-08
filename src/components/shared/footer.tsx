'use client';

import Link from 'next/link';
import { Container } from './container';

/**
 * Footer Component
 * Professional footer with links, copyright, and social indicators
 * Maintains brand consistency and provides navigation
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16">
            <Container>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500" />
                            <span className="text-lg font-bold text-slate-900">Whittle</span>
                        </div>
                        <p className="text-sm text-slate-600">
                            AI spend optimization for startup founders.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Product</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/audit"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Audit Tool
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 font-semibold text-slate-900">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-slate-600 hover:text-slate-900"
                                >
                                    Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
                    <p>&copy; {currentYear} Whittle. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
}
