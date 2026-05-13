# PROMPTS.md

# Overview

Whittle uses LLMs selectively rather than allowing AI to directly control financial or optimization decisions.

During development, I experimented with multiple prompting strategies across:
- Antigravity (Primary Development Environment)
- Claude
- GitHub Copilot
- Gemini

The biggest lesson from the project was that AI-generated recommendations sounded convincing but were often operationally inconsistent. As a result, I eventually shifted the core audit engine toward deterministic rules while still using AI heavily for:
- architecture exploration
- debugging
- UI iteration
- prompt experimentation
- report narration
- documentation generation
- edge-case reasoning

This document contains:
- the major prompts used
- why they were written this way
- what failed
- what eventually worked

---

# 1. Initial AI Audit Recommendation Prompt (Abandoned)

## Goal

Originally, I wanted the AI itself to generate optimization recommendations dynamically from raw tool stacks.

## Prompt

```txt
You are an AI SaaS procurement auditor.

Analyze the following AI tool stack and generate:
- optimization recommendations
- unnecessary subscriptions
- overlap detection
- estimated monthly savings
- enterprise overkill observations

Input:
- Team Size: {teamSize}
- Use Case: {useCase}
- Tools: {tools}

Rules:
- Be financially realistic
- Avoid aggressive recommendations
- Explain reasoning clearly
- Return concise bullet points
```

## Why I Wrote It This Way

I wanted recommendations to feel human and flexible instead of hardcoded.

The idea was:
- natural-language reasoning
- dynamic recommendations
- adaptive outputs for unusual stacks

## What Didn’t Work

This failed for several reasons:
- outputs were inconsistent
- savings estimates changed unpredictably
- recommendations became too aggressive
- similar stacks produced different outputs
- debugging became extremely difficult

Example failure:
The AI frequently recommended removing multiple overlapping tools even when real teams would realistically keep them for workflow reasons.

This was the point where I realized:
> “LLMs hallucinate math and procurement confidence.”

That insight directly led to the deterministic engine redesign.

---

# 2. Deterministic Audit Engine Architecture Prompt

## Goal

Redesign the recommendation system into a deterministic, explainable engine.

## Prompt

```txt
Design a deterministic AI spend optimization engine.

The engine should:
- detect overlap between AI tools
- identify oversized plans
- detect redundant subscriptions
- generate multiple findings
- support KEEP verdicts
- remain explainable and testable

Avoid:
- black-box AI reasoning
- vector databases
- embeddings
- complex ML systems

Focus on:
- maintainability
- realism
- deterministic outputs
- TypeScript-friendly architecture
```

## Why This Worked Better

This prompt forced the conversation away from “AI magic” and toward systems thinking.

It led directly to:
- capability categories
- overlap rules
- grouped findings
- KEEP verdicts
- deterministic scoring

This became the foundation of the final audit engine.

---

# 3. Overlap Detection Prompt

## Goal

Improve recommendation realism by detecting overlapping AI assistants.

## Prompt

```txt
Design lightweight overlap detection for AI SaaS tools.

Examples:
- ChatGPT + Claude + Gemini
- Cursor + GitHub Copilot + Windsurf

The system should:
- avoid over-aggressive downgrades
- generate believable consolidation recommendations
- support partial overlap
- preserve realistic workflows

Keep implementation deterministic and simple.
```

## Why This Was Important

Without overlap detection, the engine felt fake. Adding overlap detection massively improved realism.

## What Failed Initially

The first implementation generated too many duplicate recommendations and spammed downgrade cards. I later solved this using:
- grouped findings
- recommendation aggregation
- confidence tuning

---

# 4. KEEP Verdict Prompt

## Goal

Make healthy stacks feel intentionally analyzed instead of ignored.

## Prompt

```txt
Generate KEEP verdict logic for healthy AI tooling.

Requirements:
- not every tool should generate savings
- healthy stacks should receive positive validation
- wording should feel professional and believable
- avoid repetitive phrasing
```

## Why This Helped

This dramatically improved perceived intelligence. Before KEEP verdicts, the engine only “complained,” and healthy tools were ignored, making reports feel random. After KEEP verdicts, the engine felt balanced and trustworthy.

---

# 5. Score Calibration Prompt

## Goal

Tune optimization scores to feel realistic.

## Prompt

```txt
Calibrate optimization scoring for an AI spend auditing system.

Goals:
- healthy stacks should score ~80–95
- bloated stacks should score lower
- overlap should reduce scores moderately
- avoid perfect 100 scores too easily
- avoid catastrophic scoring unless clearly justified
```

## What Failed Initially

The first versions had binary behavior: either 100 or extremely low. 

Another major issue:
KEEP verdicts accidentally reduced optimization scores because they inherited penalty confidence weights. I fixed this by separating KEEP findings from penalty calculations entirely.

---

# 6. Lighthouse + Production Polish Prompt

## Goal

Improve deployment quality and production readiness.

## Prompt

```txt
Perform a final production polish pass.

Focus on:
- Lighthouse performance
- accessibility
- Open Graph previews
- image optimization
- metadata cleanup
- reduced-motion support
- semantic HTML
- mobile responsiveness

Avoid:
- redesigning architecture
- introducing instability
```

## Why This Was Valuable

The improvements included OG preview cards, compressed assets, semantic accessibility improvements, and mobile score improvements. This changed the product from a “hackathon demo” to a deployable SaaS MVP.

---

# 7. Prompting Strategy Lessons

## What Worked Best

The most successful prompts:
- constrained scope tightly
- emphasized determinism
- avoided “AI magic”
- focused on explainability
- treated the system like real software infrastructure

Good prompts asked for systems, trade-offs, and architecture instead of just asking to "make this smart."

---

## What Worked Worst

The worst prompts were vague, hype-oriented, or too dependent on AI-generated logic. Examples like “make recommendations smarter” or “act like a procurement expert” often produced unrealistic confidence and unstable outputs.

---

# Final Takeaway

The biggest realization during the project was:
> AI worked best as an engineering collaborator, not as the source of truth.

The final system became significantly stronger once pricing logic, scoring, and calculations were moved into deterministic systems. AI still accelerated development heavily, but the most trustworthy parts of Whittle came from explicit rules and human judgment.
