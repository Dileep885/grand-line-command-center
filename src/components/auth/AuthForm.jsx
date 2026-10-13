import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Compass,
  ImagePlus,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FormField from './FormField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TABS = [
  { id: 'signin', label: 'Sign in' },
  { id: 'signup', label: 'Create account' },
  { id: 'forgot', label: 'Reset' },
];

const EMPTY = {
  fullName: '',
  email: '',
  password: '',
  confirm: '',
  photoURL: '',
};

function validate(mode, values) {
  const errors = {};

  if (mode !== 'signin' && values.fullName.trim().length < 2) {
    errors.fullName = 'Tell us the name on your bounty poster.';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'That email bearing is not valid.';
  }

  if (mode !== 'forgot') {
    if (!values.password) {
      errors.password = 'Password is required.';
    } else if (values.password.length < 6) {
      errors.password = 'Firebase requires at least 6 characters.';
    }
  }

  if (mode === 'signup' && values.confirm !== values.password) {
    errors.confirm = 'Passwords do not match, captain.';
  }

  if (mode === 'signup' && values.photoURL && !/^https?:\/\//i.test(values.photoURL.trim())) {
    errors.photoURL = 'Must be a full http(s) image URL.';
  }

  return errors;
}

function strengthOf(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^\w\s]/.test(password)) score += 1;
  return score;
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Fair', 'Strong', 'Legendary'];

export default function AuthForm() {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    busy,
    formError,
    notice,
    clearFormState,
    projectId,
    isConfigured,
  } = useAuth();

  const [mode, setMode] = useState('signin');
  const [values, setValues] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});

  const strength = useMemo(() => strengthOf(values.password), [values.password]);

  const setField = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const switchMode = (next) => {
    setMode(next);
    setFieldErrors({});
    clearFormState();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate(mode, values);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    if (mode === 'signin') {
      await signIn({ email: values.email.trim(), password: values.password });
    } else if (mode === 'signup') {
      await signUp({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        photoURL: values.photoURL.trim(),
      });
    } else {
      await resetPassword(values.email.trim());
    }
  };

  const isReset = mode === 'forgot';
  const isSignup = mode === 'signup';

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.97, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong panel-edge corner-ticks relative w-full max-w-[440px] overflow-hidden p-6 sm:p-8"
    >
      {/* mode tabs */}
      <div className="relative flex rounded-xl border border-white/10 bg-abyss-950/60 p-1">
        {TABS.map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchMode(tab.id)}
              className={`relative flex-1 rounded-lg px-2 py-2 font-techno text-[11px] font-semibold uppercase tracking-[0.14em] transition sm:text-xs ${
                active ? 'text-abyss-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="auth-tab"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-gradient-to-b from-gold-300 to-gold-500"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* headline */}
      <div className="mt-7">
        <p className="label-caps text-gold-400/90">
          {isReset ? 'Recover your bearing' : isSignup ? 'Enlist with the fleet' : 'Welcome aboard'}
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-bold text-gold-gradient sm:text-[27px]">
          {isReset ? 'LOST THE MAP?' : isSignup ? 'JOIN THE CREW' : 'BOARD THE SHIP'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {isReset
            ? 'Enter your email and Firebase will send a reset link.'
            : isSignup
              ? 'Register once — a Firestore profile is created for you instantly.'
              : 'Authenticate with Firebase to unlock the command deck.'}
        </p>
      </div>

      {/* alerts */}
      <AnimatePresence mode="wait">
        {formError ? (
          <motion.div
            key={`err-${formError}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.42 }}
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-ruby-500/45 bg-ruby-600/15 p-3.5"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ruby-400" />
            <span className="text-[13px] leading-snug text-ruby-200">{formError}</span>
          </motion.div>
        ) : notice ? (
          <motion.div
            key={`notice-${notice}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-400/35 bg-emerald-500/10 p-3.5"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-[13px] leading-snug text-emerald-200">{notice}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.24 }}
            className="space-y-4"
          >
            {isSignup && (
              <FormField
                label="Full name"
                icon={User}
                placeholder="e.g. Marina Okafor"
                value={values.fullName}
                onChange={setField('fullName')}
                error={fieldErrors.fullName}
                autoComplete="name"
              />
            )}

            <FormField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="captain@strawhat.io"
              value={values.email}
              onChange={setField('email')}
              error={fieldErrors.email}
              autoComplete="email"
            />

            {!isReset && (
              <div>
                <FormField
                  label="Password"
                  icon={Lock}
                  type="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={setField('password')}
                  error={fieldErrors.password}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />

                {isSignup && values.password && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex flex-1 gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.span
                          key={i}
                          animate={{
                            backgroundColor:
                              i < strength
                                ? ['#e63946', '#f2b530', '#38bdf8', '#34d399'][strength - 1]
                                : 'rgba(255,255,255,0.10)',
                          }}
                          className="h-1 flex-1 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="font-techno text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      {STRENGTH_LABEL[strength]}
                    </span>
                  </div>
                )}
              </div>
            )}

            {isSignup && (
              <>
                <FormField
                  label="Confirm password"
                  icon={KeyRound}
                  type="password"
                  placeholder="••••••••"
                  value={values.confirm}
                  onChange={setField('confirm')}
                  error={fieldErrors.confirm}
                  autoComplete="new-password"
                />
                <FormField
                  label="Profile image (optional)"
                  icon={ImagePlus}
                  placeholder="https://…/avatar.png"
                  value={values.photoURL}
                  onChange={setField('photoURL')}
                  error={fieldErrors.photoURL}
                  hint={
                    values.photoURL && !fieldErrors.photoURL ? (
                      <img
                        src={values.photoURL}
                        alt=""
                        className="h-6 w-6 rounded-full border border-gold-400/50 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null
                  }
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {!isSignup && !isReset && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="link-underline font-techno text-xs uppercase tracking-[0.16em] text-tide-300 hover:text-tide-200"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-gold w-full !py-3.5">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isReset ? 'Sending chart…' : 'Signing the logbook…'}
            </>
          ) : (
            <>
              {isReset ? 'Send reset link' : isSignup ? 'Create account' : 'Login'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* divider */}
      {!isReset && (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
            <span className="font-techno text-[10px] uppercase tracking-[0.3em] text-slate-500">
              or sail with
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
            className="btn w-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm text-slate-100 backdrop-blur-md transition hover:border-tide-400/60 hover:bg-white/[0.1] hover:shadow-glow-ocean disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleGlyph />
            )}
            Continue with Google
          </button>
        </>
      )}

      {/* switch mode */}
      <p className="mt-6 text-center text-[13px] text-slate-400">
        {isReset ? (
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="link-underline text-gold-300 hover:text-gold-200"
          >
            Back to sign in
          </button>
        ) : isSignup ? (
          <>
            Already sailing with us?{' '}
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="link-underline font-semibold text-gold-300 hover:text-gold-200"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New to the fleet?{' '}
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="link-underline font-semibold text-gold-300 hover:text-gold-200"
            >
              Create an account
            </button>
          </>
        )}
      </p>

      {/* real connection footer */}
      <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.08] pt-4">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isConfigured ? 'bg-emerald-400 animate-blink' : 'bg-ruby-500'
          }`}
        />
        <span className="font-mono text-[10px] tracking-wide text-slate-500">
          firebase · {projectId}
        </span>
        <Compass className="h-3 w-3 text-gold-400/70" />
      </div>
    </motion.div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.65h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.26a12 12 0 0 0 0 10.78l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
