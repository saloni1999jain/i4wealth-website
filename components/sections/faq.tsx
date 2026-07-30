'use client';

import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faq, site } from '@/content/site';

/**
 * Section 7 — questions.
 *
 * A single-open accordion: the answers are long enough that allowing several at
 * once would turn the section into a wall. The header stays alongside on large
 * screens so the list has something to sit against.
 */
export function Faq() {
  return (
    <Section id="faq">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow">{faq.eyebrow}</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="text-display-md font-light text-ink">{faq.title}</h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 max-w-measure text-[1rem] leading-[1.75] text-muted">
                Something not covered here?{' '}
                <a
                  href="#contact"
                  className="text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-300 hover:text-gold"
                >
                  Write to us
                </a>{' '}
                — or email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink underline decoration-gold/50 underline-offset-4 transition-colors duration-300 hover:text-gold"
                >
                  {site.email}
                </a>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
              {faq.items.map((item, index) => (
                <AccordionItem key={item.q} value={`item-${index}`}>
                  <AccordionTrigger>
                    <span className="flex gap-5">
                      <span className="tabular mt-1.5 text-[0.6875rem] tracking-[0.2em] text-gold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-light">{item.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-[3.4rem]">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
