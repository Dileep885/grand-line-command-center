import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Pointer-driven parallax for hero layers.
 * Returns spring-smoothed x/y offsets in pixels.
 */
export function useParallax(strength = 18) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.7 });
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const handleMove = (event) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      rawX.set(((event.clientX - cx) / cx) * strength);
      rawY.set(((event.clientY - cy) / cy) * strength);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [rawX, rawY, strength]);

  return { x, y };
}

export default useParallax;
