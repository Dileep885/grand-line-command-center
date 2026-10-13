import { motion } from 'framer-motion';

/** Seamless 1000-unit wave that tiles horizontally. */
const WAVE_D =
  'M0 70 C 125 28 250 112 500 70 C 750 28 875 112 1000 70 V 160 H 0 Z';

function WaveLayer({ duration, opacity, className }) {
  return (
    <div
      className={`absolute bottom-0 left-0 w-[200%] animate-wave ${className || ''}`}
      style={{ animationDuration: `${duration}s` }}
    >
      <svg viewBox="0 0 2000 160" preserveAspectRatio="none" className="h-[130px] w-full sm:h-[170px]">
        <path d={WAVE_D} className={className} opacity={opacity} />
        <g transform="translate(1000,0)">
          <path d={WAVE_D} className={className} opacity={opacity} />
        </g>
      </svg>
    </div>
  );
}

/**
 * Full-screen deep-ocean / night backdrop: gradients, treasure-map grid,
 * drifting glows, layered waves, vignette and grain.
 * Fixed, non-interactive, and shared by every route.
 */
export default function OceanBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-abyss-950"
    >
      {/* base ocean-night gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(1100px 620px at 12% -8%, rgba(11,127,184,0.30), transparent 62%)',
            'radial-gradient(900px 560px at 88% 4%, rgba(230,57,70,0.10), transparent 60%)',
            'radial-gradient(1200px 900px at 50% 115%, rgba(30,167,224,0.16), transparent 66%)',
            'radial-gradient(800px 500px at 70% 60%, rgba(242,181,48,0.07), transparent 70%)',
          ].join(', '),
        }}
      />

      {/* nautical chart grid */}
      <div
        className="absolute inset-0 bg-map-grid bg-[length:54px_54px] opacity-80"
        style={{
          WebkitMaskImage:
            'radial-gradient(circle at 50% 32%, #000 0%, rgba(0,0,0,0.65) 45%, transparent 80%)',
          maskImage:
            'radial-gradient(circle at 50% 32%, #000 0%, rgba(0,0,0,0.65) 45%, transparent 80%)',
        }}
      />

      {/* treasure-map hatching */}
      <div className="map-treasure absolute inset-0 opacity-50" />

      {/* drifting deep-sea glows */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 top-[22%] h-[380px] w-[380px] rounded-full bg-tide-600/25 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 45, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-24 top-[8%] h-[340px] w-[340px] rounded-full bg-ruby-600/15 blur-[130px]"
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[6%] left-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold-600/10 blur-[140px]"
      />

      {/* horizon glow */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-tide-400/25 to-transparent" />

      {/* layered ocean waves */}
      <div className="absolute inset-x-0 bottom-0 h-[180px] overflow-hidden sm:h-[230px]">
        <WaveLayer duration={34} opacity={0.1} className="fill-tide-700" />
        <WaveLayer duration={24} opacity={0.14} className="fill-tide-600" />
        <WaveLayer duration={17} opacity={0.18} className="fill-abyss-700" />
      </div>

      {/* vignette + grain */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 240px 70px rgba(2,5,13,0.95)' }}
      />
      <div className="noise absolute inset-0 opacity-[0.055] mix-blend-overlay" />
    </div>
  );
}
