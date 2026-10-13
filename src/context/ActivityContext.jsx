import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const MAX_EVENTS = 60;
let sequence = 0;

export const ActivityContext = createContext(null);

/**
 * Real application event stream.
 * Entries are pushed only when something genuinely happened — an auth call,
 * a Firestore snapshot, a document write — never fabricated for looks.
 */
export function ActivityProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const seen = useRef(new Set());

  const push = useCallback((event) => {
    if (event.dedupeKey) {
      if (seen.current.has(event.dedupeKey)) return;
      seen.current.add(event.dedupeKey);
    }

    const entry = {
      id: `evt_${Date.now()}_${sequence++}`,
      at: new Date(),
      code: event.code || 'SYS',
      message: event.message || 'EVENT',
      detail: event.detail || '',
      tone: event.tone || 'info',
    };

    setEvents((prev) => [entry, ...prev].slice(0, MAX_EVENTS));
    setTotal((count) => count + 1);
  }, []);

  const clear = useCallback(() => {
    seen.current = new Set();
    setEvents([]);
  }, []);

  const value = useMemo(() => ({ events, total, push, clear }), [events, total, push, clear]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used inside <ActivityProvider>');
  return ctx;
}

export default ActivityProvider;
