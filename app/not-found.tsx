import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center py-section">
      <div aria-hidden className="grid-field absolute inset-0 opacity-60 mask-fade-y" />

      <div className="container relative">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 max-w-[16ch] text-display-lg font-extralight text-ink">
          This page has gone <span className="font-display italic text-gradient-accent">quiet</span>.
        </h1>
        <p className="mt-7 max-w-measure-lg text-lede font-light text-muted">
          Not everything that disappears is a loss. The rest of the site is where you left it.
        </p>

        <div className="mt-11">
          <Button asChild size="lg">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
