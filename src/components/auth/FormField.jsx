import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Labeled input used across the auth screen.
 * `type="password"` automatically gets a show/hide toggle.
 */
export default function FormField({
  label,
  icon: Icon,
  type = 'text',
  error,
  hint,
  trailing,
  autoComplete,
  ...props
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (revealed ? 'text' : 'password') : type;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-3">
        <span className="label-caps flex items-center gap-2">
          {Icon ? <Icon className="h-3.5 w-3.5 text-gold-400" /> : null}
          {label}
        </span>
        {hint}
      </span>

      <div
        className={`field-shell ${error ? '!border-ruby-500/70' : ''}`}
        style={error ? { boxShadow: 'inset 0 2px 10px rgba(0,0,0,.45), 0 0 0 3px rgba(230,57,70,.12)' } : undefined}
      >
        <input
          type={resolvedType}
          autoComplete={autoComplete}
          className="field-input"
          aria-invalid={Boolean(error)}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-gold-400/50 hover:text-gold-300"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}

        {trailing}
      </div>

      {error ? (
        <span className="mt-1.5 block font-techno text-xs text-ruby-400">{error}</span>
      ) : null}
    </label>
  );
}
