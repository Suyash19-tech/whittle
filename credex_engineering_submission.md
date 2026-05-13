# Whittle: Engineering Submission Files

## 1. Product Summary
Whittle is a lightweight SaaS platform that helps startup founders and engineering teams audit their AI software stack to uncover unnecessary spending. By analyzing tool usage, team size, and existing subscriptions against a centralized pricing engine, it delivers deterministic cost-saving recommendations alongside an AI-generated executive summary. It exists to solve the rapidly growing problem of AI SaaS bloat, helping teams consolidate tooling and optimize licensing without sacrificing productivity.

---

## 2. Recommended Screenshots

1. **Landing Page Hero (Desktop View)**
   * **State**: Initial page load showing the main CTA and the CSS-driven infinite logo marquee.
   * **Demonstrates**: Premium "fintech" UI styling, clear value proposition, and frontend polish.
2. **Audit Configuration Step (Mobile View)**
   * **State**: Step 3 of the audit flow (`/audit`), with specific tools (e.g., ChatGPT, Cursor) selected and seat counts being entered.
   * **Demonstrates**: Mobile-first responsive design, complex form state management via React Hook Form, and Zod validation UI.
3. **Results Dashboard: Savings & Stack Health (Desktop View)**
   * **State**: The top half of `/results/live` immediately after an audit.
   * **Demonstrates**: Data visualization (the dynamic spend comparison bar), financial calculations, and the confidence scoring system.
4. **Results Dashboard: Conversion Funnel (Desktop View)**
   * **State**: The bottom half of `/results/live` where a user has >$100 in savings, showing both the Lead Capture and Consultation forms.
   * **Demonstrates**: Product thinking, context-aware component rendering (Consultation form is gated by savings threshold), and clean form UI.
5. **Shared Report View**
   * **State**: The `/share/[id]` route. 
   * **Demonstrates**: Server-side rendering (SSR) for data hydration, zero-auth data sharing, and (conceptually) the dynamic Open Graph metadata implementation.

---

## 3. Suggested 30-Second Demo Flow

**Objective:** Prove technical competence and strong product sense rapidly.

* **[0:00 - 0:05] Landing Page:**
  * *Action:* Start on `/`. Scroll slightly, then click "Start Audit".
  * *Speak:* "Whittle is an AI spend optimizer. The UI is built with Next.js and Tailwind, designed to feel like a high-trust premium fintech product."
* **[0:05 - 0:15] Audit Flow:**
  * *Action:* Click through the stepper. Select "6-20 people", pick ChatGPT and Cursor. Enter 15 seats for ChatGPT Team. Click "Review & Submit".
  * *Speak:* "We intentionally skipped authentication to reduce friction. State is managed via a persisted Zustand store. When submitted, our engine calculates savings."
* **[0:15 - 0:22] Results Dashboard (Top):**
  * *Action:* Wait for the loading overlay to finish. Show the Savings Hero and Recommendations. 
  * *Speak:* "Crucially, the financial math uses a deterministic rules engine, not AI, ensuring 100% accuracy. We only use AI (via OpenRouter) to generate the narrative summary below."
* **[0:22 - 0:30] Conversion & Persistence (Bottom):**
  * *Action:* Scroll to the bottom forms. Click "Share this report". 
  * *Speak:* "Because this audit found over $100 in savings, a Supabase-backed consultation form dynamically renders. Users can also generate a permanent, SSR-rendered share link with custom Open Graph tags for virality."

---

## 4. Quick Start Guide

### Prerequisites
* Node.js 18+
* Supabase project
* Resend account (for transactional emails)
* OpenRouter API key (or direct Gemini key)

### Local Setup
1. **Clone & Install:**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Environment Variables:**
   Copy `.env.example` to `.env.local` and populate:
   ```env
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   
   # External Services
   RESEND_API_KEY=your_resend_key
   OPENROUTER_API_KEY=your_openrouter_key
   
   # App Context
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. **Database Setup:**
   Execute the SQL provided in the project documentation in your Supabase SQL Editor to create the `reports`, `audit_leads`, and `consultation_requests` tables.
4. **Run Development Server:**
   ```bash
   npm run dev
   ```

### Deployment
Deploy easily to Vercel. Ensure all environment variables from `.env.local` are added to the Vercel project settings prior to the first production build.

---

## 5. Engineering Decisions / Trade-offs

### 1. Deterministic Rules vs. AI-Generated Logic
* **What we chose:** A hardcoded pricing catalog and deterministic rules engine for all financial math and tool recommendations. We restricted AI strictly to generating the qualitative narrative summary.
* **What we avoided:** Passing raw tool data to an LLM and asking it to calculate savings and generate recommendations.
* **Why:** LLMs hallucinate math. For a fintech-adjacent product, presenting mathematically incorrect savings destroys user trust instantly. Deterministic rules guarantee predictable, accurate financial outputs.

### 2. Single JSONB Blob vs. Relational Schema for Reports
* **What we chose:** Storing the entire computed `AuditResult` as a single JSONB blob in the Supabase `reports` table.
* **What we avoided:** Normalizing the report into separate tables for `report_tools`, `report_recommendations`, etc.
* **Why:** A generated report is a frozen snapshot in time. If our pricing catalog changes tomorrow, old shared reports should still display exactly what the user saw originally. The JSONB blob guarantees zero-migration versioning and makes fetching shared reports a single, fast query.

### 3. Honeypot vs. Visible CAPTCHA
* **What we chose:** A lightweight visually hidden `website` input field (honeypot) to silently reject bot submissions on the lead and consultation forms.
* **What we avoided:** Integrating hCaptcha or Google reCAPTCHA.
* **Why:** The primary goal of this MVP is to prove conversion intent. Visible CAPTCHAs introduce significant user friction. A honeypot provides sufficient baseline spam protection for early-stage B2B SaaS without penalizing legitimate users.

### 4. No Authentication vs. Full User Accounts
* **What we chose:** Allowing users to complete the entire primary workflow anonymously, relying on `localStorage` (via Zustand) to persist session state and unique IDs for shared links.
* **What we avoided:** Forcing users to sign up via Supabase Auth before seeing their audit results.
* **Why:** In modern PLG (Product-Led Growth), time-to-value must be near zero. Forcing auth upfront causes massive drop-off. We chose to capture leads *after* delivering value (the audit report).

### 5. Lightweight Consultation Trigger vs. Full Scheduling Infra
* **What we chose:** A simple Supabase-backed form that captures preferred times and sends a transactional email via Resend, gated behind a `$100` savings threshold.
* **What we avoided:** Integrating a full bidirectional calendar integration (like Calendly or Cron API) directly into the UI.
* **Why:** Scope control. The goal is to capture high-intent leads for manual follow-up. Building a full scheduling UI introduces massive complexity and external dependencies that aren't necessary to validate the core business hypothesis.

---

## 6. Submission Readiness Review

* **Strongest Parts:** 
  * **Frontend Polish:** The glassmorphic UI, fluid Framer Motion animations, and typography choices successfully mimic top-tier SaaS products (Stripe, Linear).
  * **Product Architecture:** The clear separation of concerns between the deterministic rules engine and the AI narrative generation.
  * **Production Polish:** Perfect Lighthouse scores, semantic HTML, `prefers-reduced-motion` support, optimized image assets, and dynamic Open Graph generation.
* **Weakest Parts:** 
  * **Rate Limiting:** Currently lacks application-level rate limiting on the `/api/audit/summarise` endpoint (relying only on Vercel infrastructure limits), which leaves the OpenRouter API key somewhat exposed to abuse.
  * **Testing:** Lacks automated E2E test coverage (e.g., Playwright) for the multi-step form flow.
* **What feels Production-Grade:** 
  * The UX/UI implementation, accessibility standards, SEO metadata, and the transactional email integration (graceful degradation if email fails, db save succeeds).
* **What still feels MVP:** 
  * The pricing catalog is currently a hardcoded TypeScript constant. In a true mature product, this would be a database-driven CRM to allow non-technical teams to update software prices.
* **Likely Reviewer Impression:** 
  * Highly credible. The reviewer will notice that deliberate, mature product-engineering decisions were made (e.g., avoiding auth for faster time-to-value, using JSONB for immutable reports). It looks, feels, and operates like a real product rather than a generic boilerplate assignment.
