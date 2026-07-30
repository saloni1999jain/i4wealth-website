/**
 * Every line of copy on the site lives here.
 *
 * Keeping it in one typed module means tone can be reviewed as a whole rather
 * than hunted across components, and sections stay purely presentational.
 */

export const site = {
  name: 'I4Wealth',
  tagline: 'Building wealth. Not chasing markets.',
  description:
    'I4Wealth is a boutique wealth management firm practising long-term equity investing in Indian businesses — built on patience, discipline, research and ownership.',
  /** Drives canonical links, the sitemap and social cards. Set per deployment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://i4wealth.in',
  email: 'i4wealth@gmail.com',
  location: 'Mumbai, India',
  founded: 2000,
  /** Minimum annual commitment for the discretionary mandate, in rupees. */
  minimumAnnual: '₹5 lakh a year',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'X', href: 'https://x.com/' },
    { label: 'Substack', href: 'https://substack.com/' },
  ],
} as const;

export const nav = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Compounding', href: '#compounding' },
  { label: 'Process', href: '#process' },
  { label: 'Principles', href: '#principles' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const hero = {
  eyebrow: 'Long-term equity investing · India',
  headline: ['Building Wealth.', 'Not Chasing Markets.'],
  /** Rendered in the display serif inside the headline. */
  accentWord: 'Wealth',
  subheadline:
    'Long-term equity investing designed to create enduring wealth through patience, discipline and research.',
  primaryCta: { label: 'Start Your Investment Journey', href: '#contact' },
  secondaryCta: { label: 'Learn Our Philosophy', href: '#philosophy' },
  marks: [
    { value: 2000, suffix: '', label: 'Practising since' },
    { value: 10, suffix: ' yrs', label: 'Median holding period' },
    { value: 0, suffix: '', label: 'Trades chased' },
  ],
} as const;

export const philosophy = {
  eyebrow: 'Our philosophy',
  title: 'Wealth is not found. It is farmed.',
  lede: 'Six ideas, in order. Each one only works because the one above it came first. Skip a step and the rest quietly stops compounding.',
  steps: [
    {
      id: 'patience',
      title: 'Patience',
      caption: 'The first advantage',
      body: 'Markets transfer money from the impatient to the patient. We do nothing far more often than we do something — and we consider that a position, not a pause.',
    },
    {
      id: 'discipline',
      title: 'Discipline',
      caption: 'Written before it is needed',
      body: 'Our rules are set in calm weather so they survive rough weather. Conviction that only exists in a rising market was never conviction.',
    },
    {
      id: 'research',
      title: 'Research',
      caption: 'Primary, slow, unglamorous',
      body: 'Annual reports, unit economics, capital allocation history, management incumbency. We read the filings other people summarise.',
    },
    {
      id: 'ownership',
      title: 'Ownership',
      caption: 'A share is a share of a business',
      body: 'We buy fractions of enterprises we would be content to own outright for a decade. Price is what we pay attention to once. Business quality, continuously.',
    },
    {
      id: 'compounding',
      title: 'Compounding',
      caption: 'Interrupt it and it restarts',
      body: 'Returns are not the point; uninterrupted returns are. Every unnecessary decision — every exit, every switch, every tax event — costs more than it looks.',
    },
    {
      id: 'generational',
      title: 'Generational Wealth',
      caption: 'The only real deadline',
      body: 'Capital that outlives the person who built it. That horizon changes every decision made before it.',
    },
  ],
} as const;

export const compounding = {
  eyebrow: 'The power of compounding',
  title: 'Time does the heavy lifting.',
  lede: 'Move the inputs. Watch what changes — and what barely does. The single most powerful variable on this page is the one nobody wants to increase.',
  disclaimer:
    'Illustrative only. Assumed returns are not forecasts, and equity returns are neither linear nor guaranteed.',
} as const;

export const comparison = {
  eyebrow: 'Why long-term investing wins',
  title: 'Two games. One scoreboard.',
  lede: 'They look similar from the outside. They are not the same activity, and they do not end in the same place.',
  left: {
    label: 'Trading',
    subtitle: 'Playing the market',
    rows: [
      { title: 'Emotional', body: 'Decisions arrive with adrenaline attached.' },
      { title: 'High activity', body: 'Motion mistaken for progress; costs compound the wrong way.' },
      { title: 'Noise', body: 'Every headline demands an immediate answer.' },
      { title: 'Reaction', body: 'The position is set by the last five minutes.' },
      { title: 'Short-term', body: 'A horizon measured in sessions.' },
    ],
  },
  right: {
    label: 'Long-term investing',
    subtitle: 'Owning the business',
    rows: [
      { title: 'Ownership', body: 'A claim on decades of earnings, not a ticker.' },
      { title: 'Patience', body: 'Inactivity as the default state, held deliberately.' },
      { title: 'Compounding', body: 'Left undisturbed, so it can do what it does.' },
      { title: 'Business focus', body: 'We track the enterprise, not the quote.' },
      { title: 'Wealth', body: 'A horizon measured in decades.' },
    ],
  },
} as const;

export const investmentProcess = {
  eyebrow: 'Our investment process',
  title: 'Six stages. No shortcuts.',
  lede: 'Most ideas die in the first two stages. That is the point of having them.',
  stages: [
    {
      id: 'research',
      index: '01',
      title: 'Research',
      summary: 'Read first. Everything else is downstream.',
      body: 'We start with a decade of annual reports, industry data and the unglamorous filings. An idea earns attention by surviving reading, not by arriving with a story.',
      detail: ['10-year filings', 'Industry structure', 'Primary sources'],
    },
    {
      id: 'business',
      index: '02',
      title: 'Business Analysis',
      summary: 'What makes this durable in ten years?',
      body: 'Unit economics, competitive position, pricing power, reinvestment runway, and the incentives of the people allocating capital. If we cannot explain the moat in one sentence, we do not own it.',
      detail: ['Moat & pricing power', 'Capital allocation', 'Management incentives'],
    },
    {
      id: 'valuation',
      index: '03',
      title: 'Valuation',
      summary: 'Price is the last question, never the first.',
      body: 'We underwrite a range of outcomes rather than a single target. Margin of safety is what remains when we are wrong about the good case — and we assume we will be.',
      detail: ['Scenario ranges', 'Margin of safety', 'Downside first'],
    },
    {
      id: 'construction',
      index: '04',
      title: 'Portfolio Construction',
      summary: 'Concentration where it is earned.',
      body: 'A deliberately small number of holdings, sized by conviction and by what each position could cost us. Diversification past the point of understanding is just expensive ignorance.',
      detail: ['15–20 holdings', 'Conviction weighting', 'Risk-first sizing'],
    },
    {
      id: 'monitoring',
      index: '05',
      title: 'Monitoring',
      summary: 'Track the business, not the price.',
      body: 'Quarterly results, capital allocation decisions, competitive shifts. We revisit the thesis, not the ticker — and we write down what would prove us wrong.',
      detail: ['Thesis review', 'Falsification notes', 'Quarterly cadence'],
    },
    {
      id: 'holding',
      index: '06',
      title: 'Long-term Holding',
      summary: 'The stage that produces the returns.',
      body: 'We sell for three reasons: the thesis broke, the business deteriorated, or something meaningfully better appeared. Boredom is not one of them.',
      detail: ['Three exit reasons', 'Low turnover', 'Tax-aware'],
    },
  ],
} as const;

export const principles = {
  eyebrow: 'Investment principles',
  title: 'What we will not change.',
  lede: 'Written down so they hold when the market makes them inconvenient.',
  cards: [
    {
      number: '01',
      title: 'Invest in businesses, not stocks.',
      body: 'A share certificate is a claim on cash flows produced by people, factories and customers. We underwrite the enterprise and let the quote follow.',
    },
    {
      number: '02',
      title: 'Time in the market beats timing the market.',
      body: 'The largest single-day gains cluster next to the largest declines. Stepping outside to avoid one reliably forfeits the other.',
    },
    {
      number: '03',
      title: 'Patience compounds wealth.',
      body: 'The mathematics rewards duration more than brilliance. Most of the outcome is decided by how long we are willing to be uninteresting.',
    },
    {
      number: '04',
      title: 'Risk comes from not understanding.',
      body: 'Volatility is a price of admission. Permanent loss of capital is the actual risk, and it arrives through businesses we did not understand.',
    },
    {
      number: '05',
      title: 'Quality over quantity.',
      body: 'A handful of exceptional businesses, understood deeply, will outperform a long list held loosely. We would rather know fifteen names completely.',
    },
    {
      number: '06',
      title: 'Preserve first, grow second.',
      body: 'Capital that survives every decade compounds through all of them. The first duty of a portfolio is to still be there.',
    },
  ],
} as const;

export const performance = {
  eyebrow: 'Performance philosophy',
  title: 'We publish our process, not our predictions.',
  lede: 'Past returns make for persuasive marketing and poor evidence. What can be examined honestly is how decisions get made — so that is what we put in writing.',
  pillars: [
    {
      title: 'Process over prediction',
      body: 'We are not paid to know what happens next quarter. We are accountable for the quality of each decision at the moment it was made.',
      stat: { value: 100, suffix: '%', label: 'Decisions documented' },
    },
    {
      title: 'Capital preservation first',
      body: 'Every position is underwritten downside-first. A portfolio that avoids permanent impairment gets to keep compounding through every cycle.',
      stat: { value: 3, suffix: '', label: 'Reasons we ever sell' },
    },
    {
      title: 'Long-term ownership',
      body: 'Low turnover is a consequence of the work, not a target. Holding periods are measured in market cycles rather than quarters.',
      stat: { value: 10, suffix: ' yrs', label: 'Median holding period' },
    },
    {
      title: 'Evidence-based investing',
      body: 'Theses are written before capital is committed, with the conditions that would falsify them stated up front and reviewed on schedule.',
      // Rendered without a unit so it does not read as a duplicate of the
      // holding-period figure sitting next to it in the grid.
      stat: { value: 10, suffix: '', label: 'Years of filings per idea' },
    },
  ],
  note:
    'I4Wealth does not publish indicative or back-tested returns. Historical performance is shared privately, in full context, with prospective clients during onboarding.',
} as const;

export const faq = {
  eyebrow: 'Questions',
  title: 'Answered plainly.',
  items: [
    {
      q: 'How do you invest?',
      a: 'We buy minority ownership in a small number of listed Indian businesses we have researched from primary sources, and we hold them for as long as the thesis holds. Portfolios typically carry fifteen to twenty positions, sized by conviction and by downside. Every position begins with a written thesis and the conditions that would prove it wrong.',
    },
    {
      q: 'Who should invest with I4Wealth?',
      a: 'Investors with a horizon of at least ten years who are comfortable with equity volatility along the way, and who want to understand what they own. If you need the capital within three years, or you want quarterly outperformance, we are a poor fit — and we would rather say so at the first meeting.',
    },
    {
      q: 'Do you trade?',
      a: 'No. We do not trade, take intraday positions, use leverage, or sell tips. Turnover is a by-product of research, never an objective. In most years the majority of the portfolio does not change at all.',
    },
    {
      q: 'How often do portfolios change?',
      a: 'Rarely, and never on the basis of price alone. We sell for three reasons: the original thesis broke, the business deteriorated structurally, or a materially better opportunity emerged. Boredom, headlines and short-term underperformance are not among them.',
    },
    {
      q: 'What is the minimum investment?',
      a: 'Our discretionary mandate begins at ₹5 lakh a year. That threshold exists so that portfolios can be constructed properly and each relationship can be managed personally rather than at scale.',
    },
    {
      q: 'How are you compensated?',
      a: 'A transparent fee on assets managed, disclosed in full before onboarding. We earn nothing from commissions, brokerage, or third-party products, so nothing about our income depends on how often your portfolio changes.',
    },
  ],
} as const;

export const contact = {
  eyebrow: 'Begin',
  title: 'A conversation, before anything else.',
  lede: 'Tell us where you are and what you are building toward. We will reply within two working days — and if we are not the right firm for you, we will say so and point you somewhere better.',
  assurances: [
    'No obligation, no sales call',
    'Your details are never shared',
    'A reply from a partner, not a queue',
  ],
} as const;

export const footer = {
  statement: 'We don’t predict markets. We own exceptional businesses.',
  disclaimer:
    'Investments in securities are subject to market risks. Read all related documents carefully before investing. Past performance is not indicative of future results. Nothing on this website constitutes investment advice or an offer to buy or sell any security.',
  links: {
    Explore: [
      { label: 'Philosophy', href: '#philosophy' },
      { label: 'Compounding', href: '#compounding' },
      { label: 'Process', href: '#process' },
      { label: 'Principles', href: '#principles' },
    ],
    Firm: [
      { label: 'Performance philosophy', href: '#performance' },
      { label: 'Questions', href: '#faq' },
      { label: 'Begin a conversation', href: '#contact' },
    ],
  },
} as const;
