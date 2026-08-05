/**
 * The night sky.
 *
 * Stars are painted as one enormous `box-shadow` on a single 1px element:
 * thousands of points, one DOM node, no canvas and no image request. Twinkle
 * animates the opacity of each *layer* rather than each star, so it costs one
 * composited property no matter how many points there are — and nothing here
 * repaints while scrolling.
 *
 * Positions are generated from a seeded PRNG rather than `Math.random`, so the
 * server and the client produce byte-identical markup and hydration is clean.
 * This is also why the component can stay a server component.
 */

/** mulberry32 — small, fast, and identical on every platform. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Layer = {
  seed: number;
  count: number;
  /** Star diameter in px. */
  size: number;
  /** Peak opacity for the brightest star in the layer. */
  alpha: number;
  /** Twinkle period. Different per layer so the sky never pulses in unison. */
  duration: string;
};

/*
 * Three depths. Far stars are many, tiny and dim; near ones are few, larger
 * and brighter. That distribution is what stops a star field looking like
 * scattered dust.
 */
const LAYERS: Layer[] = [
  { seed: 20000, count: 420, size: 1, alpha: 0.55, duration: '9s' },
  { seed: 31337, count: 160, size: 1.6, alpha: 0.8, duration: '6.5s' },
  { seed: 4242, count: 46, size: 2.4, alpha: 1, duration: '4.5s' },
];

/**
 * Build the shadow list for one layer.
 *
 * Coordinates are in `vw`/`vh` so the field covers any viewport without
 * needing to know its size, and re-flows sensibly on resize.
 */
function shadows({ seed, count, alpha }: Layer) {
  const random = seeded(seed);
  const parts: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const x = (random() * 100).toFixed(2);
    const y = (random() * 100).toFixed(2);
    // Vary brightness within the layer so it does not read as a regular grid.
    const a = (alpha * (0.45 + random() * 0.55)).toFixed(2);
    parts.push(`${x}vw ${y}vh 0 0 rgb(var(--star) / ${a})`);
  }

  return parts.join(', ');
}

export function StarField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      {LAYERS.map((layer) => (
        <div
          key={layer.seed}
          className="star-layer absolute left-0 top-0 rounded-full"
          style={{
            width: layer.size,
            height: layer.size,
            boxShadow: shadows(layer),
            ['--twinkle-duration' as string]: layer.duration,
          }}
        />
      ))}

      {/* One meteor. Its animation is mostly a long wait — see `globals.css`. */}
      <div
        className="meteor absolute left-[12%] top-[8%] h-px w-24 origin-left rounded-full"
        style={{
          background: 'linear-gradient(to right, transparent, rgb(var(--star) / 0.9), transparent)',
        }}
      />
    </div>
  );
}
