import { motion } from 'framer-motion';
import { Compass, Database, Route, Sparkles, Users } from 'lucide-react';
import { useParallax } from '../../hooks/useParallax';
import { bountyFrom, shortId } from '../../utils/format';
import InteractiveCompass from './InteractiveCompass';

const TITLE = 'THE GRAND LINE AWAITS';

const LETTERS = (() => {
  const words = TITLE.split(' ');
  let index = 0;
  return words.map((word) => ({
    word,
    letters: word.split('').map((char) => ({ char, index: index++ })),
  }));
})();

export default function HeroSection({ profile, authUser, projectId, onSetSail, sailing }) {
  const { x, y } = useParallax(16);

  const name =
    profile?.fullName || authUser?.displayName || authUser?.email?.split('@')[0] || 'Navigator';

  const chips = [
    { icon: Users, label: 'Rank', value: profile?.role || 'navigator' },
    { icon: Sparkles, label: 'Logins', value: String(profile?.loginCount ?? '—') },
    { icon: Database, label: 'Doc', value: profile ? shortId(profile.userId, 6, 4) : 'syncing…' },
  ];

  const tickerItems = [
    `project: ${projectId}`,
    `collection: users`,
    `doc: ${profile ? profile.userId : 'pending'}`,
    `provider: ${profile?.provider || authUser?.providerData?.[0]?.providerId || '—'}`,
    `role: ${profile?.role || '—'}`,
    `reward: ฿${bountyFrom(profile?.loginCount || 1)}`,
    `session: active`,
  ];

  return (
    <section id="command" className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-10 sm:px-6 lg:pt-16">
      <div className="grid items-center gap-14 lg:grid-cols-[1.12fr_1fr] lg:gap-8">
        {/* ---------------- left: copy ---------------- */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 rounded-full border border-gold-400/30 bg-gold-500/[0.07] px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ruby-500 shadow-glow-red" />
            <span className="font-techno text-[10px] uppercase tracking-[0.3em] text-gold-200">
              Straw Hat Fleet · Firebase Protocol
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-[13vw] font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-[64px] xl:text-[76px]">
            {LETTERS.map((group, groupIndex) => (
              <span key={group.word} className="inline-block whitespace-nowrap">
                {group.letters.map((letter) => (
                  <motion.span
                    key={`${group.word}-${letter.index}`}
                    initial={{ opacity: 0, y: '0.55em', filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.18 + (groupIndex * 4 + letter.index) * 0.035,
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block text-shimmer"
                  >
                    {letter.char}
                  </motion.span>
                ))}
                {groupIndex < LETTERS.length - 1 ? (
                  <span className="inline-block w-[0.28em]" aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </h1>

          {/* hand-drawn red stroke */}
          <motion.svg
            viewBox="0 0 600 26"
            className="mt-1 h-6 w-full max-w-[520px]"
            aria-hidden="true"
          >
            <motion.path
              d="M6 17 C 150 5, 320 23, 594 9"
              fill="none"
              stroke="#e63946"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 1, delay: 1.15, ease: 'easeInOut' }}
            />
            <motion.path
              d="M22 23 C 170 13, 350 27, 570 17"
              fill="none"
              stroke="#f2b530"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.65"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.45, ease: 'easeInOut' }}
            />
          </motion.svg>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
          >
            Welcome aboard,{' '}
            <span className="font-display font-bold text-gold-gradient">{name}</span>.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-400"
          >
            React → Firebase Authentication → Cloud Firestore → real-time UI. Everything below is
            streamed from your live document{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[13px] text-tide-300">
              users/{profile ? shortId(profile.userId, 6, 4) : '…'}
            </code>
            .
          </motion.p>

          {/* quick chips */}
          <div className="mt-7 flex flex-wrap gap-3">
            {chips.map((chip, index) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.08 }}
                className="glass flex items-center gap-2.5 px-3.5 py-2"
              >
                <chip.icon className="h-4 w-4 text-tide-300" />
                <span>
                  <span className="block font-techno text-[9px] uppercase leading-none tracking-[0.22em] text-slate-500">
                    {chip.label}
                  </span>
                  <span className="mt-1 block font-mono text-[13px] leading-none text-slate-100">
                    {chip.value}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>

          {/* actions */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <motion.button
              type="button"
              onClick={onSetSail}
              disabled={sailing}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 220, damping: 16 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold relative !px-9 !py-4 text-base tracking-[0.22em]"
            >
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gold-300/40 blur-lg animate-pulseGlow" />
              <Compass className="relative h-5 w-5" />
              <span className="relative">SET SAIL</span>
            </motion.button>

            <button
              type="button"
              onClick={() => document.getElementById('log')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost"
            >
              <Database className="h-4 w-4" />
              Database Log
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-ghost"
            >
              <Route className="h-4 w-4" />
              Seminar pipeline
            </button>
          </div>
        </div>

        {/* ---------------- right: compass ---------------- */}
        <motion.div
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.86, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            className="pointer-events-none absolute -inset-10 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(11,127,184,0.35), transparent 65%), radial-gradient(circle at 60% 40%, rgba(242,181,48,0.18), transparent 60%)',
            }}
          />
          <InteractiveCompass profile={profile} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-7 text-center font-techno text-[10px] uppercase tracking-[0.3em] text-slate-500"
          >
            tap the compass to change bearing
          </motion.div>
        </motion.div>
      </div>

      {/* live ticker of real values */}
      <div className="mt-14 overflow-hidden rounded-xl border border-white/[0.07] bg-abyss-900/50 py-2.5 mask-fade-x">
        <div className="flex w-max animate-ticker gap-10 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10">
              {tickerItems.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full bg-gold-400" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
