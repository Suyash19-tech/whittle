'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Container } from '@/components/shared/container';
import { ProgressStepper } from '@/components/audit/progress-stepper';
import { StepContainer } from '@/components/audit/step-container';
import { ToolCard } from '@/components/audit/tool-card';
import { ToolConfigCard } from '@/components/audit/tool-config-card';
import { ReviewCard } from '@/components/audit/review-card';
import { useAuditStore } from '@/store/audit.store';
import { SUPPORTED_AI_TOOLS, TEAM_SIZES, USE_CASES } from '@/constants';
import { cn } from '@/lib/utils';
import { TOOL_ICON_MAP } from '@/components/audit/tool-icons';

const STEPS = ['Team Info', 'Select Tools', 'Configure', 'Review'];

export default function AuditPage() {
    const {
        currentStep,
        teamSize,
        useCase,
        selectedTools,
        toolConfigs,
        setCurrentStep,
        setTeamSize,
        setUseCase,
        toggleTool,
        removeTool,
        updateToolConfig,
    } = useAuditStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 0: return !!(teamSize && useCase);
            case 1: return selectedTools.length > 0;
            case 2: return selectedTools.every(
                (id) => toolConfigs[id]?.plan && toolConfigs[id]?.monthlySpend >= 0
            );
            case 3: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 1800));
        setIsSubmitting(false);
        // TODO: redirect to results
    };

    const totalMonthlySpend = selectedTools.reduce(
        (sum, id) => sum + (toolConfigs[id]?.monthlySpend || 0),
        0
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Container>
                <div className="mx-auto max-w-2xl py-10 sm:py-14">

                    {/* ── Top bar ─────────────────────────────────────── */}
                    <div className="mb-10 flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>

                        <div className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                Whittle
                            </p>
                            <p className="text-sm font-semibold text-slate-900">AI Spend Audit</p>
                        </div>

                        {/* Spend indicator */}
                        {totalMonthlySpend > 0 ? (
                            <div className="rounded-lg bg-sky-50 px-3 py-1.5 text-right">
                                <p className="text-xs text-slate-500">Total spend</p>
                                <p className="text-sm font-bold text-sky-700">
                                    ${totalMonthlySpend.toFixed(0)}/mo
                                </p>
                            </div>
                        ) : (
                            <div className="w-24" />
                        )}
                    </div>

                    {/* ── Progress stepper ────────────────────────────── */}
                    <ProgressStepper steps={STEPS} currentStep={currentStep} />

                    {/* ── Step content ────────────────────────────────── */}

                    {/* Step 1 — Team Info */}
                    <StepContainer
                        title="Tell us about your team"
                        description="We'll use this to tailor your audit recommendations."
                        isActive={currentStep === 0}
                        stepKey={0}
                    >
                        {/* Team Size */}
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Team Size
                            </p>
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                {TEAM_SIZES.map((size) => (
                                    <button
                                        key={size.value}
                                        onClick={() => setTeamSize(size.value)}
                                        className={cn(
                                            'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150',
                                            teamSize === size.value
                                                ? 'border-sky-400 bg-sky-50 text-sky-900 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                        )}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Use Case */}
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Primary Use Case
                            </p>
                            <div className="space-y-2">
                                {USE_CASES.map((uc) => (
                                    <button
                                        key={uc.id}
                                        onClick={() => setUseCase(uc.id)}
                                        className={cn(
                                            'w-full rounded-xl border px-5 py-4 text-left transition-all duration-150',
                                            useCase === uc.id
                                                ? 'border-sky-400 bg-sky-50 shadow-[0_0_0_3px_rgba(14,165,233,0.12)]'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                        )}
                                    >
                                        <p className={cn(
                                            'text-sm font-semibold',
                                            useCase === uc.id ? 'text-sky-900' : 'text-slate-900'
                                        )}>
                                            {uc.label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">{uc.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </StepContainer>

                    {/* Step 2 — Tool Selection */}
                    <StepContainer
                        title="Which AI tools does your team use?"
                        description="Select all that apply. You can configure each one in the next step."
                        isActive={currentStep === 1}
                        stepKey={1}
                    >
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                            {SUPPORTED_AI_TOOLS.map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    id={tool.id}
                                    name={tool.name}
                                    provider={tool.provider}
                                    isSelected={selectedTools.includes(tool.id)}
                                    onClick={() => toggleTool(tool.id)}
                                />
                            ))}
                        </div>

                        {selectedTools.length > 0 && (
                            <p className="text-center text-xs text-slate-400">
                                {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </StepContainer>

                    {/* Step 3 — Configure */}
                    <StepContainer
                        title="Configure your tools"
                        description="Enter the plan, monthly spend, and number of seats for each tool."
                        isActive={currentStep === 2}
                        stepKey={2}
                    >
                        <div className="space-y-3">
                            {selectedTools.map((toolId) => {
                                const tool = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
                                if (!tool) return null;
                                const config = toolConfigs[toolId] || { plan: '', monthlySpend: 0, seats: 1 };

                                return (
                                    <ToolConfigCard
                                        key={toolId}
                                        id={toolId}
                                        name={tool.name}
                                        selectedPlan={config.plan}
                                        monthlySpend={config.monthlySpend}
                                        seats={config.seats}
                                        plans={tool.plans}
                                        onPlanChange={(plan) => updateToolConfig(toolId, { plan })}
                                        onSpendChange={(monthlySpend) => updateToolConfig(toolId, { monthlySpend })}
                                        onSeatsChange={(seats) => updateToolConfig(toolId, { seats })}
                                        onRemove={() => removeTool(toolId)}
                                    />
                                );
                            })}
                        </div>
                    </StepContainer>

                    {/* Step 4 — Review */}
                    <StepContainer
                        title="Review your audit"
                        description="Confirm your details before we generate your personalized report."
                        isActive={currentStep === 3}
                        stepKey={3}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <ReviewCard
                                title="Team"
                                items={[
                                    {
                                        label: 'Team size',
                                        value: TEAM_SIZES.find((s) => s.value === teamSize)?.label ?? '—',
                                    },
                                    {
                                        label: 'Primary use case',
                                        value: USE_CASES.find((u) => u.id === useCase)?.label ?? '—',
                                    },
                                ]}
                            />
                            <ReviewCard
                                title="Spend Summary"
                                items={[
                                    { label: 'Tools selected', value: selectedTools.length },
                                    {
                                        label: 'Monthly spend',
                                        value: `$${totalMonthlySpend.toFixed(2)}`,
                                        highlight: true,
                                    },
                                    {
                                        label: 'Annual spend',
                                        value: `$${(totalMonthlySpend * 12).toFixed(2)}`,
                                    },
                                ]}
                            />
                        </div>

                        {/* Tool list */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                            <div className="border-b border-slate-100 px-6 py-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    Selected Tools
                                </p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {selectedTools.map((toolId) => {
                                    const tool = SUPPORTED_AI_TOOLS.find((t) => t.id === toolId);
                                    const config = toolConfigs[toolId];
                                    if (!tool) return null;
                                    const Icon = TOOL_ICON_MAP[toolId];
                                    const planLabel = tool.plans.find((p) => p.id === config?.plan)?.name ?? config?.plan;

                                    return (
                                        <div key={toolId} className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600">
                                                    {Icon ? <Icon className="h-4 w-4" /> : (
                                                        <span className="text-xs font-bold">{tool.name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {planLabel} · {config?.seats} seat{config?.seats !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">
                                                ${(config?.monthlySpend ?? 0).toFixed(2)}
                                                <span className="ml-0.5 text-xs font-normal text-slate-400">/mo</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </StepContainer>

                    {/* ── Navigation ──────────────────────────────────── */}
                    <motion.div
                        className="mt-10 flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </button>

                        {currentStep < STEPS.length - 1 ? (
                            <GradientButton onClick={handleNext} disabled={!canProceed()}>
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </GradientButton>
                        ) : (
                            <GradientButton onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating…
                                    </>
                                ) : (
                                    <>
                                        Generate Audit
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </GradientButton>
                        )}
                    </motion.div>

                    {/* Step hint */}
                    <p className="mt-5 text-center text-xs text-slate-400">
                        Step {currentStep + 1} of {STEPS.length}
                    </p>

                </div>
            </Container>
        </main>
    );
}
