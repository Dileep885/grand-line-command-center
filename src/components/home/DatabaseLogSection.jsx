import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Clipboard,
  Cloud,
  Database,
  FileJson,
  Lock,
  Radio,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime, shortId } from '../../utils/format';
import ActivityFeed from './ActivityFeed';
import { SectionLabel } from './StatusDeck';

const KEYWORD_COLORS = {
  string: 'text-tide-300',
  number: 'text-emerald-300',
  boolean: 'text-gold-300',
  null: 'text-ruby-300',
};

function JsonLine({ line }) {
  const match = line.match(/^(\s*)("[^"]+"):\s?(.*)$/);
  if (!match) {
    return <div className="whitespace-pre text-slate-400">{line || ' '}</div>;
  }

  const [, indent, key, rawValue] = match;
  let tone = 'text-slate-300';
  if (rawValue.startsWith('"')) tone = KEYWORD_COLORS.string;
  else if (/^-?\d/.test(rawValue)) tone = KEYWORD_COLORS.number;
  else if (/^(true|false)/.test(rawValue)) tone = KEYWORD_COLORS.boolean;
  else if (/^null/.test(rawValue)) tone = KEYWORD_COLORS.null;

  return (
    <div className="whitespace-pre">
      <span>{indent}</span>
      <span className="text-gold-300">{key}</span>
      <span className="text-slate-500">: </span>
      <span className={tone}>{rawValue}</span>
    </div>
  );
}

/**
 * The seminar centrepiece: the live Firestore document rendered as both a
 * field table and raw JSON. Content stays sealed until "SET SAIL" runs.
 */
export default function DatabaseLogSection({ unlocked, onSetSail }) {
  const { profile, profileId, authUser, projectId, firestoreStatus, authStatus } = useAuth();
  const [copied, setCopied] = useState(false);

  const document = useMemo(
    () =>
      profile
        ? {
            userId: profile.userId,
            fullName: profile.fullName,
            email: profile.email,
            role: profile.role,
            provider: profile.provider,
            photoURL: profile.photoURL ?? null,
            loginCount: profile.loginCount,
            createdAt: profile.createdAt ? formatDateTime(profile.createdAt) : null,
            lastLogin: profile.lastLogin ? formatDateTime(profile.lastLogin) : null,
            _docId: profileId,
          }
        : null,
    [profile, profileId],
  );

  const json = useMemo(() => JSON.stringify(document ?? {}, null, 2), [document]);
  const lines = useMemo(() => json.split('\n'), [json]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const fields = document
    ? [
        ['Document ID', `users/${profileId}`, 'firestore'],
        ['userId', profile.userId, 'firestore'],
        ['fullName', profile.fullName, 'firestore'],
        ['email', profile.email, 'firestore'],
        ['createdAt', formatDateTime(profile.createdAt), 'firestore'],
        ['lastLogin', formatDateTime(profile.lastLogin), 'firestore'],
        ['loginCount', String(profile.loginCount ?? '—'), 'firestore'],
        ['role', profile.role || '—', 'firestore'],
        ['provider', profile.provider || '—', 'auth'],
        ['auth status', authStatus, 'auth'],
        ['connection', firestoreStatus, 'live'],
      ]
    : [];

  return (
    <section id="log" className="relative mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-caps text-tide-300/90">Storage layer · users collection</p>
          <h2 className="mt-2 font-display text-4xl font-black text-gold-gradient sm:text-5xl">
            DATABASE LOG
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            The exact document Cloud Firestore holds for this account — read with{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-tide-300">
              onSnapshot
            </code>{' '}
            and re-rendered on every server change.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              className="relative flex items-center gap-2.5 rounded-xl border border-gold-400/50 bg-gold-500/10 px-4 py-2.5 shadow-glow-gold"
            >
              <span className="absolute inset-0 animate-pulseGlow rounded-xl bg-gold-400/20" />
              <Unlock className="relative h-4 w-4 text-gold-300" />
              <span className="relative font-techno text-xs font-bold uppercase tracking-[0.2em] text-gold-200">
                Database log unlocked
              </span>
            </motion.div>
          ) : (
            <motion.button
              key="locked"
              type="button"
              onClick={onSetSail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="btn-red"
            >
              <Lock className="h-4 w-4" />
              Press SET SAIL to unlock
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        {/* field table */}
        <div className="glass relative overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-white/[0.08] bg-abyss-950/50 px-4 py-3">
            <Database className="h-4 w-4 text-gold-300" />
            <span className="font-techno text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100">
              Document fields
            </span>
            <span className="ml-auto font-mono text-[10px] text-slate-500">
              {profile ? `${fields.length} keys` : 'waiting for snapshot'}
            </span>
          </div>

          <div className={`transition-all duration-500 ${unlocked ? '' : 'blur-[7px] select-none'}`}>
            <dl className="divide-y divide-white/[0.06]">
              {fields.length ? (
                fields.map(([key, value, source]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 transition hover:bg-white/[0.04]"
                  >
                    <dt className="flex items-center gap-2">
                      <span className="font-mono text-[12px] text-gold-300/90">{key}</span>
                      <span
                        className={`rounded px-1.5 py-px font-techno text-[9px] uppercase tracking-[0.14em] ${
                          source === 'auth'
                            ? 'bg-tide-500/15 text-tide-300'
                            : source === 'live'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-gold-500/15 text-gold-300'
                        }`}
                      >
                        {source}
                      </span>
                    </dt>
                    <dd className="truncate text-right font-mono text-[12.5px] text-slate-100">
                      {value}
                    </dd>
                  </div>
                ))
              ) : (
                <div className="px-4 py-10 text-center font-mono text-xs text-slate-500">
                  Waiting for the first snapshot…
                </div>
              )}
            </dl>
          </div>

          {!unlocked && (
            <div className="absolute inset-0 grid place-items-center bg-abyss-950/35">
              <div className="glass flex flex-col items-center gap-3 px-6 py-5 text-center">
                <Lock className="h-6 w-6 text-gold-300" />
                <p className="font-techno text-[11px] uppercase tracking-[0.24em] text-slate-200">
                  Sealed until SET SAIL
                </p>
                <p className="max-w-[220px] text-xs text-slate-500">
                  The data below is real — run the sequence to reveal it.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* JSON terminal */}
        <div className="glass relative overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-white/[0.08] bg-abyss-950/60 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ruby-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </span>
            <FileJson className="ml-2 h-4 w-4 text-tide-300" />
            <span className="font-mono text-[11px] text-slate-300">
              users/{profileId ? shortId(profileId, 8, 4) : '…'}.json
            </span>
            <button
              type="button"
              onClick={copy}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-techno text-[10px] uppercase tracking-[0.16em] text-slate-400 transition hover:border-gold-400/50 hover:text-gold-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="relative">
            <pre
              className={`max-h-[360px] overflow-auto bg-abyss-950/70 p-4 font-mono text-[12px] leading-relaxed transition-all duration-500 ${
                unlocked ? '' : 'blur-[7px] select-none'
              }`}
            >
              {lines.map((line, index) => (
                <JsonLine key={`${index}-${line}`} line={line} />
              ))}
            </pre>
            <span className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-scan bg-gradient-to-b from-transparent via-tide-400/10 to-transparent" />
            {!unlocked && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="glass flex items-center gap-2 px-4 py-2.5 font-techno text-[11px] uppercase tracking-[0.2em] text-gold-200">
                  <Lock className="h-4 w-4" />
                  Encrypted payload
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.08] bg-abyss-950/50 px-4 py-2.5">
            <Meta icon={ShieldCheck} label="auth" value={authStatus} />
            <Meta icon={Cloud} label="project" value={projectId} />
            <Meta icon={Radio} label="stream" value={firestoreStatus} />
            <Meta icon={Database} label="uid" value={authUser ? shortId(authUser.uid) : '—'} />
          </div>
        </div>
      </div>

      {/* live operation feed */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="glass p-4">
          <SectionLabel icon={Radio} text="Operation stream" />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Every row below is emitted by a real callback in this session — the auth state
            listener, the snapshot handler and document writes. Nothing here is scripted.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              'USER AUTHENTICATED',
              'FIRESTORE DOCUMENT FOUND',
              'PROFILE LOADED',
              'DATABASE SYNC COMPLETE',
            ].map((label) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-abyss-950/45 px-3 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-blink" />
                <span className="font-techno text-[11.5px] uppercase tracking-[0.16em] text-slate-300">
                  {label}
                </span>
                <span className="ml-auto font-mono text-[10px] text-slate-600">event</span>
              </li>
            ))}
          </ul>
        </div>

        <ActivityFeed compact />
      </div>

      {/* unlock flash */}
      <AnimatePresence>
        {unlocked && (
          <motion.span
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-400/60"
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-slate-500" />
      <span className="font-techno text-[9.5px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <span className="font-mono text-[11px] text-slate-300">{value}</span>
    </span>
  );
}
