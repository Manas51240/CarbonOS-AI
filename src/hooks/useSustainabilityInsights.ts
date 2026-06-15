'use client';

import { useCarbonStore } from './useCarbonStore';
import { useAuth } from './useAuth';
import { SustainabilityCoachService } from '@/services/SustainabilityCoachService';

/**
 * Custom hook coordinating grid relief eco-advisories and personalized reduction plans.
 */
export function useSustainabilityInsights() {
  const { alerts, challenges, joinChallenge, completeChallengeProgress } = useCarbonStore();
  const { user } = useAuth();

  const personalizedPlan = user ? SustainabilityCoachService.getPersonalizedPlan(user) : [];

  return {
    alerts,
    challenges,
    personalizedPlan,
    joinChallenge,
    completeChallengeProgress,
  };
}
