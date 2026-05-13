'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, Calendar } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { saveConsultationToSupabase } from '@/lib/supabase/consultations';
import { triggerConfirmationEmail } from '@/services/email/client';

// ─── Threshold ────────────────────────────────────────────────────────────────
const SAVINGS_THRESHOLD = 100;

const consultationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  preferredTime: z.string().min(2, 'Preferred time is required'),
  challenge: z.string().min(5, 'Please describe your challenge'),
  website: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ConsultationCTAProps {
  reportId: string;
  monthlySavings: number;
  estimatedSavings: number;
}

export function ConsultationCTA({
  reportId,
  monthlySavings,
  estimatedSavings,
}: ConsultationCTAProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  // Gate: only render when savings meet the threshold
  if (monthlySavings < SAVINGS_THRESHOLD) return null;

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Honeypot check
    if (data.website?.trim()) {
      // Silently fail for bots
      console.log('Spam detected via honeypot');
      setIsSubmitting(false);
      setIsSuccess(true);
      return;
    }

    const success = await saveConsultationToSupabase({
      name: data.name,
      email: data.email,
      preferred_time: data.preferredTime,
      challenge: data.challenge,
      estimated_savings: estimatedSavings,
      report_id: reportId,
    });

    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      // Non-blocking email trigger
      triggerConfirmationEmail({
        type: 'consultation',
        email: data.email,
        name: data.name,
        savings: estimatedSavings,
      });
    } else {
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Your consultation request has been received
        </h3>
        <p className="text-sm text-slate-600">
          A Credex specialist will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-teal-50 text-sky-600">
            <Calendar className="h-5 w-5" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            Need help implementing these optimizations?
          </h2>
          <p className="mx-auto max-w-md text-sm text-slate-500">
            Credex specialists can help consolidate tooling, optimize licensing,
            and reduce unnecessary AI spend across your organization.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            {...register('website')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="consult-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Name *
              </label>
              <input
                {...register('name')}
                id="consult-name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="consult-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Work Email *
              </label>
              <input
                {...register('email')}
                id="consult-email"
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                placeholder="jane@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="consult-time"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Preferred Consultation Time *
            </label>
            <input
              {...register('preferredTime')}
              id="consult-time"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="e.g. Weekday mornings, Tue/Thu afternoons"
            />
            {errors.preferredTime && (
              <p className="mt-1 text-xs text-red-500">{errors.preferredTime.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="consult-challenge"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Biggest AI Spend Challenge *
            </label>
            <textarea
              {...register('challenge')}
              id="consult-challenge"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="e.g. We have overlapping subscriptions across multiple teams…"
            />
            {errors.challenge && (
              <p className="mt-1 text-xs text-red-500">{errors.challenge.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-center text-sm text-red-500">{submitError}</p>
          )}

          <div className="pt-2">
            <GradientButton
              type="submit"
              disabled={isSubmitting}
              variant="secondary"
              className="w-full justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Book a Free Consultation'
              )}
            </GradientButton>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            No obligation · 30-minute call · We never share your data.
          </p>
        </form>
      </div>
    </div>
  );
}
