'use client';

/**
 * CarbonOS AI - Hook & Provider Re-exports
 */

import { useContext } from 'react';
import { CarbonStoreContext, CarbonStoreContextType, SustainabilityAlert } from '@/context/CarbonStoreContext';

export { CarbonStoreProvider } from '@/components/layout/CarbonStoreProvider';
export type { SustainabilityAlert, CarbonStoreContextType };

/**
 * useCarbonStore Hook
 * Custom hook to consume the carbon Context safely.
 */
export function useCarbonStore() {
  const context = useContext(CarbonStoreContext);
  if (context === undefined) {
    throw new Error('useCarbonStore must be used within a CarbonStoreProvider');
  }
  return context;
}
