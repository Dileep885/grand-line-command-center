# ⚓ Grand Line Database Command Center

A **One Piece–inspired anime command deck** built to demonstrate how a modern
frontend connects to **Firebase Authentication** and **Cloud Firestore** —
for real, with live data, real-time listeners and a cinematic UI.

> React × Vite × Tailwind CSS × Framer Motion × Firebase Auth × Cloud Firestore × Lucide

Original pirate/grand-line artwork (compass rose, straw-hat mark, wanted poster,
ocean backdrop) is drawn from scratch — no official artwork is reproduced.

---

## ✨ What it demonstrates

| Concept | Where |
| --- | --- |
| Email/password + Google authentication | `src/services/authService.js` |
| Registration → Firestore user document | `src/services/userService.js` |
| Auth state listener (`onAuthStateChanged`) | `src/context/AuthContext.jsx` |
| Real-time document stream (`onSnapshot`) | `src/services/userService.js` |
| Protected / public routes | `src/App.jsx` |
| Real application event log | `src/context/ActivityContext.jsx` |
| Animated request pipeline (seminar mode) | `src/components/home/ExplorerSection.jsx` |
| Cinematic `SET SAIL` → `DATABASE LOG UNLOCKED` | `src/components/home/SetSailOverlay.jsx` |

---

## 🚀 Quick start

```bash
npm install          # if dependencies are missing
cp .env.example .env # then paste your Firebase web app keys
npm run dev          # http://localhost:5173
```

### 1. Create the Firebase project

1. [Firebase Console](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Get started** → *Email/Password* **enabled**,
   *Google* **enabled** (add a support email).
3. **Build → Firestore Database → Create database** → start in *test mode*
   for the demo, then apply the rules below.
4. **Project settings → General → Your apps → Web (`</>`)** → copy the config
   object into `.env` (names must match `.env.example`).

### 2. Environment

`src/firebase/config.js` is the **only** file that touches credentials:

```js
const env = import.meta.env;              // VITE_* variables, compiled in
export const isFirebaseConfigured = ...   // guards the whole app
```

If anything is missing the app shows a **pre-flight screen** listing the exact
keys instead of crashing. `.env` is git-ignored.

### 3. Security rules

Firestore must only let an owner touch their own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🗂 Project structure

```
src/
├── components/
│   ├── background/   OceanBackdrop, ParticleField
│   ├── auth/         AuthAside, AuthForm, FormField
│   ├── home/         TopBar, HeroSection, InteractiveCompass, ProfilePoster,
│   │                 StatusDeck, ActivityFeed, DatabaseLogSection,
│   │                 ExplorerSection, SetSailOverlay
│   └── shared/       LoadingScreen, ConfigGate, CompassRose, StrawHatMark
├── context/          AuthContext (listener + actions), ActivityContext (events)
├── firebase/         config.js  ← credentials isolated here
├── hooks/            useAuth, useParallax, useCountUp, useSectionSpy
├── pages/            AuthPage, CommandCenterPage, NotFoundPage
├── services/         authService, userService
└── utils/            errors (Firebase → readable), format (dates, bounty)
```

---

## 🎬 Demo script (for the seminar)

1. **Auth screen** — register with name/email/password (or *Continue with Google*).
2. Watch the **activity feed** fill with real events:
   `AUTH REQUEST SENT → USER AUTHENTICATED → FIRESTORE DOCUMENT FOUND →
   PROFILE LOADED → DATABASE SYNC COMPLETE`.
3. **Dashboard** — wanted poster, connection status, stat tiles: all read from
   `users/{uid}`; the bounty is *computed* from the real `loginCount`.
4. Press **SET SAIL** — cinematic compass sequence, telemetry from the live
   session, then **DATABASE LOG UNLOCKED** and the raw document is revealed.
5. **Database Explorer** → *Run pipeline demo*:
   `USER → REACT FRONTEND → FIREBASE AUTHENTICATION → CLOUD FIRESTORE →
   REAL-TIME DATA → HOME DASHBOARD`, each stage showing the code it executes.
6. Log out and back in — `loginCount` and `lastLogin` change in Firestore.

---

## 🔧 Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | dev server on :5173 |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the production build |

**Windows + Git Bash tip:** if npm reports `'"node"' is not recognized`, run the
scripts from PowerShell/CMD, or from Git Bash use `npm.cmd run dev` — Git Bash
sometimes hands npm a POSIX-style `PATH` that `cmd.exe` cannot read.

---

## 📱 Responsive, accessible, fast

- Breakpoints for mobile / tablet / desktop, mobile drawer nav.
- `prefers-reduced-motion` disables the heavy animation layer.
- Semantic landmarks, focus-visible rings, aria labels, keyboard-operable controls.
- Canvas particles are DPR-aware and capped for performance.
