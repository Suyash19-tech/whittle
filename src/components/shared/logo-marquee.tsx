/**
 * LogoMarquee
 *
 * Premium CSS-driven infinite horizontal scroll for the trust-band section.
 * - Pure CSS animation — no JS, no layout jank, no ResizeObserver hacks
 * - Seamless loop: renders two identical sets side-by-side; when the first
 *   set scrolls fully off-screen the second is already in place, creating
 *   a perfect loop at exactly -50% translateX
 * - Edge fade masks via CSS mask-image gradient
 * - Hover pauses via .marquee-root:hover .animate-marquee in globals.css
 * - Reduced-motion safe: prefers-reduced-motion collapses to static layout
 */

const COMPANIES: { name: string; descriptor: string }[] = [
    { name: 'Stripe', descriptor: 'Payments' },
    { name: 'Vercel', descriptor: 'Infrastructure' },
    { name: 'Linear', descriptor: 'Engineering' },
    { name: 'Mercury', descriptor: 'Banking' },
    { name: 'Ramp', descriptor: 'Finance' },
    { name: 'Notion', descriptor: 'Productivity' },
    { name: 'Retool', descriptor: 'Internal tools' },
    { name: 'Loom', descriptor: 'Async video' },
];

function CompanyItem({ name, descriptor }: { name: string; descriptor: string }) {
    return (
        <div className="flex flex-shrink-0 flex-col items-center gap-0.5 px-10">
            <span className="text-[15px] font-semibold tracking-tight text-slate-400 transition-colors duration-200 group-hover:text-slate-600">
                {name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-300">
                {descriptor}
            </span>
        </div>
    );
}

export function LogoMarquee() {
    return (
        <section className="border-y border-slate-100 bg-white py-12">
            {/* Label */}
            <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Inspired by teams building with AI
            </p>

            {/*
        Outer wrapper:
        - overflow-hidden clips the scrolling track
        - mask-image fades the left and right edges
        - marquee-root enables the CSS hover-pause selector
      */}
            <div
                className="marquee-root overflow-hidden"
                style={{
                    maskImage:
                        'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                    WebkitMaskImage:
                        'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                }}
            >
                {/*
          Track: flex row, no wrap.
          Two identical sets rendered inline — when set-1 scrolls to -50%
          set-2 is perfectly aligned, creating a seamless infinite loop.
        */}
                <div className="group flex w-max animate-marquee items-center">
                    {/* Set 1 */}
                    {COMPANIES.map((c) => (
                        <CompanyItem key={`a-${c.name}`} {...c} />
                    ))}

                    {/* Divider dot between sets */}
                    <span className="flex-shrink-0 px-4 text-slate-200">·</span>

                    {/* Set 2 — exact duplicate for seamless loop */}
                    {COMPANIES.map((c) => (
                        <CompanyItem key={`b-${c.name}`} {...c} />
                    ))}

                    {/* Trailing dot so the loop join is symmetric */}
                    <span className="flex-shrink-0 px-4 text-slate-200">·</span>
                </div>
            </div>

            {/* Reduced-motion fallback — static centered row */}
            <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
            justify-content: center;
          }
        }
      `}</style>
        </section>
    );
}
