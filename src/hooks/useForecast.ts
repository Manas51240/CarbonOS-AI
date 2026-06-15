'use client';

import { useCarbonStore } from './useCarbonStore';
import { CarbonForecastService } from '@/services/CarbonForecastService';

/**
 * Custom hook supplying carbon forecasting models and simulated savings comparisons.
 */
export function useForecast() {
  const { logs } = useCarbonStore();

  const trendData = CarbonForecastService.generateTrendData(logs);

  const getProjectedSavings = (simulatedDailyFootprint: number) => {
    const currentDaily = logs.length > 0 ? logs[logs.length - 1].total : 14.5;
    return CarbonForecastService.projectSavings(currentDaily, simulatedDailyFootprint);
  };

  return {
    trendData,
    getProjectedSavings,
  };
}
