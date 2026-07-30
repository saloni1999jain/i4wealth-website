'use client';

import { ArrowUp } from 'lucide-react';

import { Monogram } from '@/components/brand/monogram';
import { Reveal } from '@/components/motion/reveal';
import { TextReveal } from '@/components/motion/text-reveal';
import { footer, site } from '@/content/site';

/**
 * Footer.
 *
 * Opens with the firm's one-line statement of belief at display size, then
 * shrinks to the practical links and the regulatory language it is obliged to
 * carry — which stays legible rather than being hidden at 10px.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-bone">
      <div aria-hidden className="grain absolute inset-0 opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]"
      />

      <div className="container relative pb-12 pt-section-sm">
        <TextReveal
          as="p"
          text={footer.statement}
          className="block max-w-[18ch] text-display-md font-extralight tracking-[-0.03em] text-bone"
          stagger={0.04}
        />

        <div className="mt-20 grid gap-12 border-t border-bone/10 pt-14 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))] lg:gap-16">
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <Monogram className="h-9 w-9 text-bone" />
                <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  I4<span className="font-light text-bone/60">Wealth</span>
                </span>
              </div>

              <p className="mt-6 max-w-measure text-[0.9375rem] leading-[1.75] text-bone/50">
                Long-term equity investing in Indian businesses. Practising since {site.founded} from{' '}
                {site.location}.
              </p>

              <ul className="mt-8 flex flex-wrap gap-3">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-bone/15 px-4 py-2 text-[0.75rem] tracking-[0.06em] text-bone/70 transition-colors duration-500 ease-premium hover:border-gold/50 hover:text-gold"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {Object.entries(footer.links).map(([heading, links], index) => (
            <Reveal key={heading} delay={0.06 * (index + 1)}>
              <nav aria-label={heading}>
                <h2 className="text-[0.6875rem] uppercase tracking-[0.2em] text-bone/40">{heading}</h2>
                <ul className="mt-6 space-y-3.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-[0.9375rem] text-bone/70 transition-colors duration-300 hover:text-gold"
                      >
                        <span
                          aria-hidden
                          className="h-px w-0 bg-gold transition-all duration-500 ease-premium group-hover:w-4"
                        />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 max-w-4xl border-t border-bone/10 pt-10 text-[0.75rem] leading-[1.8] text-bone/35">
          {footer.disclaimer}
        </p>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-[0.75rem] text-bone/40">
            © {year} {site.name}. All rights reserved.
          </p>

          <a
            href="#top"
            className="group inline-flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.16em] text-bone/50 transition-colors duration-300 hover:text-gold"
          >
            Back to top
            <span className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 transition-all duration-500 ease-premium group-hover:border-gold/50 group-hover:-translate-y-0.5">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
