import { useId } from 'react';

/**
 * Original wind-rose compass artwork (no copyrighted assets).
 * Purely presentational — rotation is controlled by the parent.
 * All paint-server ids are scoped per instance to avoid cross-SVG collisions.
 */
export default function CompassRose({
  size = 320,
  className = '',
  showLetters = true,
  showTicks = true,
  tone = 'gold',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name) => `${name}-${uid}`;

  const strokes = {
    gold: { line: 'rgba(242,181,48,0.65)', soft: 'rgba(242,181,48,0.22)', text: '#ffd15c' },
    ocean: { line: 'rgba(56,189,248,0.65)', soft: 'rgba(56,189,248,0.22)', text: '#7dd3fc' },
  }[tone] || { line: 'rgba(242,181,48,0.65)', soft: 'rgba(242,181,48,0.22)', text: '#ffd15c' };

  const ticks = Array.from({ length: 48 }, (_, i) => i);
  const longAngles = [0, 90, 180, 270];
  const shortAngles = [45, 135, 225, 315];

  const point = (angle, length, halfWidth, side) => {
    const tipY = -length;
    const baseY = -8;
    const d =
      side === 'right'
        ? `M0 ${tipY} L ${halfWidth} ${baseY} L 0 ${baseY} Z`
        : `M0 ${tipY} L ${-halfWidth} ${baseY} L 0 ${baseY} Z`;
    return <path key={`${angle}-${side}`} d={d} transform={`rotate(${angle})`} />;
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Compass rose"
    >
      <defs>
        <radialGradient id={id('core')} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="rgba(255,241,204,0.30)" />
          <stop offset="60%" stopColor="rgba(242,181,48,0.07)" />
          <stop offset="100%" stopColor="rgba(2,5,13,0.0)" />
        </radialGradient>
        <linearGradient id={id('light')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3cd" />
          <stop offset="100%" stopColor="#f2b530" />
        </linearGradient>
        <linearGradient id={id('dark')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c98a1c" />
          <stop offset="100%" stopColor="#7c5012" />
        </linearGradient>
        <linearGradient id={id('blueLight')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <filter id={id('glow')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="100" cy="100" r="96" fill={`url(#${id('core')})`} />

      {/* outer rings */}
      <circle cx="100" cy="100" r="95" fill="none" stroke={strokes.line} strokeWidth="1.2" />
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke={strokes.soft}
        strokeWidth="6"
        strokeDasharray="1.5 7"
      />
      <circle cx="100" cy="100" r="79" fill="none" stroke={strokes.line} strokeWidth="0.7" />

      {/* degree ticks */}
      {showTicks &&
        ticks.map((i) => {
          const major = i % 4 === 0;
          const angle = i * 7.5;
          return (
            <line
              key={i}
              x1="100"
              y1={major ? 15 : 18}
              x2="100"
              y2={major ? 24 : 22}
              stroke={major ? strokes.line : strokes.soft}
              strokeWidth={major ? 1.4 : 0.8}
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

      {/* cardinal letters */}
      {showLetters &&
        [
          { label: 'N', x: 100, y: 36 },
          { label: 'E', x: 164, y: 105 },
          { label: 'S', x: 100, y: 174 },
          { label: 'W', x: 36, y: 105 },
        ].map((item) => (
          <text
            key={item.label}
            x={item.x}
            y={item.y}
            textAnchor="middle"
            fontSize={item.label === 'N' ? 17 : 13}
            fontFamily="Cinzel, serif"
            fontWeight="700"
            fill={item.label === 'N' ? '#ff8a8a' : strokes.text}
            stroke="rgba(2,5,13,0.65)"
            strokeWidth="2"
            paintOrder="stroke"
          >
            {item.label}
          </text>
        ))}

      {/* wind rose — long cardinal points, short intercardinal points */}
      <g filter={`url(#${id('glow')})`} opacity="0.96">
        <g transform="translate(100,100)">
          {longAngles.map((angle) => [
            <g key={`long-${angle}`} fill={`url(#${id('light')})`}>
              {point(angle, 74, 11, 'right')}
            </g>,
            <g key={`long-d-${angle}`} fill={`url(#${id('dark')})`}>
              {point(angle, 74, 11, 'left')}
            </g>,
          ])}
          {shortAngles.map((angle) => [
            <g key={`short-${angle}`} fill={`url(#${id('blueLight')})`} opacity="0.92">
              {point(angle, 48, 9, 'right')}
            </g>,
            <g key={`short-d-${angle}`} fill="#0a5f8c" opacity="0.9">
              {point(angle, 48, 9, 'left')}
            </g>,
          ])}
        </g>
      </g>

      {/* hub */}
      <circle cx="100" cy="100" r="13" fill="#050b18" stroke={strokes.line} strokeWidth="1.4" />
      <circle cx="100" cy="100" r="6" fill={strokes.text} opacity="0.9" />
      <circle
        cx="100"
        cy="100"
        r="22"
        fill="none"
        stroke={strokes.soft}
        strokeWidth="1"
        strokeDasharray="3 5"
      />
    </svg>
  );
}
