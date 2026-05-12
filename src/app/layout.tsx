import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://whittle.app',
        title: 'Whittle - AI Spend Optimization',
        description:
            'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
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
            <body className={`${inter.className} bg-slate-50 text-slate-900`}>
                {children}
            </body>
        </html>
    );
}
