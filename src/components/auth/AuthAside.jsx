import { motion } from 'framer-motion';
import { Database, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import CompassRose from '../shared/CompassRose';
import StrawHatMark from '../shared/StrawHatMark';

const FEATURES = [
  { icon: ShieldCheck, title: 'Firebase Authentication', text: 'Email, password & Google sign-in' },
  { icon: Database, title: 'Cloud Firestore', text: 'A live document for every navigator' },
  { icon: Radio, title: 'Real-time listeners', text: 'The dashboard streams from onSnapshot' },
  { icon: Sparkles, title: 'Anime command deck', text: 'Cinematic motion, glassmorphic HUD' },
];

/** Left-hand "voyage" panel — decorative, but reports real connection state. */
export default function AuthAside() {
  const { projectId, authStatus, firestoreStatus, isConfigured } = useAuth();

  return (
    <aside className="relative hidden overflow-hidden border-r border-white/[0.07] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* nautical route with animated dashed course line */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="chart-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(242,181,48,0.13)" />
          </pattern>
        </defs>
        <rect width="600" height="900" fill="url(#chart-dots)" />
        <motion.path
          d="M150 640 C 250 600 220 515 305 495 C 405 475 385 345 520 315"
          fill="none"
          stroke="rgba(242,181,48,0.55)"
          strokeWidth="2.5"
          strokeDasharray="10 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
        <g stroke="rgba(230,57,70,0.85)" strokeWidth="4" strokeLinecap="round">
          <path d="M136 626 L164 654 M164 626 L136 654" />
          <path d="M506 301 L534 329 M534 301 L506 329" />
        </g>
        <circle cx="150" cy="640" r="7" fill="rgba(56,189,248,0.85)" />
        <circle cx="520" cy="315" r="7" fill="rgba(242,181,48,0.9)" />
      </svg>

      <div className="relative">
        <div className="flex items-center gap-3">
          <StrawHatMark size={40} />
          <div>
            <p className="font-display text-lg font-bold tracking-[0.24em] text-gold-gradient">
              GRAND LINE
            </p>
            <p className="font-techno text-[11px] uppercase tracking-[0.34em] text-tide-300/80">
              Database Command Center
            </p>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-14 max-w-md font-display text-4xl font-extrabold leading-[1.12] text-shimmer xl:text-5xl"
        >
          SAIL THE
          <br />
          GRAND LINE
          <br />
          <span className="text-ocean-gradient">OF DATA</span>
        </motion.h2>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
          One real Firebase project. One live Firestore document. Every panel you are about to see
          is driven by the signed-in session — nothing on this deck is scripted.
        </p>

        <ul className="mt-9 grid gap-3">
          {FEATURES.map((feature, index) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.09 }}
              className="glass flex items-start gap-3.5 p-3.5 transition hover:border-gold-400/35 hover:bg-white/[0.07]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold-400/30 bg-gold-500/10 text-gold-300">
                <feature.icon size={18} />
              </span>
              <span>
                <span className="block font-techno text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">
                  {feature.title}
                </span>
                <span className="block text-[13px] text-slate-400">{feature.text}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* rotating compass + live status */}
      <div className="relative flex items-end justify-between gap-6">
        <div className="space-y-2 rounded-xl border border-white/[0.07] bg-abyss-950/75 px-3.5 py-3 backdrop-blur-md">
          <StatusLine
            label="Firebase project"
            value={isConfigured ? projectId : 'not configured'}
            tone={isConfigured ? 'ok' : 'warn'}
          />
          <StatusLine
            label="Auth service"
            value={authStatus}
            tone={authStatus === 'authenticated' ? 'ok' : authStatus === 'error' ? 'bad' : 'info'}
          />
          <StatusLine
            label="Firestore"
            value={firestoreStatus}
            tone={
              firestoreStatus === 'connected'
                ? 'ok'
                : firestoreStatus === 'error'
                  ? 'bad'
                  : 'info'
            }
          />
        </div>

        <div className="relative h-32 w-32 shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-gold-400/35"
          />
          <CompassRose size={128} className="animate-float" />
        </div>
      </div>
    </aside>
  );
}

function StatusLine({ label, value, tone }) {
  const colors = {
    ok: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]',
    bad: 'bg-ruby-500 shadow-[0_0_10px_rgba(230,57,70,0.9)]',
    warn: 'bg-gold-400 shadow-[0_0_10px_rgba(242,181,48,0.9)]',
    info: 'bg-tide-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]',
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-2 w-2 rounded-full animate-blink ${colors[tone] || colors.info}`} />
      <span className="font-techno text-[11px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <span className="font-mono text-[11px] text-slate-300">{value}</span>
    </div>
  );
}
