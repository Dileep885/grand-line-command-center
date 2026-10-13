/**
 * Firebase configuration — isolated in its own module.
 *
 * Every credential is read from an environment variable so no key material is
 * ever hard-coded into source control. Copy `.env.example` to `.env` and fill
 * in your own Firebase web app credentials.
 *
 * Note: VITE_* variables are compiled into the client bundle by design —
 * Firebase web security comes from Authentication + Firestore Rules,
 * never from hiding these values.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

/** True when every required credential is present in the environment. */
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0,
);

/** Names of the missing keys — surfaced in the UI setup banner. */
export const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !(typeof value === 'string' && value.trim().length > 0))
  .map(([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  // getAuth already uses browser-local persistence by default, so a refresh
  // keeps the navigator aboard without an extra round trip.
  auth = getAuth(app);
  db = getFirestore(app);
}

/** Signed-in user provider used by Google sign-in. */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };

/** Human label for the active auth connection — used by status chips. */
export const FIREBASE_PROJECT = firebaseConfig.projectId || 'not-configured';
