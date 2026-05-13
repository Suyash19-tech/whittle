# Whittle — AI Spend Optimization Platform

Whittle is a lightweight SaaS platform that helps startup founders and engineering teams audit their AI software stack to uncover unnecessary spending. By analyzing tool usage against a centralized pricing engine, it delivers deterministic cost-saving recommendations alongside an AI-generated executive summary. It solves the rapidly growing problem of AI SaaS bloat, helping teams consolidate tooling and optimize licensing without sacrificing productivity.

## Live Demo
**[whittle-liart.vercel.app](https://whittle-liart.vercel.app)**

---

## Screenshots

| Landing Page | Audit Flow |
| :---: | :---: |
| ![Landing Page](./public/screenshots/landing.png) | ![Audit Flow](./public/screenshots/audit.png) |

| Results Dashboard | Consultation Flow |
| :---: | :---: |
| ![Results Dashboard](./public/screenshots/results.png) | ![Consultation Flow](./public/screenshots/consultation.png) |

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

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **State:** Zustand (persisted to localStorage)
- **Forms:** React Hook Form + Zod validation
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenRouter API (server-side)
- **Emails:** Resend (transactional)
- **Deployment:** Vercel

---

## Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Required variables for full functionality:
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# External APIs
RESEND_API_KEY=your_resend_key
OPENROUTER_API_KEY=your_openrouter_key

# App Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase Setup
Run the provided SQL schemas in your Supabase SQL Editor to create the necessary tables:
- `reports`
- `audit_leads`
- `consultation_requests`

### 4. Local Development
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 5. Deployment
Whittle is optimized for Vercel. Push to your repository, import the project in Vercel, and ensure all variables from `.env.local` are added to the Vercel Environment Variables settings before the initial build.

---

## Engineering Decisions / Trade-offs

### 1. Deterministic Engine vs. Fully AI-Generated Recommendations
* **What we chose:** A hardcoded pricing catalog and deterministic rules engine for financial math. AI is strictly used for the qualitative narrative summary.
* **What we avoided:** Passing raw tool data to an LLM to calculate savings and generate recommendations.
* **Why:** LLMs hallucinate math. For a fintech-adjacent product, presenting mathematically incorrect savings destroys credibility. Deterministic rules guarantee predictable, 100% accurate financial outputs.

### 2. Zero-Auth PLG Flow
* **What we chose:** Allowing users to complete the entire audit workflow anonymously. Session state is persisted via `localStorage` (Zustand), and reports are shared via unique SSR-rendered links.
* **What we avoided:** Forcing users to create an account via Supabase Auth before seeing their audit results.
* **Why:** In modern Product-Led Growth (PLG), time-to-value must be near zero. Forcing authentication upfront causes massive funnel drop-off. We capture leads *after* delivering undeniable value (the audit report).

### 3. Honeypot vs. Visible CAPTCHA
* **What we chose:** A visually hidden `website` input field (honeypot) to silently reject automated bot submissions on the lead and consultation forms.
* **What we avoided:** Integrating hCaptcha or Google reCAPTCHA.
* **Why:** The primary goal of the MVP is to prove conversion intent. Visible CAPTCHAs introduce significant user friction. A honeypot provides sufficient baseline spam protection for early-stage B2B SaaS without penalizing legitimate human users.

### 4. Single JSONB Blob vs. Relational Schema for Reports
* **What we chose:** Storing the entire computed `AuditResult` object as a single JSONB blob in the Supabase `reports` table.
* **What we avoided:** Normalizing the report into separate tables (e.g., `report_tools`, `report_recommendations`).
* **Why:** A generated report is a frozen snapshot in time. If our pricing catalog changes tomorrow, old shared reports must still display exactly what the user originally saw. The JSONB blob guarantees zero-migration versioning and makes fetching shared reports incredibly fast via a single query.

### 5. Lightweight Consultation Flow vs. Scheduling Infra
* **What we chose:** A simple Supabase-backed form that captures a "preferred time" string and triggers a transactional email via Resend, gated behind a `$100` savings threshold.
* **What we avoided:** Integrating a full bidirectional calendar API (like Calendly or Cron) directly into the UI.
* **Why:** Scope control. The immediate goal is to capture high-intent leads for manual concierge follow-up. Building a full scheduling UI introduces massive complexity and third-party dependencies that aren't necessary to validate the core business hypothesis.

---

## Supabase Tables

### `reports`
Stores full audit results as JSONB for shareable URLs. Guarantees version immunity.

### `audit_leads`
Captures lead information (email, company size) dynamically from results pages.

### `consultation_requests`
Stores consultation booking requests (conditionally rendered only when savings ≥ $100/mo).

---

## Project Structure

```
whittle/
├── src/
│   ├── app/                          # Next.js App Router & API routes
│   ├── components/                   # React components (Atomic-ish)
│   ├── services/                     # Pricing catalog, rules engine, AI
│   ├── lib/supabase/                 # Database clients
│   ├── store/                        # Zustand state
│   └── types/                        # Strict TypeScript interfaces
└── public/
    └── screenshots/                  # Marketing & documentation assets
```

---

## License

MIT

---

**Built for startup founders who treat AI spend as a real line item.**
