import { ImageResponse } from 'next/og';

import { site } from '@/content/site';

export const alt = `${site.name} — Building Wealth. Not Chasing Markets.`;
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
          background: '#071B35',
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Ambient gold wash, mirroring the site's hero lighting. */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,164,90,0.30) 0%, rgba(200,164,90,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="46" height="46" viewBox="0 0 40 40" fill="none">
            <path d="M8 30V10" stroke="#F8F8F5" strokeWidth="1.8" strokeLinecap="round" />
            <path
              d="M8 30C14.5 30 19 26.5 22.5 20.5C26 14.5 28.5 11 33 10"
              stroke="#F8F8F5"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="33" cy="10" r="2.8" fill="#C8A45A" />
          </svg>
          <div style={{ color: '#F8F8F5', fontSize: 26, letterSpacing: 4 }}>I4WEALTH</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#F8F8F5',
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: -3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Building Wealth.</span>
            <span style={{ color: '#C8A45A' }}>Not Chasing Markets.</span>
          </div>

          <div style={{ display: 'flex', width: 120, height: 2, background: '#C8A45A', marginTop: 44 }} />

          <div style={{ color: 'rgba(248,248,245,0.55)', fontSize: 27, marginTop: 32, maxWidth: 880 }}>
            Long-term equity investing built on patience, discipline and research.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
