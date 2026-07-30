# I4Wealth

Marketing site for I4Wealth — a boutique wealth management firm practising
long-term equity investing in Indian businesses.

The brief was a site that feels like the firm it represents: calm, confident and
unhurried. Every design decision here is downstream of that. There are no stock
photographs, no coins, no rising arrows and no performance claims — the visual
interest comes from typography, generous space, and two generative canvases.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, TypeScript strict) |
| Styling | Tailwind CSS 3 with a token-based design system |
| Animation | Framer Motion, Lenis smooth scroll, canvas 2D |
| Forms | React Hook Form + Zod (one schema, shared client and server) |
| Primitives | Radix UI, shadcn-style local components |
| Icons | Lucide |

No Three.js and no GSAP: the hero field is ~180 lines of canvas 2D, and every
other effect is a transform or an opacity. Adding either library would have cost
40–90 KB for motion the page already achieves.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

## Structure

```
app/
  layout.tsx           Fonts, metadata, JSON-LD, providers, chrome
  page.tsx             Section order — the argument the page makes
  api/contact/route.ts Enquiry endpoint (validation, rate limit, honeypot)
  opengraph-image.tsx  Social card, generated at build time
components/
  brand/               The monogram
  experience/          Preloader, smooth scroll, cursor, theme, scroll progress
  layout/              Header, footer, section chrome
  motion/              Reveal, TextReveal, AnimatedNumber, Magnetic, Parallax
  sections/            One file per section of the page
  ui/                  Button, accordion, slider, form fields
  visuals/             Constellation canvas, ambient gradients, orbit
content/site.ts        Every line of copy on the site
lib/                   Compounding maths, validation, class utilities
hooks/                 Media query, mount state
```

Two conventions worth knowing:

- **All copy lives in `content/site.ts`.** Sections are purely presentational,
  so tone can be reviewed as a whole rather than hunted across components.
- **All motion timing lives in `lib/motion.ts`.** `EASE` there is the same curve
  as `ease-premium` in the Tailwind config, so CSS and JS transitions match.

## Design system

Semantic colours are CSS custom properties (`app/globals.css`) consumed through
Tailwind as `rgb(var(--token) / <alpha-value>)`, so `bg-surface` and
`text-ink/60` resolve correctly in both themes without `dark:` variants
scattered through the markup.

Brand constants — `navy`, `bone`, `gold` — are fixed values and never shift with
the theme.

> **Note:** `lib/utils.ts` extends `tailwind-merge` with the custom type scale.
> Without that, `tailwind-merge` cannot tell `text-display-lg` (a size) from
> `text-ink` (a colour), files both under the colour group, and silently drops
> the size wherever the two appear together.

## Animation architecture

Four primitives cover the whole site:

- `<Reveal>` / `<RevealGroup>` — scroll-triggered entrances, one easing, one
  viewport rule.
- `<TextReveal>` — per-word mask reveal. Also renders the full string in a
  visually-hidden node, so assistive tech reads one sentence rather than a pile
  of spans.
- `<AnimatedNumber>` — count-up that announces its destination value rather than
  every intermediate frame.
- `<Magnetic>` / `<Parallax>` — pointer and scroll response, both transform-only.

Everything checks `useReducedMotion()`. Under that preference the preloader is
skipped, Lenis never initialises, the custom cursor does not render, the
constellation paints a single static frame, and `globals.css` neutralises
animation and transition durations globally.

## Performance notes

- ~214 KB first-load JS for the route; all client work sits behind interaction
  or scroll.
- The constellation caps DPR at 2, pauses via `IntersectionObserver` when
  off-screen and on `visibilitychange`, and re-seeds on a debounced resize.
- Custom cursor and ambient gradient are gated behind
  `(hover: hover) and (pointer: fine)` — they never put work on touch devices.
- The compounding chart samples a fixed 48 points regardless of horizon, so the
  SVG path morphs smoothly instead of being rebuilt each time.
- Fonts are self-hosted through `next/font` with `display: swap`. The grain and
  the architectural grid are inline SVG and gradients — zero image requests.

## Accessibility

Skip link; visible focus ring, with a deliberate exception where a field already
provides a stronger indicator; every interactive element is a real button or
link; the mobile menu handles Escape and locks scroll; decorative canvases and
diagrams are `aria-hidden`; the compounding chart carries an `aria-label`
describing the projection in words; the process disclosure works on hover, click
and keyboard alike.

## The contact endpoint

`app/api/contact/route.ts` validates with the shared Zod schema, applies a
per-IP fixed-window rate limit, and silently accepts honeypot submissions so
bots learn nothing.

**Delivery is intentionally not wired up.** The right transport (Resend, SES, a
CRM webhook) is a deployment decision, and hard-coding one would mean shipping
credentials this repository should not hold. Drop the call in where the route
logs today — validation, rate limiting, spam filtering and every client state
already work around it.

## Deployment

Deploys to Vercel with no configuration. Set `NEXT_PUBLIC_SITE_URL` (see
`.env.example`) so canonical URLs, the sitemap and social cards resolve against
the real domain.

## Content

Firm particulars live in `content/site.ts`. Confirmed and in place:

- Practising since **2000**
- Median holding period **10 years**
- Email **i4wealth@gmail.com**
- Mandate minimum **₹5 lakh a year**

Still outstanding. Fabricating any of these would be worse than leaving them
empty, so they are empty:

- **`site.phone` is deliberately blank.** The contact row and the `telephone`
  field in the structured data both skip it while empty, so nothing false is
  published. Set it and both reappear with no other change.
- **`site.socials`** point at the bare linkedin.com / x.com / substack.com
  homepages. Replace them with the firm's real profiles, or delete the entries.
- **`site.location`** reads "Mumbai, India", which is also hard-coded in the
  JSON-LD `address` block in `app/layout.tsx`.

The compounding projection is explicitly labelled illustrative and makes no
forecast, and the site publishes no historical returns.
