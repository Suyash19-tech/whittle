# Automated Tests

Whittle uses **Vitest** for deterministic testing of the core audit intelligence engine. The test suite focuses on financial accuracy, scoring calibration, and recommendation logic.

## Test Files

### [engine.test.ts](file:///Users/suyash_.sr/Desktop/Whittle/src/services/audit/__tests__/engine.test.ts)
This file contains the primary integration tests for the audit engine. It covers:
- **Solo Engineer Overlap**: Verifies that redundant tools (Cursor + Copilot) trigger overlap warnings and reduce optimization scores.
- **Small Team Chat Bloat**: Ensures that having 3+ LLMs (ChatGPT, Claude, Gemini) triggers consolidation recommendations.
- **Enterprise Overkill**: Validates that high-tier plans on small teams trigger high-confidence downgrade recommendations.
- **Healthy Stack**: Confirms that well-optimized configurations receive "KEEP" verdicts and high health scores without spammy recommendations.
- **Seat Overprovisioning**: Tests "zombie" license detection when seat counts exceed the reported team size.

## Execution Commands

### Run all tests
```bash
npm run test:run
```

### Run tests in watch mode
```bash
npm run test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run coverage report
```bash
npx vitest run --coverage
```

## Testing Strategy
- **Deterministic**: Tests use the actual rule engine and pricing catalog without mocking core business logic.
- **Financial Integrity**: Assertions verify exact dollar savings and projected monthly costs.
- **Score Calibration**: Validates that the penalty-based scoring system correctly identifies inefficient stacks.
- **Null Safety**: Ensures that engine outputs remain valid even with minimal or edge-case inputs.
