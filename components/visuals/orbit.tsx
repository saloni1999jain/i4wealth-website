'use client';

import { cn } from '@/lib/utils';

const RINGS = [
  { r: 58, duration: 26, dot: true, opacity: 0.3 },
  { r: 92, duration: 44, dot: true, opacity: 0.24 },
  { r: 126, duration: 68, dot: false, opacity: 0.18 },
  { r: 160, duration: 96, dot: true, opacity: 0.13 },
];

/**
 * Concentric orbits, seen from above the plane rather than head-on.
 *
 * The tilt is applied to the `<svg>` element itself, not to groups inside it:
 * CSS 3D transforms and `preserve-3d` apply reliably to the SVG root as a
 * replaced element, but not to its children in every browser. So the whole
 * system leans back as one, the rings project as ellipses, and the dots travel
 * around them in perspective — which is what makes it read as orbits rather
 * than as a dartboard.
 *
 * Depth within the system comes from opacity instead: outer rings fade, so the
 * stack still recedes. Rotation is one composited transform per ring.
 */
export function Orbit({ className }: { className?: string }) {
  return (
    <div className={cn('h-full w-full [perspective:900px]', className)} aria-hidden>
      <svg
        viewBox="-200 -200 400 400"
        className="h-full w-full [transform:rotateX(62deg)_rotateZ(-16deg)]"
        fill="none"
      >
        <defs>
          <radialGradient id="orbit-core">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.85 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <circle r="34" fill="url(#orbit-core)" />
        <circle r="4" className="fill-accent" />

        {RINGS.map((ring) => (
          <g
            key={ring.r}
            className="motion-reduce:[animation:none]"
            style={{
              animation: `orbit-spin ${ring.duration}s linear infinite`,
              transformOrigin: '0px 0px',
            }}
          >
            <circle r={ring.r} stroke="currentColor" strokeWidth="1" strokeOpacity={ring.opacity} />
            {ring.dot ? <circle cx={ring.r} cy="0" r="3.5" className="fill-accent/80" /> : null}
          </g>
        ))}

        {/* Scoped keyframes — the animation only exists where it is used. */}
        <style>{`@keyframes orbit-spin { to { transform: rotate(360deg); } }`}</style>
      </svg>
    </div>
  );
}
