'use client';

import React from 'react';
import { CarbonStoreContext } from '@/context/CarbonStoreContext';
import { useCarbonStoreState } from '@/hooks/useCarbonStoreState';

/**
 * CarbonStoreProvider
 * Presentational provider wrapper to supply carbon states.
 */
export function CarbonStoreProvider({ children }: { children: React.ReactNode }) {
  const state = useCarbonStoreState();
  return (
    <CarbonStoreContext.Provider value={state}>
      {children}
    </CarbonStoreContext.Provider>
  );
}
