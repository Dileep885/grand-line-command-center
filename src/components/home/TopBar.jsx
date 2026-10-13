import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, LayoutGrid, LogOut, Menu, Route, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { initials } from '../../utils/format';
import StrawHatMark from '../shared/StrawHatMark';

const LINKS = [
  { id: 'command', label: 'Command', icon: LayoutGrid },
  { id: 'log', label: 'Database Log', icon: Database },
  { id: 'explorer', label: 'Explorer', icon: Route },
];

export default function TopBar({ activeSection, onLogout, loggingOut }) {
  const { profile, authUser, authStatus, firestoreStatus } = useAuth();
  const [open, setOpen] = useState(false);

  const name = profile?.fullName || authUser?.displayName || authUser?.email || 'Navigator';
  const avatar = profile?.photoURL || authUser?.photoURL;

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-abyss-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* brand */}
        <button
          type="button"
          onClick={() => go('command')}
          className="flex items-center gap-2.5 text-left"
        >
          <StrawHatMark size={32} className="animate-float" />
          <span className="hidden sm:block">
            <span className="block font-display text-sm font-bold leading-none tracking-[0.2em] text-gold-gradient">
              GRAND LINE
            </span>
            <span className="mt-1 block font-techno text-[9px] uppercase leading-none tracking-[0.28em] text-tide-300/70">
              Database Command Center
            </span>
          </span>
        </button>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 rounded-xl border border-white/10 bg-abyss-900/60 p-1 md:flex">
          {LINKS.map((link) => {
            const active = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className={`relative rounded-lg px-4 py-2 font-techno text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  active ? 'text-abyss-950' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-b from-gold-300 to-gold-500"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-abyss-900/60 px-3 py-2 lg:flex">
            <StatusPip label="auth" status={authStatus} />
            <span className="h-4 w-px bg-white/10" />
            <StatusPip label="firestore" status={firestoreStatus} />
          </div>

          <button
            type="button"
            onClick={() => go('profile')}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-abyss-900/60 py-1.5 pl-1.5 pr-3 transition hover:border-gold-400/45"
          >
            <Avatar name={name} src={avatar} size={30} />
            <span className="hidden text-left sm:block">
              <span className="block max-w-[140px] truncate font-techno text-[12px] font-semibold leading-tight text-slate-100">
                {name}
              </span>
              <span className="block font-techno text-[9px] uppercase leading-tight tracking-[0.18em] text-gold-400/90">
                {profile?.role || 'navigator'}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            aria-label="Log out"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-abyss-900/60 text-slate-300 transition hover:border-ruby-500/60 hover:bg-ruby-600/15 hover:text-ruby-300 disabled:opacity-60"
          >
            <LogOut className={`h-4 w-4 ${loggingOut ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-abyss-900/60 text-slate-200 md:hidden"
          >
            {open ? <X size={18} /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.07] bg-abyss-950/95 md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-techno text-sm uppercase tracking-[0.16em] transition ${
                    activeSection === link.id
                      ? 'border border-gold-400/40 bg-gold-500/10 text-gold-200'
                      : 'border border-transparent text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function StatusPip({ label, status }) {
  const map = {
    authenticated: 'bg-emerald-400',
    connected: 'bg-emerald-400',
    cached: 'bg-gold-400',
    connecting: 'bg-tide-400',
    anonymous: 'bg-slate-400',
    idle: 'bg-slate-500',
    error: 'bg-ruby-500',
  };
  return (
    <span className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full animate-blink ${map[status] || 'bg-slate-500'}`} />
      <span className="font-techno text-[10px] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </span>
  );
}

export function Avatar({ name, src, size = 40, className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`rounded-lg border border-gold-400/40 object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <span
      className={`grid place-items-center rounded-lg border border-gold-400/40 bg-gradient-to-br from-ruby-500/80 to-gold-600/70 font-display font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
