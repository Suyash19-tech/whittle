# Whittle — AI Spend Optimization Platform

A production SaaS application for startup founders and engineering teams to audit, optimise, and reduce their AI tool spending. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

**Live:** [whittle.vercel.app](https://whittle.vercel.app)

---

## Features

| Feature | Status | Route |
|---------|--------|-------|
| Landing page with hero + social proof | ✅ Shipped | `/` |
| Multi-step AI audit form (4 steps) | ✅ Shipped | `/audit` |
| Dynamic pricing engine (2026 catalog) | ✅ Shipped | — |
| Rules-based recommendation engine | ✅ Shipped | — |
| AI-generated narrative summary (OpenRouter) | ✅ Shipped | — |
| Results dashboard with savings visualisation | ✅ Shipped | `/results/demo`, `/results/live` |
| Shareable public report URLs | ✅ Shipped | `/share/[id]` |
| Open Graph + Twitter Card previews | ✅ Shipped | `/share/[id]` |
| Lead capture form (Supabase) | ✅ Shipped | Results pages |
| Credex consultation booking (Supabase) | ✅ Shipped | Results pages (≥$100/mo savings) |
| Responsive design (mobile-first) | ✅ Shipped | All pages |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State:** Zustand (persisted to localStorage)
- **Forms:** React Hook Form + Zod validation
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenRouter API (server-side)
- **Deployment:** Vercel

## Project Structure

```
whittle/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout + metadata
│   │   ├── page.tsx                  # Landing page
│   │   ├── audit/page.tsx            # Multi-step audit form
│   │   ├── results/
│   │   │   ├── demo/page.tsx         # Demo/real results
│   │   │   └── live/page.tsx         # Live results (from store)
│   │   ├── share/[id]/
│   │   │   ├── page.tsx              # Server component + OG metadata
│   │   │   └── SharePageClient.tsx   # Client component for shared reports
│   │   └── api/audit/summarise/      # AI summary API route
│   │
│   ├── components/
│   │   ├── audit/                    # Audit form components
│   │   ├── results/                  # Results dashboard components
│   │   │   ├── SavingsHero.tsx
│   │   │   ├── AuditScoreCard.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── OpportunityInsightChip.tsx
│   │   │   ├── AISummaryCard.tsx
│   │   │   ├── LeadCapture.tsx
│   │   │   └── ConsultationCTA.tsx
│   │   ├── shared/                   # Layout components
│   │   └── ui/                       # Reusable UI primitives
│   │
│   ├── services/
│   │   ├── audit/                    # Pricing catalog, rules engine, calculators
│   │   └── ai/                       # OpenRouter integration
│   │
│   ├── lib/supabase/                 # Supabase client + data access
│   │   ├── client.ts
│   │   ├── reports.ts
│   │   ├── leads.ts
│   │   └── consultations.ts
│   │
│   ├── store/audit.store.ts          # Zustand state management
│   ├── types/audit.ts                # TypeScript domain types
│   ├── constants/                    # Tool catalog, mock data
│   └── styles/globals.css            # Tailwind + custom utilities
│
├── public/
│   ├── og/whittle-default.png        # OG share image (1200×630)
│   ├── favicon.png                   # Favicon
│   ├── robots.txt
│   └── sitemap.xml
│
└── Configuration files
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase project (for persistence)

### Installation

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase and OpenRouter credentials
```

### Development

```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run type-check   # TypeScript checking
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Vitest
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Summaries
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://whittle.vercel.app
NODE_ENV=development
```

## Supabase Tables

### `reports`
Stores full audit results as JSONB for shareable URLs.

### `audit_leads`
Captures lead information from results pages.

### `consultation_requests`
Stores consultation booking requests (shown when savings ≥ $100/mo).

## Architecture Decisions

- **App Router** — Server components for metadata/OG, client components for interactive UI
- **Zustand** — Lightweight state with localStorage persistence for audit flow continuity
- **Rules engine** — Deterministic recommendation logic (no AI dependency for core savings calculations)
- **Abuse Protection** — Uses a lightweight "honeypot" field (`website`) on lead and consultation forms to block automated bot submissions without adding friction (CAPTCHA) to the user experience.
- **Graceful degradation** — All Supabase/AI calls fail silently with fallbacks; no feature breaks on network errors
- **Single JSONB blob** — Reports stored as complete snapshots for zero-migration sharing

## License

MIT

---

**Built for startup founders who treat AI spend as a real line item.**
