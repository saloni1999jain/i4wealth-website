import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about the custom type scale.
 *
 * Without this it cannot tell `text-display-lg` (a size) from `text-ink` (a
 * colour), files both under the colour group, and silently drops the size when
 * the two appear together.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-xl', 'display-lg', 'display-md', 'display-sm', 'lede', 'eyebrow'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation — the backbone of every eased follow animation here. */
export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

/** 1234567 → "12,34,567" (Indian digit grouping). */
export function formatInr(value: number) {
  return inrFormatter.format(Math.round(value));
}

/**
 * Compact Indian currency notation: 1,25,00,000 → "₹1.25 Cr".
 * Wealth figures get long fast; the compact form keeps headline numbers legible.
 */
export function formatCompactInr(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)} L`;
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${inrFormatter.format(value)}`;
}
