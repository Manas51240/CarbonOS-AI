'use client';

import { useCarbonStore } from './useCarbonStore';

/**
 * Custom hook managing simulator twin variables and baseline configurations.
 */
export function useCarbonTwin() {
  const { twinSimState, updateTwinSim } = useCarbonStore();

  return {
    twinSimState,
    updateTwinSim,
  };
}
