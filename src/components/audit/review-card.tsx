'use client';

interface ReviewItem {
    label: string;
    value: string | number;
    highlight?: boolean;
}

interface ReviewCardProps {
    title: string;
    items: ReviewItem[];
}

/**
 * ReviewCard — clean, fintech-grade information display
 */
export function ReviewCard({ title, items }: ReviewCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {title}
            </p>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{item.label}</span>
                        <span
                            className={
                                item.highlight
                                    ? 'text-sm font-bold text-sky-700'
                                    : 'text-sm font-semibold text-slate-900'
                            }
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
