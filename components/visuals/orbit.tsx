'use client';

import { cn } from '@/lib/utils';

const RINGS = [
  { r: 58, duration: 26, dot: true },
  { r: 92, duration: 44, dot: true },
  { r: 126, duration: 68, dot: false },
  { r: 160, duration: 96, dot: true },
];

/**
 * Concentric orbits — the section's one piece of imagery.
 *
 * It reads as long, patient cycles around a fixed centre, which is the argument
 * the section is making. Rotation is CSS on the group, so each ring costs one
 * composited transform and nothing on the main thread.
 */
export function Orbit({ className }: { className?: string }) {
  return (
    <svg viewBox="-200 -200 400 400" className={cn('h-full w-full', className)} aria-hidden fill="none">
      <defs>
        <radialGradient id="orbit-core">
          <stop offset="0%" stopColor="#C8A45A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C8A45A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle r="34" fill="url(#orbit-core)" />
      <circle r="4" fill="#C8A45A" />

      {RINGS.map((ring) => (
        <g
          key={ring.r}
          className="motion-reduce:[animation:none]"
          style={{
            animation: `orbit-spin ${ring.duration}s linear infinite`,
            transformOrigin: '0px 0px',
          }}
        >
          <circle r={ring.r} stroke="currentColor" strokeWidth="1" strokeOpacity="0.16" />
          {ring.dot ? <circle cx={ring.r} cy="0" r="3" fill="#C8A45A" fillOpacity="0.8" /> : null}
        </g>
      ))}

      {/* Scoped keyframes — the animation only exists where it is used. */}
      <style>{`@keyframes orbit-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
