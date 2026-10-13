import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FIREBASE_PROJECT,
  isFirebaseConfigured,
  missingConfigKeys,
} from '../firebase/config';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { readableError } from '../utils/errors';
import { shortId } from '../utils/format';
import { useActivity } from './ActivityContext';

export const AuthContext = createContext(null);

const INITIAL_SESSION = {
  status: 'initializing', // initializing | authenticated | anonymous | unconfigured | error
  authUser: null,
  profile: null,
  profileId: null,
  error: null,
};

/**
 * Owns the Firebase auth state listener and the real-time Firestore
 * subscription for the signed-in user. Every dashboard value flows from here.
 */
export function AuthProvider({ children }) {
  const { push } = useActivity();
  const [session, setSession] = useState(INITIAL_SESSION);
  const [authStatus, setAuthStatus] = useState('connecting'); // connecting | authenticated | anonymous | error
  const [firestoreStatus, setFirestoreStatus] = useState('idle'); // idle | connecting | connected | cached | error
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notice, setNotice] = useState(null);

  const profileUnsubscribe = useRef(null);
  const authUnsubscribe = useRef(null);
  const authUserRef = useRef(null);
  const docState = useRef({ seen: false, lastData: null });

  const clearFormState = () => {
    setFormError(null);
    setNotice(null);
  };

  const unsubscribeProfile = useCallback(() => {
    if (profileUnsubscribe.current) {
      profileUnsubscribe.current();
      profileUnsubscribe.current = null;
    }
  }, []);

  /* ------------------------------------------------------------------ *
   * Real-time Firestore subscription on `users/{uid}`
   * ------------------------------------------------------------------ */
  const subscribeProfile = useCallback(
    (uid) => {
      unsubscribeProfile();
      setFirestoreStatus('connecting');
      push({
        code: 'REQ',
        message: 'FIRESTORE LISTENER ATTACHED',
        detail: `onSnapshot(users/${shortId(uid)})`,
        tone: 'info',
        dedupeKey: `attach_${uid}`,
      });

      docState.current = { seen: false, lastData: null };

      profileUnsubscribe.current = userService.subscribeToUserDocument(uid, {
        onData: ({ exists, id, data, fromCache }) => {
          if (!exists) {
            // Safety net: the auth listener creates the document on first sign-in.
            if (authUserRef.current) {
              userService.ensureUserDocument(authUserRef.current).catch((error) =>
                push({
                  code: 'ERR',
                  message: 'DOCUMENT CREATE FAILED',
                  detail: readableError(error),
                  tone: 'err',
                }),
              );
            }
            return;
          }

          setFirestoreStatus(fromCache ? 'cached' : 'connected');

          if (!docState.current.seen) {
            docState.current = { seen: true, lastData: data };
            push({
              code: 'OK',
              message: 'FIRESTORE DOCUMENT FOUND',
              detail: `doc id: ${id}`,
              tone: 'ok',
              dedupeKey: 'doc_found',
            });
            push({
              code: 'OK',
              message: 'PROFILE LOADED',
              detail: `${data.fullName} · ${data.role}`,
              tone: 'ok',
              dedupeKey: 'profile_loaded',
            });
            push({
              code: 'SYS',
              message: 'DATABASE SYNC COMPLETE',
              detail: fromCache ? 'snapshot served from cache' : 'live snapshot stream active',
              tone: 'info',
              dedupeKey: 'first_sync',
            });
          } else {
            const changed = userService.diffFields(docState.current.lastData, data);
            if (changed.length) {
              docState.current.lastData = data;
              push({
                code: 'OK',
                message: 'DATABASE SYNC COMPLETE',
                detail: `updated field(s): ${changed.join(', ')}`,
                tone: 'ok',
              });
            } else {
              docState.current.lastData = data;
            }
          }

          setSession((prev) => ({ ...prev, profile: data, profileId: id }));
        },
        onError: (error) => {
          setFirestoreStatus('error');
          push({
            code: 'ERR',
            message: 'FIRESTORE LISTENER ERROR',
            detail: readableError(error),
            tone: 'err',
          });
        },
      });
    },
    [push, unsubscribeProfile],
  );

  /* ------------------------------------------------------------------ *
   * Firebase auth state listener (mounted once)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setSession((prev) => ({ ...prev, status: 'unconfigured' }));
      setAuthStatus('error');
      push({
        code: 'ERR',
        message: 'FIREBASE NOT CONFIGURED',
        detail: `missing ${missingConfigKeys.length} env var(s)`,
        tone: 'err',
      });
      return undefined;
    }

    push({
      code: 'SYS',
      message: 'FIREBASE SDK INITIALIZED',
      detail: `project: ${FIREBASE_PROJECT}`,
      tone: 'info',
      dedupeKey: 'sdk_init',
    });

    authUnsubscribe.current = authService.observeAuth(
      async (user) => {
        const previous = authUserRef.current;
        authUserRef.current = user;
        unsubscribeProfile();

        if (!user) {
          docState.current = { seen: false, lastData: null };
          setSession({
            status: 'anonymous',
            authUser: null,
            profile: null,
            profileId: null,
            error: null,
          });
          setAuthStatus('anonymous');
          setFirestoreStatus('idle');
          if (previous) {
            push({
              code: 'SYS',
              message: 'SESSION CLOSED',
              detail: 'onAuthStateChanged → null',
              tone: 'info',
            });
          }
          return;
        }

        setAuthStatus('authenticated');
        setSession((prev) => ({ ...prev, status: 'authenticated', authUser: user }));

        if (!previous) {
          push({
            code: 'SYS',
            message: user.metadata.creationTime === user.metadata.lastSignInTime
              ? 'ACCOUNT CREATED'
              : 'SESSION RESTORED',
            detail: 'auth persistence verified',
            tone: 'info',
          });
        }

        push({
          code: 'OK',
          message: 'USER AUTHENTICATED',
          detail: `${user.providerData?.[0]?.providerId || 'password'} · ${shortId(user.uid)}`,
          tone: 'ok',
        });

        // Create / verify / increment the Firestore document for this sign-in.
        try {
          await userService.syncUserDocument(user);
        } catch (error) {
          push({
            code: 'ERR',
            message: 'DOCUMENT SYNC FAILED',
            detail: readableError(error),
            tone: 'err',
          });
        }

        subscribeProfile(user.uid);
      },
      (error) => {
        setAuthStatus('error');
        setSession((prev) => ({ ...prev, status: 'error', error }));
        push({
          code: 'ERR',
          message: 'AUTH LISTENER ERROR',
          detail: readableError(error),
          tone: 'err',
        });
      },
    );

    return () => {
      authUnsubscribe.current?.();
      unsubscribeProfile();
    };
  }, [push, subscribeProfile, unsubscribeProfile]);

  /* ------------------------------------------------------------------ *
   * Auth actions
   * ------------------------------------------------------------------ */
  const runAuthAction = useCallback(
    async (label, request, onSuccess) => {
      clearFormState();
      setBusy(true);
      push({ code: 'REQ', message: 'AUTH REQUEST SENT', detail: label, tone: 'info' });
      try {
        const result = await request();
        onSuccess?.(result);
        return { ok: true, data: result };
      } catch (error) {
        const message = readableError(error);
        setFormError(message);
        push({ code: 'ERR', message: 'AUTH REQUEST FAILED', detail: message, tone: 'err' });
        return { ok: false, error: message };
      } finally {
        setBusy(false);
      }
    },
    [push],
  );

  const signUp = useCallback(
    ({ fullName, email, password, photoURL }) =>
      runAuthAction(
        'createUserWithEmailAndPassword()',
        () => authService.registerAccount({ fullName, email, password, photoURL }),
        () =>
          setNotice(`Crew registry complete. Welcome aboard, ${fullName.split(' ')[0]}!`),
      ),
    [runAuthAction],
  );

  const signIn = useCallback(
    ({ email, password }) =>
      runAuthAction('signInWithEmailAndPassword()', () =>
        authService.signInAccount({ email, password }),
      ),
    [runAuthAction],
  );

  const signInWithGoogle = useCallback(
    () => runAuthAction('signInWithPopup(auth, googleProvider)', authService.signInWithGoogleAccount),
    [runAuthAction],
  );

  const resetPassword = useCallback(
    (email) =>
      runAuthAction('sendPasswordResetEmail()', () => authService.sendResetLink(email), () =>
        setNotice('A course chart (reset link) was sent to your inbox.'),
      ),
    [runAuthAction],
  );

  const logOut = useCallback(async () => {
    clearFormState();
    push({ code: 'REQ', message: 'SIGN-OUT REQUEST', detail: 'signOut(auth)', tone: 'info' });
    try {
      await authService.signOutAccount();
      return { ok: true };
    } catch (error) {
      const message = readableError(error);
      setFormError(message);
      push({ code: 'ERR', message: 'SIGN-OUT FAILED', detail: message, tone: 'err' });
      return { ok: false, error: message };
    }
  }, [push]);

  const value = useMemo(
    () => ({
      status: session.status,
      authUser: session.authUser,
      profile: session.profile,
      profileId: session.profileId,
      sessionError: session.error,
      authStatus,
      firestoreStatus,
      busy,
      formError,
      notice,
      isConfigured: isFirebaseConfigured,
      projectId: FIREBASE_PROJECT,
      missingKeys: missingConfigKeys,
      clearFormState,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      logOut,
    }),
    [
      session,
      authStatus,
      firestoreStatus,
      busy,
      formError,
      notice,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      logOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
