'use client';

import { useEffect, useState } from 'react';

/** True once the component has committed on the client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
