'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook. Returns `false` on the server and during the first
 * client render, then settles to the real value — so nothing that depends on it
 * can cause a hydration mismatch.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** True on devices with a precise pointer — where hover and cursor effects belong. */
export function useHasPointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
