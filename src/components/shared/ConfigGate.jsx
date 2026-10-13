import { motion } from 'framer-motion';
import { AlertTriangle, KeyRound, RefreshCw, Terminal } from 'lucide-react';
import { missingConfigKeys } from '../../firebase/config';
import OceanBackdrop from '../background/OceanBackdrop';
import StrawHatMark from './StrawHatMark';

/**
 * Shown instead of the app when the Firebase env vars are missing,
 * so a missing `.env` never produces a blank screen.
 */
export default function ConfigGate() {
  const steps = [
    'Copy .env.example to .env in the project root.',
    'Paste your web app credentials from Firebase Console → Project settings → Your apps.',
    'Restart the dev server (npm run dev).',
  ];

  return (
    <div className="relative min-h-screen">
      <OceanBackdrop />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass panel-edge corner-ticks relative p-6 sm:p-9"
        >
          <div className="flex items-center gap-3">
            <StrawHatMark size={34} />
            <div>
              <p className="label-caps">Pre-flight check failed</p>
              <h1 className="font-display text-xl font-extrabold text-gold-gradient sm:text-2xl">
                Firebase credentials missing
              </h1>
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-ruby-500/40 bg-ruby-600/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-ruby-400" />
            <p className="text-sm leading-relaxed text-slate-300">
              This project talks to a <strong className="text-ruby-300">real</strong> Firebase
              project. Add your keys to <code className="text-gold-300">.env</code> and the
              command center will connect immediately.
            </p>
          </div>

          <ol className="mt-6 space-y-3">
            {steps.map((text, index) => (
              <li key={text} className="flex gap-3 text-sm text-slate-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-gold-400/40 bg-gold-500/10 font-mono text-[11px] text-gold-300">
                  {index + 1}
                </span>
                <span className="pt-0.5">{text}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-xl border border-white/10 bg-abyss-950/70 p-4">
            <div className="flex items-center gap-2 text-tide-300">
              <Terminal className="h-4 w-4" />
              <span className="label-caps text-tide-300/90">Missing environment variables</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {missingConfigKeys.map((key) => (
                <li key={key} className="font-mono text-xs text-gold-300">
                  <KeyRound className="mr-2 inline h-3.5 w-3.5 -translate-y-px" />
                  {key}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-gold" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Re-check configuration
            </button>
            <span className="font-mono text-[11px] text-slate-500">
              src/firebase/config.js reads import.meta.env
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
