// Barrel export for the rules engine.
// Import from '@/services/audit/rules' instead of individual files.
export { generateRecommendations } from './engine';
export type { EngineInput, EngineOutput } from './engine';
export type { ToolInput, RuleContext, RuleOutput, RuleFn, InsightRuleFn } from './types';
