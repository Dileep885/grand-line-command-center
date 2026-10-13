import { useId } from 'react';

/**
 * Original straw-hat mark used as the app logo.
 * Drawn from scratch — not traced from any official artwork.
 * Gradient ids are unique per instance so multiple copies never collide
 * (a `display:none` copy would otherwise break the visible one).
 */
export default function StrawHatMark({ size = 34, className = '' }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const straw = `hat-straw-${uid}`;
  const brim = `hat-brim-${uid}`;
  const band = `hat-band-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Straw hat mark"
    >
      <defs>
        <linearGradient id={straw} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe38a" />
          <stop offset="100%" stopColor="#e0a531" />
        </linearGradient>
        <linearGradient id={brim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd45e" />
          <stop offset="100%" stopColor="#c98a1c" />
        </linearGradient>
        <linearGradient id={band} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#c11f2d" />
        </linearGradient>
      </defs>

      {/* brim */}
      <ellipse cx="32" cy="44" rx="27" ry="8.5" fill={`url(#${brim})`} />
      <ellipse cx="32" cy="43" rx="27" ry="8.5" fill={`url(#${straw})`} />

      {/* crown */}
      <path
        d="M14.5 43C14.5 29.5 21.8 20 32 20s17.5 9.5 17.5 23c-4.6 3.1-10.6 4.7-17.5 4.7S19.1 46.1 14.5 43Z"
        fill={`url(#${straw})`}
      />

      {/* crown highlight */}
      <path
        d="M24 24.5c-3.4 3.4-5.4 8.4-5.7 14.4 1.9.9 4 1.5 6.2 1.8-.4-5.6.8-11 3.5-15.4-1.3-.4-2.6-.6-4-.8Z"
        fill="#fff3c4"
        opacity="0.55"
      />

      {/* band */}
      <path
        d="M14.9 39.4c6.4 3.5 14 5.3 17.1 5.3s10.7-1.8 17.1-5.3c.4 1.4.6 2.8.7 4.2-6.4 3.5-14 5.3-17.8 5.3s-11.4-1.8-17.8-5.3c.1-1.4.3-2.8.7-4.2Z"
        fill={`url(#${band})`}
      />

      {/* weave lines */}
      <path
        d="M22 31.5c6.4-1.4 13.6-1.4 20 0M19.5 36c8.3-1.7 16.7-1.7 25 0"
        stroke="#a8781a"
        strokeWidth="0.9"
        opacity="0.5"
        fill="none"
      />

      {/* stitch detail on brim */}
      <ellipse
        cx="32"
        cy="43"
        rx="23"
        ry="6.4"
        fill="none"
        stroke="#8a5c12"
        strokeWidth="0.9"
        strokeDasharray="2.6 3.4"
        opacity="0.6"
      />
    </svg>
  );
}
