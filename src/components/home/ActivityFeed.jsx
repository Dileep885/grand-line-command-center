import { AnimatePresence, motion } from 'framer-motion';
import { Eraser, Radio, Terminal } from 'lucide-react';
import { useActivity } from '../../context/ActivityContext';
import { formatClock } from '../../utils/format';

const TONE_CHIP = {
  ok: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
  info: 'border-tide-400/40 bg-tide-500/15 text-tide-300',
  warn: 'border-gold-400/40 bg-gold-500/15 text-gold-300',
  err: 'border-ruby-500/50 bg-ruby-600/20 text-ruby-300',
};

const TONE_DOT = {
  ok: 'bg-emerald-400',
  info: 'bg-tide-400',
  warn: 'bg-gold-400',
  err: 'bg-ruby-500',
};

/**
 * Live application event stream. Each row is a real event — auth calls,
 * snapshot reads and document writes — with the timestamp it happened.
 */
export default function ActivityFeed({ compact = false }) {
  const { events, total, clear } = useActivity();

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-abyss-950/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative grid h-7 w-7 place-items-center rounded-md border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
            <Radio className="h-3.5 w-3.5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-blink rounded-full bg-emerald-400" />
          </span>
          <div>
            <p className="font-techno text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-100">
              Real-time database activity
            </p>
            <p className="font-mono text-[10px] text-slate-500">
              {total} event{total === 1 ? '' : 's'} this session
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-techno text-[10px] uppercase tracking-[0.16em] text-slate-400 transition hover:border-gold-400/50 hover:text-gold-300"
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      {/* stream */}
      <div
        className={`flex-1 space-y-2 overflow-y-auto p-3 ${
          compact ? 'max-h-[300px]' : 'max-h-[430px]'
        }`}
      >
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -22, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 22, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="rounded-xl border border-white/[0.07] bg-abyss-950/55 p-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[event.tone]}`} />
                <span className="font-mono text-[10px] tabular-nums text-slate-500">
                  {formatClock(event.at)}
                </span>
                <span
                  className={`rounded border px-1.5 py-px font-techno text-[9px] font-bold uppercase tracking-[0.14em] ${
                    TONE_CHIP[event.tone] || TONE_CHIP.info
                  }`}
                >
                  {event.code}
                </span>
                <span className="truncate font-techno text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-100">
                  {event.message}
                </span>
              </div>
              {event.detail ? (
                <p className="mt-1 truncate pl-4 font-mono text-[10.5px] text-slate-500">
                  {event.detail}
                </p>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>

        {!events.length && (
          <div className="grid h-40 place-items-center rounded-xl border border-dashed border-white/10 text-center">
            <div>
              <Terminal className="mx-auto h-6 w-6 text-slate-600" />
              <p className="mt-2 font-techno text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Awaiting the first signal
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Sign-in, snapshots and writes appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* scanning line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-transparent via-tide-400/10 to-transparent" />
    </div>
  );
}
