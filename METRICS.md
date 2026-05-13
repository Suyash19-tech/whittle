# METRICS.md (The North Star)

# 1. The North Star Metric
### **Percentage of completed audits that lead to a consultation request.**

Whittle is not a daily-use dashboard; it is a **high-intent lead generation platform.** The real measure of success isn't how many people see their waste score, but how many people see that score and decide they need a professional to help them manage their procurement.

If the audit generates enough trust and curiosity that a founder clicks "Book Consultation," the product has achieved its primary goal.

---

# 2. Key Input Metrics
These metrics drive our North Star and tell us where the funnel is leaking.

### **Audit Completion Rate**
*   **Target**: >70%
*   **Why**: Measures onboarding friction. If this is low, the tool selection process is too exhausting or the "Value/Effort" ratio is off.

### **Shared Report Rate**
*   **Target**: >15%
*   **Why**: Measures recommendation quality. People only share reports that make them look smart or start a conversation. A high share rate means our "Roast My Stack" loop is working.

### **Recommendation Interaction Rate**
*   **Target**: >40%
*   **Why**: Measures engagement with our intelligence. Are users expanding the "Reasoning" blocks? Are they clicking on the "Downgrade" cards? This validates if the engine's logic is actually interesting.

---

# 3. First-Pass Instrumentation Strategy
We’ve identified the core events that need tracking to validate the engine’s performance:

| Event Name | Tracking Goal |
|---|---|
| `audit_started` | Traffic volume and interest levels. |
| `audit_completed` | Core activation signal. |
| `report_shared` | Distribution loop health. |
| `consultation_clicked` | High-intent lead generation. |
| `recommendation_expanded` | Trust in the "Reasoning" logic. |
| `tool_overlap_detected` | Frequency of our highest-value finding. |

---

# 4. The "Pivot" Decision Trigger
The most important number for our long-term survival is the **Consultation Conversion Rate.**

**The Warning Sign**: If audit completions are high and reports are being shared, but **consultation conversion stays below 3%**, we have a "Utility Gap."

**The Decision**:
- **If Conversion is Low**: We pivot from a "One-time Auditor" toward an "Ongoing Stack Manager" (SaaS platform), focusing on usage monitoring rather than one-off optimization.
- **If Sharing is Low**: We pivot the engine logic. This means the recommendations don't feel "special" or "believable" enough to trigger a social reaction.

**Our goal is to build a product where the intelligence is so undeniable that founders feel irresponsible *not* booking a follow-up call.**
