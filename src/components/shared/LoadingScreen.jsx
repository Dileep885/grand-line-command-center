import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CompassRose from './CompassRose';
import StrawHatMark from './StrawHatMark';

const STEPS = [
  'Contacting Firebase Authentication…',
  'Reading Cloud Firestore…',
  'Charting the Grand Line…',
  'Preparing the command deck…',
];

/** Full-screen boot sequence while the auth state listener resolves. */
export default function LoadingScreen({ message }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-abyss-950"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(11,127,184,0.28), transparent 55%), radial-gradient(circle at 50% 100%, rgba(242,181,48,0.12), transparent 60%)',
        }}
      />
      <div className="noise absolute inset-0 opacity-[0.06]" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative h-44 w-44 sm:h-56 sm:w-56">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-gold-400/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border border-tide-400/25"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-3 w-1.5 -translate-x-1/2 rounded-full bg-ruby-500 shadow-glow-red" />
          </motion.div>
          <CompassRose size={224} className="absolute inset-0 h-full w-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center gap-3"
        >
          <StrawHatMark size={30} className="animate-float" />
          <h1 className="font-display text-2xl font-extrabold tracking-[0.22em] text-gold-gradient sm:text-3xl">
            GRAND LINE
          </h1>
        </motion.div>

        <p className="mt-3 font-techno text-xs uppercase tracking-[0.4em] text-tide-300/80">
          Database Command Center
        </p>

        <div className="mt-7 h-1.5 w-64 overflow-hidden rounded-full border border-white/10 bg-abyss-900 sm:w-80">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-tide-400"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <p className="mt-5 min-h-[1.25rem] font-mono text-[11px] text-slate-400">
          {message || STEPS[step]}
        </p>
      </div>
    </motion.div>
  );
}
