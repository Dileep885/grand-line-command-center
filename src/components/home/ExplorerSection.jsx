import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  CircleDot,
  Cloud,
  Code2,
  Database,
  LayoutDashboard,
  Play,
  Radio,
  ShieldCheck,
  Square,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { shortId } from '../../utils/format';
import { SectionLabel } from './StatusDeck';

/**
 * Seminar mode: the request path from the user's tap to the rendered
 * dashboard, one animated stage at a time, with the live status of each hop.
 */
export default function ExplorerSection() {
  const { authStatus, firestoreStatus, profile, profileId, projectId } = useAuth();

  const stages = useMemo(
    () => [
      {
        id: 'user',
        icon: User,
        title: 'USER',
        subtitle: 'Enters credentials and taps Login',
        detail:
          'The React form validates the email and password on the client, then calls the auth action. No network traffic happens until Firebase is invoked.',
        code: "await signIn({ email, password })",
        live: 'form → handleSubmit()',
      },
      {
        id: 'frontend',
        icon: Code2,
        title: 'REACT FRONTEND',
        subtitle: 'AuthContext flips into busy state',
        detail:
          'The provider emits a request event into the activity feed, disables the button and renders the spinner while the promise is pending.',
        code: "setBusy(true)\npush({ code: 'REQ', message: 'AUTH REQUEST SENT' })",
        live: 'UI: loading + error slots',
      },
      {
        id: 'auth',
        icon: ShieldCheck,
        title: 'FIREBASE AUTHENTICATION',
        subtitle: 'Credentials verified in your project',
        detail:
          'Firebase Auth validates the account, issues tokens and fires onAuthStateChanged. Failures map to readable messages instead of raw codes.',
        code: "signInWithEmailAndPassword(auth, email, password)\nonAuthStateChanged(auth, (user) => …)",
        live: `authStatus: ${authStatus}`,
      },
      {
        id: 'firestore',
        icon: Database,
        title: 'CLOUD FIRESTORE',
        subtitle: 'users/{uid} is created or updated',
        detail:
          'First sign-in creates the document with loginCount = 1. Every later sign-in writes lastLogin and increments loginCount in a single updateDoc call.',
        code: "setDoc(doc(db, 'users', uid), payload)\nupdateDoc(ref, { lastLogin, loginCount })",
        live: `doc: ${profileId ? shortId(profileId, 8, 4) : 'pending'} · count: ${profile?.loginCount ?? '—'}`,
      },
      {
        id: 'realtime',
        icon: Radio,
        title: 'REAL-TIME DATA',
        subtitle: 'onSnapshot streams changes back',
        detail:
          'An open listener pushes each document change into React state — including the write we just made — so the UI updates without a manual refetch.',
        code: "onSnapshot(userDocRef(uid), (snap) => setSession({ profile: snap.data() }))",
        live: `stream: ${firestoreStatus}`,
      },
      {
        id: 'dashboard',
        icon: LayoutDashboard,
        title: 'HOME DASHBOARD',
        subtitle: 'Command center re-renders',
        detail:
          'Welcome banner, wanted poster, stat tiles and the activity feed all re-render from the fresh document. No hardcoded values anywhere.',
        code: "<ProfilePoster profile={profile} />  <StatusDeck />  <ActivityFeed />",
        live: `project: ${projectId}`,
      },
    ],
    [authStatus, firestoreStatus, profile, profileId, projectId],
  );

  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const stop = () => {
    clearTimers();
    setRunning(false);
  };

  const run = () => {
    clearTimers();
    setRunning(true);
    setActive(0);
    stages.forEach((_, index) => {
      timers.current.push(
        setTimeout(() => {
          setActive(index);
          if (index === stages.length - 1) setRunning(false);
        }, index * 1300),
      );
    });
  };

  const current = stages[active];

  return (
    <section id="explorer" className="relative mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-caps text-tide-300/90">Seminar mode · request pipeline</p>
          <h2 className="mt-2 font-display text-4xl font-black text-gold-gradient sm:text-5xl">
            DATABASE EXPLORER
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Frontend → Firebase Authentication → Cloud Firestore → real-time data → dashboard.
            Select any stage, or run the full sequence during the demo.
          </p>
        </div>

        <button type="button" onClick={running ? stop : run} className={running ? 'btn-red' : 'btn-gold'}>
          {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Stop demo' : 'Run pipeline demo'}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* pipeline */}
        <div className="glass p-4 sm:p-6">
          <SectionLabel icon={ArrowDown} text="Request path" />

          <ol className="mt-5">
            {stages.map((stage, index) => {
              const isActive = index === active;
              const reached = index <= active;
              const Icon = stage.icon;

              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    onClick={() => {
                      stop();
                      setActive(index);
                    }}
                    className={`group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-gold-400/60 bg-gold-500/[0.09] shadow-glow-gold'
                        : reached
                          ? 'border-white/[0.12] bg-white/[0.045] hover:border-gold-400/40'
                          : 'border-white/[0.07] bg-abyss-950/40 hover:border-white/15'
                    }`}
                  >
                    <span
                      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition ${
                        isActive
                          ? 'border-gold-400/60 bg-gold-500/15 text-gold-200'
                          : reached
                            ? 'border-tide-400/40 bg-tide-500/10 text-tide-300'
                            : 'border-white/10 bg-abyss-900 text-slate-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-xl border border-gold-400/70"
                          animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`truncate font-techno text-[13px] font-bold uppercase tracking-[0.14em] ${
                            isActive ? 'text-gold-200' : 'text-slate-200'
                          }`}
                        >
                          {stage.title}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-slate-400">
                        {stage.subtitle}
                      </span>
                    </span>

                    <CircleDot
                      className={`h-4 w-4 shrink-0 transition ${
                        reached ? 'text-emerald-400' : 'text-slate-700'
                      }`}
                    />
                  </button>

                  {index < stages.length - 1 && (
                    <div className="relative ml-[34px] h-9 w-px overflow-hidden bg-white/10">
                      <motion.span
                        className="absolute inset-x-0 top-0 h-full"
                        style={{
                          background: reached
                            ? 'linear-gradient(180deg, #f2b530, #38bdf8)'
                            : 'transparent',
                        }}
                        animate={running && reached ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
                        transition={{ duration: 1, repeat: running ? Infinity : 0 }}
                      />
                      <ArrowDown
                        className={`absolute -left-[7px] bottom-0 h-3.5 w-3.5 ${
                          reached ? 'text-tide-300' : 'text-slate-700'
                        }`}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* detail panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
              transition={{ duration: 0.35 }}
              className="glass relative overflow-hidden p-5 sm:p-6"
            >
              <span className="absolute right-0 top-0 h-32 w-32 -translate-y-10 translate-x-10 rounded-full bg-gold-400/10 blur-3xl" />

              <div className="relative flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold-400/40 bg-gold-500/10 text-gold-300">
                  <current.icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="label-caps text-gold-400/90">
                    Stage {active + 1} of {stages.length}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-slate-50 sm:text-2xl">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="relative mt-4 text-[15px] leading-relaxed text-slate-300">
                {current.detail}
              </p>

              <div className="relative mt-5">
                <p className="label-caps">Executed code</p>
                <pre className="mt-2 overflow-x-auto rounded-xl border border-white/[0.08] bg-abyss-950/80 p-4 font-mono text-[12.5px] leading-relaxed text-tide-200">
                  {current.code}
                </pre>
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.07] px-4 py-3">
                <span className="font-techno text-[10px] uppercase tracking-[0.22em] text-emerald-300/90">
                  Live value
                </span>
                <span className="truncate font-mono text-[12px] text-emerald-200">
                  {current.live}
                </span>
              </div>

              <div className="relative mt-5 flex gap-2">
                <button
                  type="button"
                  disabled={active === 0}
                  onClick={() => {
                    stop();
                    setActive((value) => Math.max(0, value - 1));
                  }}
                  className="btn-ghost flex-1 !py-2.5 text-[11px] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={active === stages.length - 1}
                  onClick={() => {
                    stop();
                    setActive((value) => Math.min(stages.length - 1, value + 1));
                  }}
                  className="btn-gold flex-1 !py-2.5 text-[11px] disabled:opacity-40"
                >
                  Next stage
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
