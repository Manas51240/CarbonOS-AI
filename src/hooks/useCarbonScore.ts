'use client';

import { useAuth } from './useAuth';

/**
 * Custom hook providing user carbon index scoring, goals, and offsets.
 */
export function useCarbonScore() {
  const { user } = useAuth();

  const score = user?.sustainabilityScore ?? 70;
  const carbonSavedKg = user?.co2SavedKg ?? 0;
  const points = user?.greenPoints ?? 200;
  
  // IPCC standard daily limit goal (10kg CO2 per day)
  const reductionGoal = 10.0;
  
  return {
    score,
    carbonSavedKg,
    points,
    reductionGoal,
    progressPercentage: score,
  };
}
