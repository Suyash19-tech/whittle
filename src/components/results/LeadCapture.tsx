'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { saveLeadToSupabase } from '@/lib/supabase/leads';
import { triggerConfirmationEmail } from '@/services/email/client';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  role: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureProps {
  reportId: string;
  teamSize: string;
  estimatedSavings: number;
}

export function LeadCapture({ reportId, teamSize, estimatedSavings }: LeadCaptureProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const success = await saveLeadToSupabase({
      name: data.name,
      email: data.email,
      company: data.company,
      role: data.role,
      team_size: teamSize,
      report_id: reportId,
      estimated_savings: estimatedSavings,
    });

    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      // Non-blocking email trigger
      triggerConfirmationEmail({
        type: 'lead',
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
      <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">Your audit has been saved</h3>
        <p className="text-sm text-slate-600">A copy will be sent to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <Mail className="h-5 w-5" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-slate-900">Get this audit emailed to you</h2>
        <p className="text-sm text-slate-500">
          Save your results and receive a copy for your records.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name *
            </label>
            <input
              {...register('name')}
              id="name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Work Email *
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="jane@company.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Company <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              {...register('company')}
              id="company"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              {...register('role')}
              id="role"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="CTO"
            />
          </div>
        </div>

        {submitError && (
          <p className="text-center text-sm text-red-500">{submitError}</p>
        )}

        <div className="pt-2">
          <GradientButton type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Send my audit'
            )}
          </GradientButton>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          We will never share your information. No spam, ever.
        </p>
      </form>
    </div>
  );
}
