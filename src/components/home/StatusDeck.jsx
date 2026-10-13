import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Clock,
  Cloud,
  Fingerprint,
  Layers,
  LogIn,
  Mail,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime, shortId } from '../../utils/format';
import { useCountUp } from '../../hooks/useCountUp';

const TONES = {
  ok: { dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'border-emerald-400/45', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.35)]' },
  warn: { dot: 'bg-gold-400', text: 'text-gold-300', ring: 'border-gold-400/45', glow: 'shadow-[0_0_20px_rgba(242,181,48,0.3)]' },
  live: { dot: 'bg-tide-400', text: 'text-tide-300', ring: 'border-tide-400/45', glow: 'shadow-[0_0_20px_rgba(56,189,248,0.35)]' },
  bad: { dot: 'bg-ruby-500', text: 'text-ruby-300', ring: 'border-ruby-500/50', glow: 'shadow-[0_0_20px_rgba(230,57,70,0.4)]' },
  idle: { dot: 'bg-slate-500', text: 'text-slate-300', ring: 'border-white/15', glow: '' },
};

const STATUS_TONE = {
  authenticated: 'ok',
  connected: 'ok',
  cached: 'warn',
  connecting: 'live',
  anonymous: 'idle',
  idle: 'idle',
  error: 'bad',
};

const STATUS_COPY = {
  authenticated: 'AUTHENTICATED',
  anonymous: 'SIGNED OUT',
  connecting: 'HANDSHAKING…',
  error: 'ERROR',
  connected: 'LIVE STREAM',
  cached: 'CACHE SERVED',
  idle: 'STANDBY',
};

function Tile({ icon: Icon, label, value, hint, index = 0, accent = 'gold' }) {
  const accentClasses =
    accent === 'ocean'
      ? 'border-tide-400/25 bg-tide-500/10 text-tide-300'
      : accent === 'red'
        ? 'border-ruby-500/30 bg-ruby-600/10 text-ruby-300'
        : 'border-gold-400/30 bg-gold-500/10 text-gold-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group glass relative overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.07]"
    >
      <span className="absolute right-0 top-0 h-16 w-16 -translate-y-6 translate-x-6 rounded-full bg-gold-400/10 blur-2xl transition group-hover:bg-gold-400/20" />
      <span className={`grid h-9 w-9 place-items-center rounded-lg border ${accentClasses}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 label-caps">{label}</p>
      <p className="mt-1 break-words font-mono text-[13px] leading-snug text-slate-100">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null}
    </motion.div>
  );
}

function ConnectionCard({ icon: Icon, title, status, details, index = 0 }) {
  const tone = TONES[STATUS_TONE[status] || 'idle'];
  const label = STATUS_COPY[status] || String(status).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`glass relative overflow-hidden border ${tone.ring} ${tone.glow} p-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-abyss-950/60 text-slate-200">
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-abyss-950/70 px-2.5 py-1">
          <span className={`h-1.5 w-1.5 rounded-full animate-blink ${tone.dot}`} />
          <span className={`font-techno text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.text}`}>
            {label}
          </span>
        </span>
      </div>

      <p className="mt-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-slate-100">
        {title}
      </p>

      <dl className="mt-3 space-y-1.5">
        {details.map(([key, val]) => (
          <div key={key} className="flex items-baseline justify-between gap-3 border-b border-white/[0.06] pb-1.5 last:border-0">
            <dt className="font-techno text-[10px] uppercase tracking-[0.2em] text-slate-500">{key}</dt>
            <dd className="truncate font-mono text-[11px] text-slate-200">{val}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

/** Stat grid + live Firebase connection readouts. */
export default function StatusDeck() {
  const { profile, profileId, authUser, authStatus, firestoreStatus, projectId, busy } = useAuth();
  const logins = useCountUp(profile?.loginCount ?? 0);

  const tiles = [
    { icon: Mail, label: 'Crew email', value: profile?.email || authUser?.email || '—', accent: 'gold' },
    { icon: Calendar, label: 'Account created', value: profile?.createdAt ? formatDateTime(profile.createdAt) : 'syncing…', hint: 'from Firestore createdAt', accent: 'ocean' },
    { icon: Clock, label: 'Last login', value: profile?.lastLogin ? formatDateTime(profile.lastLogin) : 'syncing…', hint: 'written on every sign-in', accent: 'ocean' },
    { icon: LogIn, label: 'Login count', value: String(logins), hint: 'incremented in Firestore', accent: 'red' },
    { icon: Layers, label: 'Role · provider', value: `${profile?.role || 'navigator'} · ${profile?.provider || authUser?.providerData?.[0]?.providerId || '—'}`, accent: 'gold' },
    { icon: Fingerprint, label: 'Firebase UID', value: profileId ? shortId(authUser?.uid || profileId, 8, 6) : '—', hint: 'users/{uid} document id', accent: 'ocean' },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      {/* stat grid */}
      <div>
        <SectionLabel icon={Activity} text="Ship manifest · live account data" />
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile, index) => (
            <Tile key={tile.label} {...tile} index={index} />
          ))}
        </div>
      </div>

      {/* connection status */}
      <div>
        <SectionLabel icon={Server} text="Connection status" />
        <div className="mt-4 grid gap-3.5">
          <ConnectionCard
            index={0}
            icon={ShieldCheck}
            title="Firebase Authentication"
            status={authStatus}
            details={[
              ['project', projectId],
              ['provider', profile?.provider || authUser?.providerData?.[0]?.providerId || '—'],
              ['session', authUser ? 'active' : 'none'],
              ['pending op', busy ? 'in flight' : 'idle'],
            ]}
          />
          <ConnectionCard
            index={1}
            icon={Cloud}
            title="Cloud Firestore"
            status={firestoreStatus}
            details={[
              ['collection', 'users'],
              ['document', profileId ? shortId(profileId, 10, 6) : '—'],
              ['listener', firestoreStatus === 'connected' ? 'onSnapshot active' : 'waiting'],
              ['stream', firestoreStatus === 'cached' ? 'latency-compensated' : 'server'],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function SectionLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-md border border-gold-400/30 bg-gold-500/10 text-gold-300">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="label-caps text-gold-200/90">{text}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-gold-400/35 to-transparent" />
    </div>
  );
}
