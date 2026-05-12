import type { Metadata } from 'next';
import { fetchReportFromSupabase } from '@/lib/supabase/reports';
import { formatCurrency } from '@/lib/utils';
import SharePageClient from './SharePageClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const report = await fetchReportFromSupabase(id);

    if (!report) {
      return {
        title: 'Whittle - AI Spend Optimization',
        description: 'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
      };
    }

    const { summary, score } = report;
    const formattedSavings = formatCurrency(summary.optimizedMonthlySpend, 'USD', 0);

    const title = `Whittle Report — ${formattedSavings}/mo optimized`;
    const description = `AI stack audit identified $${summary.monthlySavings}/mo in savings ($${summary.annualSavings}/year) with an optimization score of ${score.value}/100.`;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://whittle.vercel.app';
    const canonicalUrl = `${baseUrl}/share/${id}`;
    
    const images = [
      {
        url: "/og/whittle-default.png",
        width: 1200,
        height: 630,
        alt: "Whittle — AI Spend Audit",
      },
    ];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: canonicalUrl,
        siteName: "Whittle",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images,
      },
    };
  } catch (error) {
    return {
      title: 'Whittle - AI Spend Optimization',
      description: 'Audit your AI stack and uncover unnecessary spend in under 60 seconds.',
    };
  }
}

export default function SharePage() {
  return <SharePageClient />;
}
