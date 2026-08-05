import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Manrope } from 'next/font/google';

import { Cursor } from '@/components/experience/cursor';
import { LoadingProvider } from '@/components/experience/loading-provider';
import { Preloader } from '@/components/experience/preloader';
import { ScrollProgress } from '@/components/experience/scroll-progress';
import { ThemeProvider } from '@/components/experience/theme-provider';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { site } from '@/content/site';

import './globals.css';

/** Body and UI. Variable weights let headings run at 200 without a second file. */
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700'],
});

/** Used for one italic word in the hero and nothing else. */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: '400',
  style: ['italic', 'normal'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Markets fluctuate. Wealth compounds.`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'long-term investing',
    'Indian equities',
    'portfolio management',
    'wealth management India',
    'capital preservation',
    'equity investing',
    'boutique wealth manager',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Markets fluctuate. Wealth compounds.`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Markets fluctuate. Wealth compounds.`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'finance',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F7FC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F2A' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
};

/**
 * Structured data. Describes the firm rather than the page, and deliberately
 * makes no performance claims.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  foundingDate: String(site.founded),
  areaServed: 'IN',
  address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
  slogan: site.tagline,
  knowsAbout: ['Long-term equity investing', 'Portfolio management', 'Capital preservation'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${manrope.variable} ${instrumentSerif.variable}`}
      // next-themes writes the theme class onto <html> before paint.
      suppressHydrationWarning
    >
      <body>
        {/*
          Scroll-reveal safety net.

          Framer Motion serialises each element's `initial` variant into the
          HTML, so without scripting those elements would sit at `opacity: 0`
          forever. The copy is still in the markup — crawlers and readers see it
          — but a person with JS disabled would face a blank page. This restores
          it, and costs nothing for everyone else.
        */}
        {/* `dangerouslySetInnerHTML` is required here: browsers with scripting
            enabled keep <noscript> contents as raw text, so React would fail to
            hydrate a <style> element rendered inside it as JSX. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important;filter:none!important}</style>',
          }}
        />

        {/*
          The weather, in three fixed layers: gradient, sun, cloud. All are
          un-animated, so they composite once and cost nothing while scrolling.
          Negative z-index puts them above the body's background colour but
          behind every piece of content.
        */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="sky-field absolute inset-0" />
          <div className="cloud-field absolute inset-0" />
          <div className="sun-field absolute inset-0" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-bg"
            >
              Skip to content
            </a>

            <Preloader />
            <ScrollProgress />
            <Cursor />

            <Header />
            {/* `relative` gives scroll-linked sections a positioned
                offsetParent, which is what Framer measures against. */}
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
          </LoadingProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          // Serialised from a local literal — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
