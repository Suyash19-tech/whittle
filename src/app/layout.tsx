import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: 'Whittle - AI Spend Optimization',
    description:
        'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
    keywords: [
        'AI',
        'spend optimization',
        'cost audit',
        'startup tools',
        'API optimization',
    ],
    authors: [{ name: 'Whittle' }],
    creator: 'Whittle',
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://whittle.app',
        title: 'Whittle - AI Spend Optimization',
        description:
            'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
        images: [{ url: '/og/whittle-default.jpg', width: 1200, height: 630, alt: 'Whittle — AI Spend Optimization' }],
        siteName: 'Whittle',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Whittle - AI Spend Optimization',
        description:
            'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-slate-100/40 text-slate-900 selection:bg-sky-100`}>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
                >
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    );
}
