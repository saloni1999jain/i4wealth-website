import { NextResponse } from 'next/server';

import { enquirySchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Naive fixed-window rate limit, keyed by client IP.
 *
 * In-memory and therefore per-instance — enough to blunt casual abuse of a
 * marketing form. Anything serious belongs in an edge middleware or a shared
 * store, which is a deployment decision rather than a code one.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_PER_WINDOW) return false;

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please try again shortly.' },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form and try again.', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // The honeypot was filled, so this is a bot. Answer 200 so it learns nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  /*
   * Delivery is intentionally not wired up here: the right transport (Resend,
   * SES, a CRM webhook) depends on the deployment, and hard-coding one would
   * mean shipping credentials this repository should not hold. Drop the call in
   * below and the rest of the pipeline — validation, rate limiting, spam
   * filtering, client states — already works.
   */
  const { name, email, phone, amount } = parsed.data;
  console.warn('[contact] enquiry received', { name, email, phone, amount });

  return NextResponse.json({ ok: true });
}
