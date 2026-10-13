import { motion } from 'framer-motion';
import { BadgeCheck, Fingerprint, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { bountyFrom, formatDate, initials } from '../../utils/format';
import { Avatar } from './TopBar';

/**
 * Wanted-poster profile card. Every field comes from the live Firestore
 * document (or the Firebase auth record) — the "bounty" is derived from the
 * real login count so it can never be a fake statistic.
 */
export default function ProfilePoster() {
  const { profile, profileId, authUser } = useAuth();

  const name = profile?.fullName || authUser?.displayName || 'Unnamed Navigator';
  const email = profile?.email || authUser?.email || '—';
  const avatar = profile?.photoURL || authUser?.photoURL;
  const bounty = bountyFrom(profile?.loginCount || 1);
  const issued = profile?.createdAt ? formatDate(profile.createdAt) : 'syncing…';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: -6 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.6 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ rotate: 0, scale: 1.015, y: -6 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className="parchment poster-frame relative overflow-hidden rounded-md text-[#2b1a0d]"
    >
      {/* brass tacks */}
      <span className="absolute left-3 top-3 h-3 w-3 rounded-full bg-gradient-to-br from-gold-300 to-gold-700 shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
      <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-gradient-to-br from-gold-300 to-gold-700 shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />

      <div className="m-3 rounded-sm border-2 border-dashed border-[#3a2a16]/45 p-4 sm:m-4 sm:p-5">
        <header className="text-center">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.5em] text-[#7c5012]">
            Grand Line Authority
          </p>
          <h3 className="mt-1 font-display text-5xl font-black leading-none tracking-[0.06em] text-[#241205] sm:text-6xl">
            WANTED
          </h3>
          <p className="mt-1 font-techno text-xs font-bold uppercase tracking-[0.42em] text-[#8a2b1f]">
            Dead or Alive
          </p>
        </header>

        {/* portrait */}
        <div className="relative mt-4 overflow-hidden rounded-sm border-[3px] border-[#3a2a16]/80 bg-[#e7d0a0]">
          <div className="map-treasure absolute inset-0 opacity-40" />
          <div className="relative grid h-40 place-items-center sm:h-48">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden';
                }}
              />
            ) : (
              <div className="relative">
                <span className="absolute -inset-6 rounded-full bg-[#3a2a16]/10 blur-2xl" />
                <span className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-[#3a2a16]/80 bg-gradient-to-br from-ruby-500 to-gold-600 font-display text-4xl font-black text-parchment-100 shadow-lg sm:h-28 sm:w-28 sm:text-5xl">
                  {initials(name)}
                </span>
              </div>
            )}
          </div>

          {/* identity strip */}
          <div className="relative border-t-[3px] border-[#3a2a16]/80 bg-[#3a2a16]/95 px-3 py-2">
            <p className="truncate text-center font-display text-lg font-black uppercase leading-tight tracking-wide text-parchment-100 sm:text-xl">
              {name}
            </p>
            <p className="truncate text-center font-mono text-[11px] text-parchment-300/80">
              alias: {email}
            </p>
          </div>

          {/* authority stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 1.5, rotate: -30 }}
            whileInView={{ opacity: 0.85, scale: 1, rotate: -14 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 14 }}
            className="absolute -right-3 -top-3 grid h-24 w-24 place-items-center rounded-full border-[3px] border-[#8a2b1f] text-center sm:h-28 sm:w-28"
            style={{ background: 'rgba(244,228,193,0.35)' }}
          >
            <div className="rotate-[6deg]">
              <p className="font-techno text-[8px] font-bold uppercase leading-tight tracking-[0.16em] text-[#8a2b1f]">
                Firebase
                <br />
                Verified
                <br />
                <span className="text-[7px] tracking-[0.1em]">live doc</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* reward — derived from the real login count */}
        <div className="mt-4 text-center">
          <p className="font-techno text-[10px] font-bold uppercase tracking-[0.4em] text-[#7c5012]">
            Reward
          </p>
          <p className="font-display text-3xl font-black leading-tight text-[#241205] sm:text-4xl">
            ฿ {bounty}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-[#7c5012]">
            computed from {profile?.loginCount ?? '—'} real login
            {Number(profile?.loginCount) === 1 ? '' : 's'}
          </p>
        </div>

        {/* footer data */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-[#3a2a16]/50 pt-3">
          <div>
            <p className="font-techno text-[9px] uppercase tracking-[0.24em] text-[#7c5012]">
              Issued
            </p>
            <p className="font-mono text-[12px] text-[#241205]">{issued}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-[#c98a1c] text-[#c98a1c]" />
            <span className="font-techno text-[11px] font-bold uppercase tracking-[0.14em] text-[#241205]">
              {profile?.role || 'navigator'}
            </span>
          </div>
        </div>
      </div>

      {/* paper grain + fold shading */}
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.45), transparent 45%), radial-gradient(circle at 85% 90%, rgba(120,80,30,0.28), transparent 55%)',
        }}
      />

      {/* provenance */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <Fingerprint className="h-3.5 w-3.5 text-tide-400" />
        <span className="font-mono">
          users/{profileId || '…'}
        </span>
        <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
      </div>
    </motion.article>
  );
}
