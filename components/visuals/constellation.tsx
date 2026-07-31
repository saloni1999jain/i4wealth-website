'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import { clamp, lerp } from '@/lib/utils';

type Node = {
  /** Base position in normalised 0–1 space, so resizing never re-seeds the field. */
  bx: number;
  by: number;
  /** Current drift offset in normalised space. */
  ox: number;
  oy: number;
  /** Drift velocity. */
  vx: number;
  vy: number;
  radius: number;
  /** Per-node phase so the twinkle never looks synchronised. */
  phase: number;
  /** Eased 0–1 proximity to the cursor. */
  glow: number;
};

const LINK_DISTANCE = 0.14; // normalised, relative to the diagonal
const POINTER_RADIUS = 0.18;

/**
 * The hero's generative visual: a constellation whose density follows a
 * compounding curve.
 *
 * Nodes are seeded along `y = 1 - x^2.2` with scatter, so the field is sparse
 * and low on the left and dense and high on the right — growth stated as
 * structure rather than drawn as a chart. Lines appear between nearby nodes and
 * toward the cursor, which is what makes it feel like a network of businesses
 * rather than decoration.
 *
 * Everything is canvas 2D: no WebGL, no Three.js, no shader compilation on the
 * critical path.
 */
export function Constellation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const ctx = context;

    /*
     * The field is drawn in the theme's accent — sunrise orange or sunset pink
     * — read straight off `--accent` so it can never drift from the palette.
     *
     * Light needs the stronger alphas: a warm hue on a pale sky is far lower
     * contrast than the same hue on a deep one.
     */
    let ink = '194, 88, 30';
    let intensity = 1;

    function readTheme() {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      // The custom property is space-separated ("194 88 30"); `rgba()` wants commas.
      if (raw) ink = raw.replace(/\s+/g, ', ');
      intensity = document.documentElement.classList.contains('dark') ? 1.05 : 1.5;
    }

    let width = 0;
    let height = 0;
    let diagonal = 1;
    let nodes: Node[] = [];
    let frame = 0;
    let running = true;

    // Cursor tracked in normalised space; `active` fades the influence in and out.
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, targetActive: 0 };

    /*
     * Link drawing is O(n²), and each surviving pair costs a separate stroke.
     * These counts were higher and were cut back — past roughly fifty nodes the
     * field looks no denser but the frame budget disappears.
     */
    const count = () => {
      const area = window.innerWidth;
      if (area < 640) return 26;
      if (area < 1024) return 38;
      return 52;
    };

    function seed() {
      const total = count();
      nodes = Array.from({ length: total }, (_, index) => {
        const t = index / Math.max(1, total - 1);

        // Two thirds hug the compounding curve; the rest fill the field so the
        // curve reads as emergent rather than plotted.
        const onCurve = index % 3 !== 0;
        const jitterX = (Math.random() - 0.5) * 0.16;
        const jitterY = (Math.random() - 0.5) * (onCurve ? 0.22 : 0.9);

        const curveY = 1 - Math.pow(t, 2.2);

        return {
          bx: clamp(t + jitterX, 0.02, 0.98),
          by: clamp((onCurve ? curveY : 0.5) + jitterY, 0.04, 0.96),
          ox: 0,
          oy: 0,
          vx: (Math.random() - 0.5) * 0.00016,
          vy: (Math.random() - 0.5) * 0.00016,
          radius: 0.6 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          glow: 0,
        };
      });
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      /*
       * Capped at 1.5 rather than 2. This canvas covers the whole viewport, so
       * every extra device pixel is cleared and repainted 60 times a second;
       * on a soft-edged field of dots the difference is invisible and the cost
       * is not.
       */
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = rect.width;
      height = rect.height;
      diagonal = Math.hypot(width, height);

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, width, height);

      pointer.active = lerp(pointer.active, pointer.targetActive, 0.06);
      pointer.x = lerp(pointer.x, pointer.tx, 0.08);
      pointer.y = lerp(pointer.y, pointer.ty, 0.08);

      const linkPx = LINK_DISTANCE * diagonal;
      const pointerPx = POINTER_RADIUS * diagonal;
      const px = pointer.x * width;
      const py = pointer.y * height;

      // Resolve each node's screen position once per frame.
      const screen = nodes.map((node) => {
        if (!reduced) {
          node.ox += node.vx;
          node.oy += node.vy;

          // Soft containment: reverse drift at the edge of the node's allowance.
          if (Math.abs(node.ox) > 0.05) node.vx *= -1;
          if (Math.abs(node.oy) > 0.05) node.vy *= -1;
        }

        const x = (node.bx + node.ox) * width;
        const y = (node.by + node.oy) * height;

        const distance = Math.hypot(x - px, y - py);
        const target = pointer.active * clamp(1 - distance / pointerPx, 0, 1);
        node.glow = lerp(node.glow, target, 0.12);

        return { x, y, node };
      });

      // Links first, so nodes always sit on top of their own connections.
      ctx.lineWidth = 1;
      for (let i = 0; i < screen.length; i += 1) {
        for (let j = i + 1; j < screen.length; j += 1) {
          const a = screen[i];
          const b = screen[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > linkPx) continue;

          const falloff = 1 - distance / linkPx;
          const boost = Math.max(a.node.glow, b.node.glow);
          const alpha = falloff * falloff * (0.13 + boost * 0.5) * intensity;

          ctx.strokeStyle = `rgba(${ink}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Threads reaching toward the cursor.
      if (pointer.active > 0.01) {
        for (const { x, y, node } of screen) {
          if (node.glow < 0.05) continue;
          ctx.strokeStyle = `rgba(${ink}, ${(node.glow * 0.34 * intensity).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      for (const { x, y, node } of screen) {
        const twinkle = reduced ? 1 : 0.72 + Math.sin(time * 0.0009 + node.phase) * 0.28;
        const radius = node.radius * (1 + node.glow * 1.5);
        const alpha = clamp((0.3 + node.glow * 0.7) * twinkle * intensity, 0, 1);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ink}, ${alpha.toFixed(3)})`;
        ctx.fill();

        /*
         * A flat translucent disc stands in for the halo. Building a radial
         * gradient object per node per frame was the single most expensive
         * thing in this loop, and at this size and opacity the two are
         * indistinguishable.
         */
        if (node.glow > 0.15) {
          ctx.beginPath();
          ctx.arc(x, y, radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ink}, ${(node.glow * 0.07 * intensity).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    function loop(time: number) {
      if (!running) return;
      draw(time);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      // Under reduced motion the field is composed once and left alone.
      if (reduced) {
        draw(0);
        return;
      }
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
      pointer.targetActive = 1;
    };

    const onPointerLeave = () => {
      pointer.targetActive = 0;
    };

    // Only animate while the canvas is on screen and the tab is focused.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );

    const onVisibility = () => (document.hidden ? stop() : start());

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        seed();
      }, 180);
    };

    // Repaint when the theme class flips, so the palette swap is immediate even
    // while the field is paused under reduced motion.
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduced) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    readTheme();
    resize();
    seed();
    observer.observe(canvas);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    running = false;
    start();

    return () => {
      stop();
      observer.disconnect();
      themeObserver.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
