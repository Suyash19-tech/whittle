import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../rules/engine';
import { computeAuditSummary } from '../computeAuditSummary';
import type { ToolInput } from '../rules/types';

describe('Audit Engine Intelligence', () => {
  
  it('Scenario 1: SOLO ENGINEER OVERLAP (Cursor + Copilot + ChatGPT)', () => {
    const toolInputs: ToolInput[] = [
      { toolId: 'cursor', toolName: 'Cursor', category: 'code', planId: 'pro', planName: 'Pro', monthlySpend: 20, seats: 1 },
      { toolId: 'github-copilot', toolName: 'GitHub Copilot', category: 'code', planId: 'individual', planName: 'Individual', monthlySpend: 10, seats: 1 },
      { toolId: 'chatgpt', toolName: 'ChatGPT', category: 'llm', planId: 'plus', planName: 'Plus', monthlySpend: 20, seats: 1 },
    ];

    const engineOutput = generateRecommendations({
      tools: toolInputs,
      teamSize: '1-5',
      useCase: 'coding',
    });

    const result = computeAuditSummary({
      id: 'test-1',
      date: '2026-05-13',
      teamSize: '1-5',
      useCase: 'Coding',
      toolInputs,
      recommendations: engineOutput.recommendations,
    });

    // Check for overlap recommendation (Cursor & Copilot)
    const hasOverlap = engineOutput.recommendations.some(r => r.optimizationCategory === 'overlap');
    expect(hasOverlap).toBe(true);

    // Check for KEEP verdict (ChatGPT)
    const hasKeep = engineOutput.recommendations.some(r => r.optimizationCategory === 'keep');
    expect(hasKeep).toBe(true);

    // Score should be below fully optimized due to overlap
    expect(result.score.value).toBeLessThan(90);
    expect(result.summary.monthlySavings).toBeGreaterThan(0);
  });

  it('Scenario 2: SMALL TEAM CHAT BLOAT (Multiple LLMs)', () => {
    const toolInputs: ToolInput[] = [
      { toolId: 'chatgpt', toolName: 'ChatGPT', category: 'llm', planId: 'team', planName: 'Team', monthlySpend: 300, seats: 10 },
      { toolId: 'claude', toolName: 'Claude', category: 'llm', planId: 'pro', planName: 'Pro', monthlySpend: 20, seats: 1 },
      { toolId: 'gemini', toolName: 'Gemini', category: 'llm', planId: 'ai-pro', planName: 'AI Pro', monthlySpend: 199.90, seats: 10 },
    ];

    const engineOutput = generateRecommendations({
      tools: toolInputs,
      teamSize: '1-5', // Rule chatAssistantOverlap triggers on '1-5'
      useCase: 'mixed',
    });

    const result = computeAuditSummary({
      id: 'test-2',
      date: '2026-05-13',
      teamSize: '1-5',
      useCase: 'Mixed Use',
      toolInputs,
      recommendations: engineOutput.recommendations,
    });

    // Overlap should be detected for 3+ LLMs on small team
    const hasOverlap = engineOutput.recommendations.some(r => r.optimizationCategory === 'overlap');
    expect(hasOverlap).toBe(true);
    expect(result.summary.monthlySavings).toBeGreaterThan(0);
    expect(result.score.value).toBeLessThan(80);
  });

  it('Scenario 3: ENTERPRISE OVERKILL (Copilot Enterprise on small team)', () => {
    const toolInputs: ToolInput[] = [
      { toolId: 'github-copilot', toolName: 'GitHub Copilot', category: 'code', planId: 'enterprise', planName: 'Enterprise', monthlySpend: 117, seats: 3 },
    ];

    const engineOutput = generateRecommendations({
      tools: toolInputs,
      teamSize: '1-5',
      useCase: 'coding',
    });

    const result = computeAuditSummary({
      id: 'test-3',
      date: '2026-05-13',
      teamSize: '1-5',
      useCase: 'Coding',
      toolInputs,
      recommendations: engineOutput.recommendations,
    });

    const enterpriseRec = engineOutput.recommendations.find(r => r.toolId === 'github-copilot');
    expect(enterpriseRec?.optimizationCategory).toBe('enterprise-flag');
    expect(enterpriseRec?.confidence).toBe('high');
    expect(result.summary.monthlySavings).toBeGreaterThan(0);
  });

  it('Scenario 4: HEALTHY STACK (Minimal redundancy)', () => {
    const toolInputs: ToolInput[] = [
      { toolId: 'cursor', toolName: 'Cursor', category: 'code', planId: 'pro', planName: 'Pro', monthlySpend: 20, seats: 1 },
      { toolId: 'chatgpt', toolName: 'ChatGPT', category: 'llm', planId: 'plus', planName: 'Plus', monthlySpend: 20, seats: 1 },
    ];

    const engineOutput = generateRecommendations({
      tools: toolInputs,
      teamSize: '1-5',
      useCase: 'coding',
    });

    const result = computeAuditSummary({
      id: 'test-4',
      date: '2026-05-13',
      teamSize: '1-5',
      useCase: 'Coding',
      toolInputs,
      recommendations: engineOutput.recommendations,
    });

    // Should mostly be KEEP verdicts
    const actionable = engineOutput.recommendations.filter(r => r.optimizationCategory !== 'keep');
    expect(actionable.length).toBe(0);

    // Score should be high (>= 80 as requested)
    expect(result.score.value).toBeGreaterThanOrEqual(80);
    expect(result.summary.monthlySavings).toBe(0);
  });

  it('Scenario 5: SEAT OVERPROVISIONING (7 seats for 5 person team)', () => {
    const toolInputs: ToolInput[] = [
      { toolId: 'gemini', toolName: 'Gemini', category: 'llm', planId: 'ai-pro', planName: 'AI Pro', monthlySpend: 140, seats: 7 },
    ];

    const engineOutput = generateRecommendations({
      tools: toolInputs,
      teamSize: '1-5',
      useCase: 'mixed',
    });

    const result = computeAuditSummary({
      id: 'test-5',
      date: '2026-05-13',
      teamSize: '1-5',
      useCase: 'Mixed Use',
      toolInputs,
      recommendations: engineOutput.recommendations,
    });

    const seatRec = engineOutput.recommendations.find(r => r.optimizationCategory === 'seat-reduction');
    expect(seatRec).toBeDefined();
    
    // Unit cost is 140 / 7 = 20. 
    // Max seats for '1-5' is 5.
    // Saving should be (7 - 5) * 20 = 40.
    expect(seatRec?.monthlySaving).toBe(40);
    expect(result.summary.monthlySavings).toBe(40);
  });

});
