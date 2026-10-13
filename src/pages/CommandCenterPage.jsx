import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, Sparkles } from 'lucide-react';
import OceanBackdrop from '../components/background/OceanBackdrop';
import ParticleField from '../components/background/ParticleField';
import ActivityFeed from '../components/home/ActivityFeed';
import DatabaseLogSection from '../components/home/DatabaseLogSection';
import ExplorerSection from '../components/home/ExplorerSection';
import HeroSection from '../components/home/HeroSection';
import ProfilePoster from '../components/home/ProfilePoster';
import StatusDeck from '../components/home/StatusDeck';
import TopBar from '../components/home/TopBar';
import SetSailOverlay from '../components/home/SetSailOverlay';
import StrawHatMark from '../components/shared/StrawHatMark';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../hooks/useAuth';
import { useSectionSpy } from '../hooks/useSectionSpy';

const SECTION_IDS = ['command', 'log', 'explorer'];

/** Cinematic "access granted" wipe played once after a successful login. */
function LoginCurtain({ name }) {
  const [visible, setVisible] = useState(true);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setOpened(true), 720);
    const closeTimer = setTimeout(() => setVisible(false), 1800);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <motion.div
        animate={opened ? { y: '-101%' } : { y: 0 }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 top-0 h-1/2 border-b border-gold-400/40 bg-abyss-950"
      />
      <motion.div
        animate={opened ? { y: '101%' } : { y: 0 }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 border-t border-gold-400/40 bg-abyss-950"
      />

      <motion.div
        animate={opened ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0 grid place-items-center text-center"
      >
        <div>
          <motion.div
            initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 210, damping: 14 }}
            className="mx-auto w-fit"
          >
            <StrawHatMark size={64} />
          </motion.div>
          <p className="mt-4 font-display text-3xl font-black tracking-[0.18em] text-shimmer sm:text-4xl">
            ACCESS GRANTED
          </p>
          <p className="mt-2 font-techno text-[11px] uppercase tracking-[0.4em] text-tide-300">
            Welcome, {name}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CommandCenterPage() {
  const { profile, authUser, projectId, logOut } = useAuth();
  const { push } = useActivity();
  const activeSection = useSectionSpy(SECTION_IDS);

  const [unlocked, setUnlocked] = useState(false);
  const [sailing, setSailing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const name =
    profile?.fullName || authUser?.displayName || authUser?.email?.split('@')[0] || 'Navigator';

  const handleSetSail = useCallback(() => setSailing(true), []);

  const handleSailComplete = useCallback(() => {
    setSailing(false);
    setUnlocked(true);
    push({
      code: 'OK',
      message: 'DATABASE LOG UNLOCKED',
      detail: 'SET SAIL sequence completed',
      tone: 'ok',
    });
    setTimeout(
      () => document.getElementById('log')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      120,
    );
  }, [push]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await logOut();
    setLoggingOut(false);
  }, [logOut]);

  return (
    <div className="relative min-h-screen">
      <OceanBackdrop />
      <ParticleField />
      <LoginCurtain name={name} />

      <TopBar activeSection={activeSection} onLogout={handleLogout} loggingOut={loggingOut} />

      <main className="relative pb-6">
        <HeroSection
          profile={profile}
          authUser={authUser}
          projectId={projectId}
          onSetSail={handleSetSail}
          sailing={sailing}
        />

        {/* ---------------- mission control ---------------- */}
        <section
          id="profile"
          className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <p className="label-caps text-tide-300/90">Signed in · session live</p>
            <h2 className="mt-2 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
              WELCOME, {name.toUpperCase()}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-gold-400" />
                {profile?.email || authUser?.email}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Firebase Authentication active
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <Sparkles className="h-4 w-4 text-tide-300" />
                {projectId}
              </span>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr]">
            <div>
              <ProfilePoster />
            </div>

            <div className="space-y-6">
              <StatusDeck />
              <ActivityFeed />
            </div>
          </div>
        </section>

        <DatabaseLogSection unlocked={unlocked} onSetSail={handleSetSail} />
        <ExplorerSection />
      </main>

      <Footer />

      <SetSailOverlay open={sailing} onDone={handleSailComplete} />
    </div>
  );
}

function Footer() {
  const { projectId, profile } = useAuth();

  return (
    <footer className="relative border-t border-white/[0.08] bg-abyss-950/70">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-4 py-7 sm:px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <StrawHatMark size={30} />
          <div>
            <p className="font-display text-sm font-bold tracking-[0.18em] text-gold-gradient">
              GRAND LINE DATABASE COMMAND CENTER
            </p>
            <p className="font-techno text-[10px] uppercase tracking-[0.24em] text-slate-500">
              React × Firebase Auth × Cloud Firestore · seminar build
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-slate-400">{projectId}</span>
          </span>
          <span className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[11px] text-slate-400">
            users/{profile?.userId ? `${profile.userId.slice(0, 6)}…` : '…'}
          </span>
        </div>
      </div>
    </footer>
  );
}
