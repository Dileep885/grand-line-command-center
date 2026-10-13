import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { setAuthIntent, setPendingProfile } from './userService';

/** Single auth-state listener used by the AuthContext. */
export function observeAuth(onUser, onError) {
  return onAuthStateChanged(auth, onUser, onError);
}

/** Email + password registration, then a matching Firestore document. */
export async function registerAccount({ fullName, email, password, photoURL }) {
  setPendingProfile({ fullName, photoURL: photoURL || null });
  setAuthIntent('register');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, {
    displayName: fullName,
    ...(photoURL ? { photoURL } : {}),
  });
  return credential.user;
}

/** Email + password sign-in. The login is recorded by the auth listener. */
export async function signInAccount({ email, password }) {
  setAuthIntent('login');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Google sign-in through a Firebase popup. */
export async function signInWithGoogleAccount() {
  setPendingProfile(null);
  setAuthIntent('google');
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

/** Password reset email — handled entirely by Firebase Auth. */
export function sendResetLink(email) {
  return sendPasswordResetEmail(auth, email);
}

/** Signs the navigator out; the auth listener clears the session. */
export function signOutAccount() {
  setAuthIntent(null);
  return signOut(auth);
}

/** Google provider label shown in the UI. */
export const GOOGLE_LABEL = 'Google';
