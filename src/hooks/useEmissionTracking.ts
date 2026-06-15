'use client';

import { useCarbonStore } from './useCarbonStore';
import { CarbonCalculationService } from '@/services/CarbonCalculationService';
import { CompleteFootprintInput } from '@/types';

/**
 * Custom hook managing lifestyle emissions logs and calculations.
 */
export function useEmissionTracking() {
  const { logs, addLog, loading } = useCarbonStore();

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

  const calculateTotal = (input: CompleteFootprintInput) => {
    return CarbonCalculationService.calculateTotal(input);
  };

  return {
    logs,
    addLog,
    latestLog,
    loading,
    calculateTotal,
  };
}
