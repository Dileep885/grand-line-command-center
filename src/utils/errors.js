/** Maps Firebase error codes to readable, on-theme messages. */
const FALLBACK =
  'Something went wrong while sailing. Please try again.';

const AUTH_ERRORS = {
  'auth/invalid-api-key': 'The API key in .env is not valid — check your Firebase web config.',
  'auth/api-key-not-valid': 'The API key in .env is not valid — check your Firebase web config.',
  'auth/missing-api-key': 'No API key found. Copy .env.example to .env and fill it in.',
  'auth/invalid-app-credential':
    'Firebase could not verify this app credential — check your config and authorized domains.',
  'auth/internal-error':
    'Firebase returned an internal error — check your config, then try again.',
  'auth/invalid-email': 'That email bearing is not valid, captain.',
  'auth/user-disabled': 'This account has been barred from the Grand Line.',
  'auth/user-not-found': 'No navigator found sailing under that email.',
  'auth/wrong-password': 'Incorrect password — try again, pirate.',
  'auth/invalid-credential': 'Email and password do not match the ship’s logbook.',
  'auth/email-already-in-use': 'A crew member already sails under that email.',
  'auth/weak-password': 'Password too weak — needs at least 6 characters.',
  'auth/operation-not-allowed':
    'This login method is disabled — enable Email/Password (and Google) in Firebase Authentication.',
  'auth/too-many-requests': 'Too many attempts. Take a breather, then try again.',
  'auth/network-request-failed':
    'The sea is calm but the network is not. Check your connection.',
  'auth/popup-closed-by-user': 'The Google logbook closed before finishing. Try once more.',
  'auth/cancelled-popup-request': 'Another sign-in window is already open.',
  'auth/popup-blocked': 'Your browser blocked the Google pop-up. Allow pop-ups and retry.',
  'auth/unauthorized-domain':
    'This domain is not whitelisted — add it under Authentication → Settings → Authorized domains.',
  'auth/requires-recent-login': 'Please sign in again to confirm this action.',
  'auth/quota-exceeded': 'Firebase auth quota reached. Try again shortly.',
  'permission-denied': 'Firestore rules denied this read. Check your security rules.',
  unavailable: 'Cloud Firestore is unreachable right now. Retrying…',
  'failed-precondition': 'Firestore needs a moment — please retry.',
  unauthenticated: 'Firestore requires a signed-in session for this request.',
  'resource-exhausted': 'Firestore quota is exhausted — try again shortly.',
};

/**
 * Firebase messages look like `Firebase: Error (auth/some-code).` — pull the
 * code out tolerantly (trailing punctuation inside the parens is common).
 */
const extractCode = (text = '') => {
  const match = String(text).match(/(auth|firestore|storage)\/[a-z0-9][a-z0-9-]*/i);
  if (!match) return '';
  return match[0].replace(/[.\s]+$/g, '').toLowerCase();
};

/** Finds the most specific known mapping for a code (exact, then prefix). */
const lookup = (code) => {
  if (!code) return null;
  if (AUTH_ERRORS[code]) return AUTH_ERRORS[code];
  const keys = Object.keys(AUTH_ERRORS).sort((a, b) => b.length - a.length);
  const hit = keys.find((key) => code.startsWith(key) || code.includes(key));
  return hit ? AUTH_ERRORS[hit] : null;
};

/** True when a message carries no useful information (e.g. "Error ."). */
const isDegenerate = (message = '') => {
  const clean = message.replace(/[.\s]+$/g, '').trim();
  return !clean || /^(error|failed|exception|unknown error)$/i.test(clean);
};

/** Returns a human message for any thrown Firebase (or plain) error. */
export const readableError = (error) => {
  if (!error) return FALLBACK;

  const isString = typeof error === 'string';
  const raw = isString ? error : error?.message || String(error);
  const code = (isString ? '' : error?.code) || extractCode(raw);

  const mapped = lookup(code);
  if (mapped) return mapped;

  const clean = String(raw)
    .replace(/^Firebase:\s*/i, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[.\s]+$/g, '')
    .trim();

  if (!isDegenerate(clean)) return clean;
  if (code) return `Firebase rejected the request (${code}) — check the console for details.`;
  return FALLBACK;
};

export default readableError;
