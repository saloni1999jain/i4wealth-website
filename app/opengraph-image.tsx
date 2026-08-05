import { ImageResponse } from 'next/og';

import { site } from '@/content/site';

export const alt = `${site.name} — Markets fluctuate. Wealth compounds.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Social card, generated at build time.
 *
 * Kept to type, a rule and the mark — the same restraint as the site, and it
 * survives being scaled down to a thumbnail in a chat client.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0F2A',
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* The sunset sky, mirroring the dark theme. A social card cannot follow
            the viewer's theme, so it commits to one — the darker of the two
            reads better as a thumbnail against most chat backgrounds. */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,108,160,0.34) 0%, rgba(236,108,160,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="46" height="46" viewBox="0 0 40 40" fill="none">
            <path d="M8 30V10" stroke="#F4F7FC" strokeWidth="1.8" strokeLinecap="round" />
            <path
              d="M8 30C14.5 30 19 26.5 22.5 20.5C26 14.5 28.5 11 33 10"
              stroke="#F4F7FC"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="33" cy="10" r="2.8" fill="#F298BC" />
          </svg>
          <div style={{ color: '#F4F7FC', fontSize: 26, letterSpacing: 4 }}>I4WEALTH</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#F4F7FC',
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Markets fluctuate.</span>
            <span style={{ color: '#F0A8B8' }}>Wealth compounds.</span>
          </div>

          <div style={{ display: 'flex', width: 120, height: 2, background: '#F298BC', marginTop: 44 }} />

          <div style={{ color: 'rgba(244,247,252,0.58)', fontSize: 27, marginTop: 32, maxWidth: 880 }}>
            Long-term equity investing built on patience, discipline and research.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
