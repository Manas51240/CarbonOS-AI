'use client';

import { useCarbonStore } from './useCarbonStore';

/**
 * Custom hook interfacing with marketplace items and point redemptions.
 */
export function useRewards() {
  const { rewards, purchasedRewards, redeemStoreReward, loading } = useCarbonStore();

  return {
    rewards,
    purchasedRewards,
    redeemStoreReward,
    loading,
  };
}
