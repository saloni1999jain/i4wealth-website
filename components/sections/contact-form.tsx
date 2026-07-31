'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/ui/button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/field';
import { EASE } from '@/lib/motion';
import { enquirySchema, INVESTMENT_RANGES, type Enquiry } from '@/lib/validation';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Enquiry form.
 *
 * Validation runs through the same Zod schema the API route uses, so the client
 * can never accept something the server would reject. Errors surface on blur
 * and then live-correct as the field is fixed.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', amount: '', message: '', company: '' },
  });

  async function onSubmit(values: Enquiry) {
    setStatus('submitting');
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Something went wrong.');
      }

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      setServerError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }

  return (
    <div className="surface-card p-8 shadow-lift sm:p-10 lg:p-12">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex min-h-[26rem] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-accent/40 text-accent">
              <Check className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-8 text-display-sm font-light tracking-[-0.025em] text-ink">
              Thank you — your note has reached us.
            </h3>
            <p className="mt-4 max-w-measure-lg text-[1rem] leading-[1.75] text-muted">
              A partner will read it personally and reply within two working days. If it is urgent, say so in
              your note and we will make time sooner.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-8 text-[0.875rem] text-ink underline decoration-accent/50 underline-offset-4 transition-colors duration-300 hover:text-accent"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="space-y-8"
          >
            {/* Honeypot. Hidden from sight and from assistive tech; only bots fill it. */}
            <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
            </div>

            {/* Name and email pair off; the range select then runs full width
                rather than sitting half-empty beside a gap. */}
            <div className="grid gap-8 sm:grid-cols-2">
              <TextField
                label="Full name"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <TextField
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <SelectField
              label="Annual investment"
              options={INVESTMENT_RANGES}
              error={errors.amount?.message}
              {...register('amount')}
            />

            <TextAreaField
              label="Anything you would like us to know"
              rows={4}
              error={errors.message?.message}
              {...register('message')}
            />

            <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Magnetic strength={8}>
                <Button type="submit" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                  {status === 'submitting' ? (
                    <span
                      aria-hidden
                      className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent"
                    />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </Button>
              </Magnetic>

              <p className="max-w-[24ch] text-[0.75rem] leading-relaxed text-muted">
                We reply personally. No newsletters, no follow-up sequences.
              </p>
            </div>

            {serverError ? (
              <p role="alert" className="text-[0.8125rem] text-red-500">
                {serverError}
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
