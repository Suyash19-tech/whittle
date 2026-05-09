# Whittle — Dev Log

---

## Day 2 — 2026-05-09

**Hours worked:** 9

### What I did

**Results dashboard**
- Built the full results dashboard UI at `/results/demo` with savings hero, stack health score ring, recommendation cards, AI summary, and opportunity insights
- Wired the dashboard to read live audit data from Zustand store — falls back to mock data gracefully when no audit has been run yet
- Extracted all sections into reusable components (`SavingsHero`, `AuditScoreCard`, `RecommendationCard`, `OpportunityInsightChip`, `AISummaryCard`)

**Recommendation engine**
- Built a deterministic rule-based engine in `src/services/audit/rules/`
- Implemented 8 tool-level rules (ChatGPT Team → Plus, Cursor Business → Pro, Claude Pro → Free when secondary, etc.) and 5 structural insight rules
- Engine is pure functions — no side effects, fully testable, easy to extend

**Calculation layer**
- `spendCalculator`: derives all spend totals from recommendation array
- `scoreCalculator`: penalty-based 0–100 optimization score with explainable bands
- `computeAuditSummary`: single orchestrator wiring both calculators
- Mock data now computed dynamically — change a plan cost and everything updates

**AI summary integration**
- Integrated Gemini 2.5 Flash via `/api/audit/summarise` API route
- API key lives server-side only — never exposed to the browser
- Prompt engineered for calm, financially intelligent, advisor-like tone
- Built a full fallback chain: missing key → API error → timeout → malformed response → local deterministic summary. The product never appears broken regardless of API state.

**Shareable report architecture**
- Built `/share/[id]` — a public report page that renders a full audit dashboard from a stored report
- `shareReport.ts` utility: `generateReportId()`, `saveReport()`, `loadReport()`, `buildShareUrl()`
- Reports persisted to `localStorage` under `whittle_report_<id>` — lightweight, zero infrastructure
- Share button on results page saves the report, generates a URL, copies to clipboard, and shows a URL banner as fallback if clipboard is blocked
- Empty state on `/share/[id]` explains the localStorage limitation clearly and offers a CTA to run their own audit

**Local persistence strategy**
- `auditResults` added to Zustand `partialize` — survives navigation and page refresh
- This was the root cause of the results page always showing mock data instead of the user's real audit
- localStorage is the right persistence layer for MVP: zero infrastructure, instant, works offline

**Graceful invalid-state handling**
- `/share/[id]`: if report not found → clean empty state with explanation, not a broken page
- `/results/live`: if no audit in store → redirects to `/audit` automatically
- AI summary: 5-layer fallback chain ensures the summary section always renders something coherent
- Share button: if clipboard API is blocked → URL banner appears so user can copy manually

**Dynamic metadata support**
- `/share/[id]` page structured for future dynamic metadata (title, description, OG image)
- OG image placeholder file created at `src/app/share/[id]/opengraph-image.tsx`
- Ready for `@vercel/og` integration when needed

**Resilient UX philosophy**
- Every feature has a graceful degradation path — nothing hard-fails visibly to the user
- AI summary failing → local summary renders. Clipboard blocked → URL banner shows. Report missing → helpful empty state. Store empty → mock data fills in.
- The product should feel trustworthy even when things go wrong under the hood

### What I learned
- Zustand `partialize` is easy to forget — if a field isn't listed, it won't survive a page navigation even though it's in memory
- `navigator.clipboard.writeText()` silently fails in many contexts (non-HTTPS, unfocused tab, some browsers) — always have a visible fallback
- Free-tier AI APIs (OpenRouter, Gemini free tier) have unpredictable rate limits — building the fallback first, not as an afterthought, is the right approach
- Deterministic rule engines are underrated for MVP recommendation systems — they're explainable, testable, and fast to iterate on

### Blockers
- OpenRouter free models were all rate-limited (429) — switched to Gemini 2.5 Flash which worked immediately
- Previous Gemini keys had `limit: 0` (API not enabled on the project) — needed a fresh key from AI Studio

### Plan for tomorrow
- Polish the audit form UX further
- Add export to PDF/CSV
- Improve the share page with better OG metadata
- Consider adding a "previous audits" history view

---

## Day 1 — 2026-05-08

**Hours worked:** 6

### What I did
- Finalized product positioning for Whittle
- Setup Next.js + TypeScript architecture
- Built initial landing page and audit flow
- Refined fintech-style UI direction
- Improved onboarding and tool selection UX

### What I learned
- Importance of visual hierarchy and spacing in SaaS products
- Next.js App Router structure basics

### Blockers
- Initial UI felt too template-like and unpolished

### Plan for tomorrow
- Improve results dashboard
- Implement real audit logic
- Continue UI refinement
