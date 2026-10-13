import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useActivity } from '../../context/ActivityContext';
import { shortId } from '../../utils/format';
import CompassRose from '../shared/CompassRose';

/**
 * Cinematic SET SAIL sequence: the compass plots a course, real connection
 * telemetry streams in, and the database log is stamped UNLOCKED.
 */
export default function SetSailOverlay({ open, onDone }) {
  const { profile, profileId, projectId, authStatus, firestoreStatus } = useAuth();
  const { total } = useActivity();
  const doneRef = useRef(false);

  const lines = [
    `project      ${projectId}`,
    `session      ${authStatus}`,
    `document     ${profileId ? `users/${shortId(profileId, 10, 6)}` : 'users/…'}`,
    `navigator    ${profile?.fullName || '—'}`,
    `logins       ${profile?.loginCount ?? '—'}`,
    `stream       ${firestoreStatus}`,
    `events       ${total} captured this session`,
    'route        charting course → database log',
  ];

  useEffect(() => {
    if (!open) {
      doneRef.current = false;
      return undefined;
    }

    const timers = [
      setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      }, 5200),
    ];

    return () => timers.forEach((id) => clearTimeout(id));
  }, [open, onDone]);

  if (!open) return null;

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[80] overflow-hidden bg-abyss-950/96 backdrop-blur-2xl"
    >
      {/* shockwave rings */}
      {[0, 0.35, 0.7].map((delay) => (
        <motion.span
          key={delay}
          initial={{ scale: 0.1, opacity: 0.7 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/35"
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(11,127,184,0.35), transparent 60%), radial-gradient(circle at 50% 120%, rgba(242,181,48,0.2), transparent 55%)',
        }}
      />

      {/* skip */}
      <button
        type="button"
        onClick={skip}
        className="absolute right-5 top-5 z-10 rounded-lg border border-white/15 px-3.5 py-2 font-techno text-[11px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-gold-400/60 hover:text-gold-200"
      >
        Skip
      </button>

      <div className="relative grid h-full place-items-center px-5">
        <div className="flex w-full max-w-3xl flex-col items-center">
          {/* spinning compass */}
          <div className="relative h-56 w-56 sm:h-72 sm:w-72">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-[3px] border-dashed border-gold-400/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-6 rounded-full border border-tide-400/40"
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <CompassRose size="100%" className="h-full w-full" />
            </motion.div>
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-blink rounded-full bg-ruby-500 shadow-glow-red" />
          </div>

          {/* streaming telemetry */}
          <div className="mt-7 w-full max-w-lg space-y-1.5">
            {lines.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.32, duration: 0.35 }}
                className="flex items-center gap-2.5 overflow-hidden rounded-md border border-white/[0.07] bg-abyss-950/70 px-3 py-1.5"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate font-mono text-[11.5px] text-slate-300">{line}</span>
              </motion.div>
            ))}
          </div>

          {/* unlock stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 2.2, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 3.4, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-center"
          >
            <p className="font-display text-3xl font-black tracking-[0.12em] text-shimmer sm:text-5xl">
              DATABASE LOG UNLOCKED
            </p>
            <p className="mt-2 font-techno text-[11px] uppercase tracking-[0.42em] text-tide-300">
              Full document access granted
            </p>
          </motion.div>

          {/* progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-7 h-1 w-72 max-w-full overflow-hidden rounded-full border border-white/10 bg-abyss-900"
          >
            <motion.span
              className="block h-full bg-gradient-to-r from-gold-500 via-gold-300 to-tide-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      {/* horizontal scan */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-gold-400/10 to-transparent" />
    </motion.div>
  );
}
