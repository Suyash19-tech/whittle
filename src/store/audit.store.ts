import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuditResult } from '@/types/audit';
import { computeMonthlySpend, isVariablePricing } from '@/services/audit/pricingCatalog';

/**
 * Audit Store
 *
 * Key design: toolConfigs.monthlySpend is ALWAYS derived from
 * (planPrice × seats) via the pricing catalog. It is never set
 * independently unless the plan uses variable pricing (API tools).
 *
 * This ensures the form, review step, and results page all show
 * the same number — there is no manual spend field to drift.
 */

interface AuditState {
    // Hydration flag — true once Zustand has rehydrated from localStorage
    _hasHydrated: boolean;

    // Form State
    currentStep: number;
    teamSize: string;
    useCase: string;
    selectedTools: string[];
    toolConfigs: Record<
        string,
        {
            plan: string;
            monthlySpend: number;
            seats: number;
        }
    >;
    isLoading: boolean;
    error: string | null;

    // Results State
    auditResults: AuditResult | null;
    previousAudits: AuditResult[];

    // Actions
    setCurrentStep: (step: number) => void;
    setTeamSize: (size: string) => void;
    setUseCase: (useCase: string) => void;
    toggleTool: (toolId: string) => void;
    removeTool: (toolId: string) => void;
    updateToolConfig: (
        toolId: string,
        config: { plan?: string; monthlySpend?: number; seats?: number }
    ) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setAuditResults: (results: AuditResult) => void;
    addToPreviousAudits: (audit: AuditResult) => void;
    resetForm: () => void;
    setHasHydrated: (v: boolean) => void;
}

export const useAuditStore = create<AuditState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                _hasHydrated: false,
                currentStep: 0,
                teamSize: '',
                useCase: '',
                selectedTools: [],
                toolConfigs: {},
                isLoading: false,
                error: null,
                auditResults: null,
                previousAudits: [],

                // Actions
                setCurrentStep: (step) => set({ currentStep: step }),

                setTeamSize: (size) => set({ teamSize: size }),

                setUseCase: (useCase) => set({ useCase }),

                toggleTool: (toolId) =>
                    set((state) => {
                        if (state.selectedTools.includes(toolId)) {
                            // Deselecting — remove from list and configs
                            return {
                                selectedTools: state.selectedTools.filter((id) => id !== toolId),
                                toolConfigs: Object.fromEntries(
                                    Object.entries(state.toolConfigs).filter(([k]) => k !== toolId)
                                ),
                            };
                        }
                        // Selecting — initialize with empty plan, spend auto-syncs on plan select
                        return {
                            selectedTools: [...state.selectedTools, toolId],
                            toolConfigs: {
                                ...state.toolConfigs,
                                [toolId]: { plan: '', monthlySpend: 0, seats: 1 },
                            },
                        };
                    }),

                removeTool: (toolId) =>
                    set((state) => {
                        const newConfigs = { ...state.toolConfigs };
                        delete newConfigs[toolId];
                        return {
                            selectedTools: state.selectedTools.filter((id) => id !== toolId),
                            toolConfigs: newConfigs,
                        };
                    }),

                updateToolConfig: (toolId, config) =>
                    set((state) => {
                        const current = state.toolConfigs[toolId] ?? { plan: '', monthlySpend: 0, seats: 1 };
                        const nextPlan = config.plan ?? current.plan;
                        const nextSeats = config.seats ?? current.seats;

                        // Auto-derive spend from catalog whenever plan or seats change.
                        // Only override if the plan has fixed pricing.
                        // Variable pricing (API tools) keeps whatever the user entered.
                        let nextSpend = config.monthlySpend ?? current.monthlySpend;
                        if (config.plan !== undefined || config.seats !== undefined) {
                            const derived = computeMonthlySpend(toolId, nextPlan, nextSeats);
                            if (derived !== null && !isVariablePricing(toolId, nextPlan)) {
                                nextSpend = derived;
                            }
                        }

                        return {
                            toolConfigs: {
                                ...state.toolConfigs,
                                [toolId]: { plan: nextPlan, monthlySpend: nextSpend, seats: nextSeats },
                            },
                        };
                    }),

                setLoading: (loading) => set({ isLoading: loading }),

                setError: (error) => set({ error }),

                setAuditResults: (results) => set({ auditResults: results }),

                addToPreviousAudits: (audit) =>
                    set((state) => ({
                        previousAudits: [audit, ...state.previousAudits],
                    })),

                resetForm: () =>
                    set({
                        currentStep: 0,
                        teamSize: '',
                        useCase: '',
                        selectedTools: [],
                        toolConfigs: {},
                        error: null,
                    }),

                setHasHydrated: (v) => set({ _hasHydrated: v }),
            }),
            {
                name: 'audit-store',
                partialize: (state) => ({
                    currentStep: state.currentStep,
                    teamSize: state.teamSize,
                    useCase: state.useCase,
                    selectedTools: state.selectedTools,
                    toolConfigs: state.toolConfigs,
                    auditResults: state.auditResults,
                    previousAudits: state.previousAudits,
                }),
                onRehydrateStorage: () => (state) => {
                    // Called once localStorage has been read and merged into the store.
                    // Setting _hasHydrated triggers a re-render in components that
                    // depend on it, so they can now safely read auditResults.
                    state?.setHasHydrated(true);
                },
            }
        )
    )
);
