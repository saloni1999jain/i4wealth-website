'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { TextReveal } from '@/components/motion/text-reveal';
import { ContactForm } from '@/components/sections/contact-form';
import { AmbientGradient } from '@/components/visuals/ambient';
import { contact, site } from '@/content/site';

const DETAILS = [
  { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  { icon: MapPin, label: site.location, href: null },
];

/**
 * Contact.
 *
 * The last full section, and the only one that asks for anything — so it gets
 * the largest type on the page after the hero and nothing else competing for
 * attention.
 */
export function Contact() {
  return (
    <Section id="contact" tone="raised" className="overflow-hidden">
      <AmbientGradient className="opacity-60" />

      <div className="container relative">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow">{contact.eyebrow}</span>
              </div>
            </Reveal>

            <TextReveal
              as="h2"
              text={contact.title}
              className="block max-w-[16ch] text-display-lg font-extralight tracking-[-0.035em] text-ink"
              stagger={0.045}
            />

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-measure-lg text-lede font-light text-muted text-pretty">
                {contact.lede}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-12 space-y-5">
                {DETAILS.map(({ icon: Icon, label, href }) => {
                  const content = (
                    <>
                      <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                      <span>{label}</span>
                    </>
                  );

                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="group inline-flex items-center gap-4 text-[1.0625rem] text-ink transition-colors duration-300 hover:text-gold"
                        >
                          {content}
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-4 text-[1.0625rem] text-muted">
                          {content}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.26}>
              <ul className="mt-12 space-y-3 border-t border-line pt-8">
                {contact.assurances.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[0.875rem] text-muted">
                    <span aria-hidden className="h-px w-4 bg-gold/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} direction="left">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
