import { useEffect, useState } from 'react';

/** Tracks which section id is currently in view — powers the top nav pill. */
export function useSectionSpy(ids = []) {
  const [active, setActive] = useState(ids[0] || '');

  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === 'undefined') return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        const best = [...visible.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1])[0];
        if (best) setActive(best[0]);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: '-72px 0px -45% 0px' },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids.join('|')]);

  return active;
}

export default useSectionSpy;
