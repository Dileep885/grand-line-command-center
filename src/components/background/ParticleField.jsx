import { useEffect, useRef } from 'react';

const GOLD = '242, 181, 48';
const OCEAN = '56, 189, 248';
const RUBY = '230, 57, 70';

/**
 * Canvas field of floating embers, bubbles and plankton sparks.
 * Purely decorative — it never touches Firebase.
 */
export default function ParticleField({ density = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const makeParticle = (initial = false) => {
      const roll = Math.random();
      const kind =
        roll > 0.86 ? 'spark' : roll > 0.62 ? 'bubble' : roll > 0.08 ? 'ember' : 'current';
      const palette =
        kind === 'bubble' ? OCEAN : kind === 'spark' ? RUBY : kind === 'current' ? OCEAN : GOLD;

      return {
        kind,
        palette,
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + Math.random() * 60,
        radius:
          kind === 'bubble'
            ? 1.4 + Math.random() * 3.4
            : kind === 'spark'
              ? 1 + Math.random() * 1.6
              : 0.7 + Math.random() * 2,
        speed: (kind === 'bubble' ? 0.35 : 0.18) + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.35,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.18 + Math.random() * 0.55,
        wobble: 0.4 + Math.random() * 1.4,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(
        Math.min(120, Math.max(34, (width * height) / 16000)) * density,
      );
      particles = Array.from({ length: count }, () => makeParticle(true));
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      particles.forEach((p) => {
        if (!reduced) {
          p.y -= p.speed;
          p.x += p.drift + Math.sin(time / 1000 + p.phase) * 0.16 * p.wobble;
          if (p.y < -30 || p.x < -40 || p.x > width + 40) {
            Object.assign(p, makeParticle(false));
          }
        }

        const flicker = reduced ? 1 : 0.65 + Math.sin(time / 420 + p.phase) * 0.35;
        const alpha = Math.max(0, p.alpha * flicker);

        if (p.kind === 'bubble') {
          context.strokeStyle = `rgba(${p.palette}, ${alpha * 0.85})`;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          context.stroke();
          context.fillStyle = `rgba(${p.palette}, ${alpha * 0.12})`;
          context.fill();
        } else {
          const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
          gradient.addColorStop(0, `rgba(${p.palette}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${p.palette}, 0)`);
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
          context.fill();
        }
      });

      context.globalCompositeOperation = 'source-over';
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-90"
    />
  );
}
