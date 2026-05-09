import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuditResult } from '@/types/audit';

/**
 * Audit Store
 * Manages global state for audit form data and results
 * Persists data to localStorage for session continuity
 */

interface AuditState {
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
}

export const useAuditStore = create<AuditState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
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
                    set((state) => ({
                        selectedTools: state.selectedTools.includes(toolId)
                            ? state.selectedTools.filter((id) => id !== toolId)
                            : [...state.selectedTools, toolId],
                        // Initialize config if adding tool
                        toolConfigs: state.selectedTools.includes(toolId)
                            ? state.toolConfigs
                            : {
                                ...state.toolConfigs,
                                [toolId]: {
                                    plan: '',
                                    monthlySpend: 0,
                                    seats: 1,
                                },
                            },
                    })),

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
                    set((state) => ({
                        toolConfigs: {
                            ...state.toolConfigs,
                            [toolId]: {
                                ...state.toolConfigs[toolId],
                                ...config,
                            },
                        },
                    })),

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
            }
        )
    )
);
