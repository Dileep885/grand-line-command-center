import { motion } from 'framer-motion';
import ParticleField from '../components/background/ParticleField';
import OceanBackdrop from '../components/background/OceanBackdrop';
import AuthAside from '../components/auth/AuthAside';
import AuthForm from '../components/auth/AuthForm';
import StrawHatMark from '../components/shared/StrawHatMark';

/** Animated authentication screen: email/password, Google, reset, register. */
export default function AuthPage() {
  return (
    <main className="relative min-h-screen">
      <OceanBackdrop />
      <ParticleField density={0.65} />

      {/* mobile brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 top-5 z-10 flex items-center gap-2.5 lg:hidden"
      >
        <StrawHatMark size={30} />
        <div>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-gold-gradient">
            GRAND LINE
          </p>
          <p className="font-techno text-[9px] uppercase tracking-[0.3em] text-tide-300/70">
            Database Command Center
          </p>
        </div>
      </motion.div>

      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
        <AuthAside />

        <section className="relative flex items-center justify-center px-5 pb-12 pt-24 sm:px-10 lg:py-10">
          {/* corner HUD */}
          <div className="pointer-events-none absolute right-6 top-6 hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-tide-400" />
            <span className="font-techno text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Auth gateway online
            </span>
          </div>

          <AuthForm />
        </section>
      </div>
    </main>
  );
}
