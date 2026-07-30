'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type LoadingContextValue = {
  /** True once the preloader has finished and the page may begin animating. */
  ready: boolean;
  setReady: (ready: boolean) => void;
};

const LoadingContext = createContext<LoadingContextValue>({ ready: true, setReady: () => {} });

/**
 * Coordinates the intro sequence.
 *
 * The hero waits on `ready` so its text reveal plays into a visible page rather
 * than behind the preloader. Everything else animates on scroll and is
 * unaffected.
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  return useContext(LoadingContext);
}
