import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Anchor, Crosshair } from 'lucide-react';
import CompassRose from '../shared/CompassRose';

const DESTINATIONS = [
  { bearing: 22, name: "Serpent's Wake", depth: '2,140 m' },
  { bearing: 68, name: 'Ember Atoll', depth: '340 m' },
  { bearing: 112, name: 'Coral Graveyard', depth: '980 m' },
  { bearing: 158, name: 'Whispering Shoals', depth: '65 m' },
  { bearing: 204, name: 'Stormbreak Ridge', depth: '1,720 m' },
  { bearing: 249, name: "Dead Man's Vault", depth: '3,010 m' },
  { bearing: 295, name: 'Frostbitten Key', depth: '512 m' },
  { bearing: 341, name: 'The Leviathan Trench', depth: '4,480 m' },
];

const CARDINALS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const cardinalFor = (bearing) => CARDINALS[Math.round(bearing / 22.5) % 16];

/**
 * The central navigation instrument. Clicking it swings the needle to a new
 * bearing and reveals a destination — pure UI theatre on top of real HUD data.
 */
export default function InteractiveCompass({ profile }) {
  const [index, setIndex] = useState(4);
  const destination = DESTINATIONS[index];

  const needle = useMotionValue(destination.bearing);
  const smoothNeedle = useSpring(needle, { stiffness: 70, damping: 14, mass: 0.9 });
  const ringRotation = useTransform(smoothNeedle, (value) => -value * 0.35);

  const spin = () => {
    setIndex((current) => {
      let next = current;
      while (next === current) next = Math.floor(Math.random() * DESTINATIONS.length);
      needle.set(DESTINATIONS[next].bearing);
      return next;
    });
  };

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* orbit rings */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
          className="absolute h-[104%] w-[104%] rounded-full border border-dashed border-gold-400/25"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute h-[116%] w-[116%] rounded-full border border-tide-400/15"
          style={{ borderStyle: 'dotted' }}
        />
        <span className="absolute -top-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold-300 shadow-glow-gold" />
        <span className="absolute -bottom-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-tide-400 shadow-glow-ocean" />
      </div>

      <motion.button
        type="button"
        onClick={spin}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Spin the compass for a new bearing"
        className="group relative block aspect-square w-full rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(11,127,184,0.28), rgba(2,5,13,0.85) 68%)',
          boxShadow:
            '0 0 0 1px rgba(242,181,48,0.35), 0 0 60px rgba(242,181,48,0.16), inset 0 0 70px rgba(2,5,13,0.9)',
        }}
      >
        {/* radar sweep */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 animate-radar bg-radar-conic opacity-30" />
        </span>

        <CompassRose size="100%" className="absolute inset-0 h-full w-full p-[6%]" />

        {/* needle */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{ rotate: smoothNeedle }}
        >
          <span className="absolute left-1/2 top-[14%] h-[36%] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-ruby-500 to-ruby-500/10 shadow-glow-red" />
          <span className="absolute left-1/2 bottom-[14%] h-[26%] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-t from-slate-200 to-slate-200/10" />
        </motion.span>

        {/* rotating outer scale */}
        <motion.span className="pointer-events-none absolute inset-0" style={{ rotate: ringRotation }}>
          <span className="absolute inset-[3%] rounded-full border border-gold-400/20" />
          <span className="absolute left-1/2 top-[3%] h-4 w-px -translate-x-1/2 bg-gold-300/70" />
        </motion.span>

        {/* hub readout */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-400/40 bg-abyss-950/85 backdrop-blur-sm">
          <span className="text-center leading-none">
            <span className="block font-display text-sm font-bold text-gold-gradient sm:text-base">
              {destination.bearing}°
            </span>
            <span className="mt-1 block font-techno text-[8px] uppercase tracking-[0.2em] text-tide-300">
              {cardinalFor(destination.bearing)}
            </span>
          </span>
        </span>
      </motion.button>

      {/* destination readout */}
      <motion.div
        key={destination.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass mx-auto mt-5 flex w-[86%] items-center justify-between gap-3 px-4 py-2.5"
      >
        <span className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-gold-400" />
          <span>
            <span className="block font-techno text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Next bearing
            </span>
            <span className="block font-display text-sm font-bold text-slate-100">
              {destination.name}
            </span>
          </span>
        </span>
        <span className="text-right">
          <span className="block font-techno text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Depth
          </span>
          <span className="block font-mono text-xs text-tide-300">{destination.depth}</span>
        </span>
      </motion.div>

      {/* floating status pods */}
      <div className="pointer-events-none absolute -left-4 top-6 hidden sm:block">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="glass flex items-center gap-2 px-3 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-blink" />
          <span className="font-mono text-[10px] text-slate-300">auth:live</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -right-2 bottom-16 hidden sm:block">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="glass flex items-center gap-2 px-3 py-2"
        >
          <Anchor className="h-3.5 w-3.5 text-tide-300" />
          <span className="font-mono text-[10px] text-slate-300">
            {profile ? 'doc:synced' : 'doc:…'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
