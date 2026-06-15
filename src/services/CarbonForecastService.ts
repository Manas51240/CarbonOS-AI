import { FootprintLog } from '@/types';

/**
 * Service for projecting future emissions trends and forecasting reductions.
 */
export class CarbonForecastService {
  /**
   * Projects annual and monthly carbon savings from lifestyle adjustments.
   */
  static projectSavings(currentDailyFootprint: number, simulatedDailyFootprint: number) {
    const dailySaving = Math.max(0, currentDailyFootprint - simulatedDailyFootprint);
    const monthlySaving = dailySaving * 30.4;
    const annualSaving = dailySaving * 365;

    return {
      dailySaving,
      monthlySaving,
      annualSaving,
      reductionPotentialPercentage: currentDailyFootprint > 0 
        ? Math.round((dailySaving / currentDailyFootprint) * 100) 
        : 0
    };
  }

  /**
   * Generates a 7-day forecast dataset showing past logs and projected reduction targets.
   */
  static generateTrendData(logs: FootprintLog[], targetDailyLimit = 10.0) {
    // Return last 5 days of actuals plus 3 days of forecast projections
    const actuals = logs.slice(-5).map(log => ({
      date: log.date,
      actual: parseFloat(log.total.toFixed(2)),
      target: targetDailyLimit,
      projected: null as number | null
    }));

    if (actuals.length === 0) return [];

    const lastActual = actuals[actuals.length - 1].actual;
    const forecasts = [];
    const today = new Date();

    for (let i = 1; i <= 3; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dateStr = nextDate.toISOString().split('T')[0];

      // Simulated projection dropping towards target
      const projectedVal = Math.max(
        targetDailyLimit,
        lastActual - (lastActual - targetDailyLimit) * (i / 4)
      );

      forecasts.push({
        date: dateStr,
        actual: null as number | null,
        target: targetDailyLimit,
        projected: parseFloat(projectedVal.toFixed(2))
      });
    }

    return [...actuals, ...forecasts];
  }
}
