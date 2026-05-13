# PRICING_DATA.md

_Last verified: 2026-05-12_

The Whittle audit engine uses manually verified pricing data sourced directly from official vendor pricing pages.  
All pricing values used inside the recommendation engine are traceable to the URLs below and are synchronized with the internal `pricingCatalog.ts`.

---

# Cursor
**Official pricing page:** [cursor.com/pricing](https://cursor.com/pricing)

- **Hobby**: Free — verified 2026-05-12
- **Pro**: $20/user/month — verified 2026-05-12
- **Business**: $40/user/month — verified 2026-05-12

---

# GitHub Copilot
**Official pricing page:** [github.com/features/copilot/plans](https://github.com/features/copilot/plans)

- **Free**: $0 — verified 2026-05-12
- **Individual**: $10/user/month — verified 2026-05-12
- **Business**: $19/user/month — verified 2026-05-12
- **Enterprise**: $39/user/month — verified 2026-05-12

---

# ChatGPT
**Official pricing page:** [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)

- **Free**: $0 — verified 2026-05-12
- **Plus**: $20/user/month — verified 2026-05-12
- **Pro**: $200/user/month — verified 2026-05-12
- **Team**: $30/user/month — verified 2026-05-12
- **Enterprise**: Custom pricing (Flagged in audit) — verified 2026-05-12

---

# Claude
**Official pricing page:** [anthropic.com/pricing](https://www.anthropic.com/pricing)

- **Free**: $0 — verified 2026-05-12
- **Pro**: $20/user/month — verified 2026-05-12
- **Max (5x)**: $100/mo — verified 2026-05-12
- **Max (20x)**: $200/mo — verified 2026-05-12
- **Team**: $30/user/month — verified 2026-05-12
- **Enterprise**: Custom pricing — verified 2026-05-12

---

# Gemini
**Official pricing page:** [gemini.google/subscriptions](https://gemini.google/subscriptions/)

- **Free**: $0 — verified 2026-05-12
- **AI Pro**: $19.99/user/month — verified 2026-05-12
- **AI Ultra**: $99.99/user/month — verified 2026-05-12

---

# Perplexity
**Official pricing page:** [perplexity.ai/pro](https://www.perplexity.ai/pro)

- **Free**: $0 — verified 2026-05-12
- **Pro**: $20/user/month — verified 2026-05-12
- **Enterprise Pro**: Custom pricing — verified 2026-05-12

---

# Midjourney
**Official pricing page:** [midjourney.com/account/plans](https://www.midjourney.com/account/plans)

- **Basic**: $10/month — verified 2026-05-12
- **Standard**: $30/month — verified 2026-05-12
- **Pro**: $60/month — verified 2026-05-12
- **Mega**: $120/month — verified 2026-05-12

---

# Windsurf
**Official pricing page:** [codeium.com/pricing](https://codeium.com/pricing)

- **Free**: $0 — verified 2026-05-12
- **Pro**: $15/user/month — verified 2026-05-12
- **Teams**: $30/user/month — verified 2026-05-12
- **Enterprise**: Custom pricing — verified 2026-05-12

---

# Notes

- **Custom Pricing**: Enterprise tiers marked as "Custom pricing" or `null` in the catalog are excluded from deterministic savings calculations. The audit engine flags these as "Enterprise Flag" to suggest reviewing whether the premium features justify the undisclosed cost.
- **API Usage**: OpenAI and Anthropic API spend is usage-based and entered manually by the user. The catalog treats these as `$0` base cost with variable multipliers.
- **Update Cycle**: Pricing data is centralized in `pricingCatalog.ts`. Any changes to this document must be reflected in the code to maintain audit accuracy.
