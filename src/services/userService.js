import {
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

/** `users` collection reference — the single collection this app owns. */
export const usersCollection = () => collection(db, 'users');
export const userDocRef = (uid) => doc(db, 'users', uid);

/**
 * Profile payloads can arrive before Firebase has synced `displayName`
 * (registration updates the profile right after the account is created),
 * so we stash them here for the very first document write.
 */
const pendingProfile = { current: null };

/** Intent of the auth operation currently in flight — see `consumeIntent`. */
const intent = { current: null };

export const setPendingProfile = (value) => {
  pendingProfile.current = value;
};

export const setAuthIntent = (value) => {
  intent.current = value;
};

export const consumeIntent = () => {
  const value = intent.current;
  intent.current = null;
  return value;
};

const takePendingProfile = () => {
  const value = pendingProfile.current;
  pendingProfile.current = null;
  return value;
};

const localPart = (email = '') => (email.split('@')[0] || 'navigator').slice(0, 24);

/** Role escalates with real activity — never faked. */
const roleFor = (loginCount, provider) => {
  if (loginCount >= 10) return 'captain';
  return provider === 'google.com' ? 'quartermaster' : 'navigator';
};

const providerOf = (authUser) =>
  authUser?.providerData?.[0]?.providerId || 'password';

/** Builds the `users/{uid}` document described by the project spec. */
export const buildUserDocument = (authUser, { fullName, photoURL, loginCount = 1 } = {}) => {
  const now = Date.now();
  const provider = providerOf(authUser);
  const name =
    fullName ||
    authUser?.displayName ||
    pendingProfile.current?.fullName ||
    localPart(authUser?.email || '');

  return {
    userId: authUser.uid,
    fullName: name,
    email: authUser.email || '',
    photoURL: photoURL || authUser.photoURL || null,
    provider,
    role: roleFor(loginCount, provider),
    loginCount,
    createdAt: serverTimestamp(),
    createdAtMs: now,
    lastLogin: serverTimestamp(),
    lastLoginMs: now,
    updatedAt: serverTimestamp(),
  };
};

/** Reads the authenticated user's document once. Returns null when missing. */
export async function readUserDocument(uid) {
  const snap = await getDoc(userDocRef(uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Creates the user document when it does not exist yet.
 * Called from the auth state listener, so it is safe to run repeatedly.
 */
export async function ensureUserDocument(authUser) {
  const ref = userDocRef(authUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { created: false, id: snap.id, data: snap.data() };

  const stash = takePendingProfile();
  await setDoc(ref, buildUserDocument(authUser, stash || {}));
  const fresh = await getDoc(ref);
  return { created: true, id: fresh.id, data: fresh.data() };
}

/**
 * Runs on every authentication state change:
 * - first ever sign-in  -> creates the document (loginCount = 1)
 * - explicit sign-in    -> records a real login (lastLogin + loginCount++)
 * - session restore     -> verifies the document without inflating the count
 */
export async function syncUserDocument(authUser) {
  const intentUsed = consumeIntent();
  const ref = userDocRef(authUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const stash = takePendingProfile();
    const payload = buildUserDocument(authUser, stash || {});
    await setDoc(ref, payload);
    return { action: 'created', intent: intentUsed, loginCount: 1 };
  }

  // Restored session: no new login happened, just confirm the document.
  if (!intentUsed || intentUsed === 'register') {
    return { action: 'verified', intent: intentUsed, loginCount: snap.data().loginCount ?? 1 };
  }

  const data = snap.data();
  const loginCount = (Number(data.loginCount) || 0) + 1;
  const provider = providerOf(authUser);

  const patch = {
    lastLogin: serverTimestamp(),
    lastLoginMs: Date.now(),
    loginCount,
    updatedAt: serverTimestamp(),
  };

  // Keep derived fields honest when the Firebase profile changes upstream.
  if (authUser.email && authUser.email !== data.email) patch.email = authUser.email;
  if (authUser.displayName && authUser.displayName !== data.fullName)
    patch.fullName = authUser.displayName;
  if (authUser.photoURL && authUser.photoURL !== data.photoURL) patch.photoURL = authUser.photoURL;
  if (data.provider !== provider) patch.provider = provider;

  const nextRole = roleFor(loginCount, provider);
  if (nextRole !== data.role) patch.role = nextRole;

  await updateDoc(ref, patch);
  return { action: 'login-recorded', intent: intentUsed, loginCount };
}

/**
 * Real-time listener on the user's document.
 * Every UI field on the dashboard comes from this stream — nothing is faked.
 */
export function subscribeToUserDocument(uid, { onData, onError } = {}) {
  return onSnapshot(
    userDocRef(uid),
    (snap) => {
      onData?.({
        exists: snap.exists(),
        id: snap.id,
        data: snap.exists() ? snap.data() : null,
        fromCache: snap.metadata.fromCache,
        hasPendingWrites: snap.metadata.hasPendingWrites,
      });
    },
    (error) => onError?.(error),
  );
}

/** Local field diff used to describe real sync events in the activity feed. */
export function diffFields(previous, next) {
  if (!previous || !next) return Object.keys(next || {});
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
  return [...keys].filter((key) => JSON.stringify(previous[key]) !== JSON.stringify(next[key]));
}
