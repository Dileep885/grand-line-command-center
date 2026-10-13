import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number toward `target` — used for the login counter.
 * Always finishes on the exact target so displayed data stays truthful.
 */
export function useCountUp(target = 0, duration = 900) {
  const value = Number.isFinite(Number(target)) ? Number(target) : 0;
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      fromRef.current = value;
      setDisplay(value);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (value - from) * eased);
      setDisplay(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return display;
}

export default useCountUp;
