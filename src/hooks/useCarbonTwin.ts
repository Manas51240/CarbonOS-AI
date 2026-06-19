'use client';

import { useCarbonStore } from './useCarbonStore';
import { useAuth } from './useAuth';
import { UserProfileService } from '@/services/UserProfileService';

interface CommitTwinParams {
  diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
  transportMode: 'electric' | 'hybrid' | 'gasoline' | 'diesel';
  commuteDistance: number;
  homeEnergy: '100-solar' | 'partial-solar' | 'grid-mix';
  digitalUsage: 'low' | 'average' | 'high';
}

/**
 * Custom hook managing simulator twin variables and baseline configurations.
 */
export function useCarbonTwin() {
  const { twinSimState, updateTwinSim } = useCarbonStore();
  const { refreshProfile } = useAuth();

  const commitTwinSettings = async (params: CommitTwinParams) => {
    updateTwinSim({
      dietType: params.diet,
      dailyCommuteMiles: params.commuteDistance,
      carFuel: params.transportMode,
      homeEnergySource: params.homeEnergy,
      digitalUsageLevel: params.digitalUsage
    });

    await UserProfileService.updateCarbonTwin(params);
    await refreshProfile();
  };

  return {
    twinSimState,
    updateTwinSim,
    commitTwinSettings
  };
}
