import { z } from 'zod';

/**
 * Contact enquiry schema — shared by the client form and the API route so both
 * sides agree on exactly what a valid enquiry is.
 */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'That name looks a little long.'),

  email: z.string().trim().min(1, 'An email address is required.').email('Please enter a valid email address.'),

  phone: z
    .string()
    .trim()
    .min(1, 'A phone number is required.')
    // Permissive on purpose: accepts +91 prefixes, spaces, hyphens and brackets,
    // then checks that 8–15 actual digits remain.
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 8 && digits.length <= 15;
    }, 'Please enter a valid phone number.'),

  amount: z.string().min(1, 'Please choose an indicative range.'),

  message: z
    .string()
    .trim()
    .max(1200, 'Please keep this under 1200 characters.')
    .optional()
    .or(z.literal('')),

  /** Honeypot — real people never see this field, bots fill it in. */
  company: z.string().max(0).optional().or(z.literal('')),
});

export type Enquiry = z.infer<typeof enquirySchema>;

/**
 * Indicative annual commitment bands offered in the enquiry form.
 *
 * The lowest band starts at the mandate minimum of ₹5 lakh a year — a first
 * option above it would turn away enquiries the firm actually accepts.
 */
export const INVESTMENT_RANGES = [
  '₹5L – ₹10L',
  '₹10L – ₹25L',
  '₹25L – ₹50L',
  '₹50L – ₹1 Cr',
  '₹1 Cr +',
  'Still deciding',
] as const;
