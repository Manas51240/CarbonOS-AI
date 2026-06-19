'use client';

import { useCarbonStore } from './useCarbonStore';
import { useAuth } from './useAuth';
import { SustainabilityCoachService } from '@/services/SustainabilityCoachService';
import { UserProfileService } from '@/services/UserProfileService';

/**
 * Custom hook coordinating grid relief eco-advisories and personalized reduction plans.
 */
export function useSustainabilityInsights() {
  const { alerts, challenges, joinChallenge, completeChallengeProgress } = useCarbonStore();
  const { user, refreshProfile } = useAuth();

  const personalizedPlan = user ? SustainabilityCoachService.getPersonalizedPlan(user) : [];

  const rewardAlertAction = async () => {
    await UserProfileService.rewardUser(50, 4.5);
    await refreshProfile();
  };

  return {
    alerts,
    challenges,
    personalizedPlan,
    joinChallenge,
    completeChallengeProgress,
    rewardAlertAction,
  };
}
