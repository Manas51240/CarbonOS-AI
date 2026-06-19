/**
 * CarbonOS AI - Carbon Calculations Engine Wrapper
 * Aligned with EPA (Environmental Protection Agency) & IPCC Guidelines.
 * Delegates calculations directly to the centralized CarbonCalculationService to enforce DRY compliance.
 */

import { CarbonCalculationService } from '@/services/CarbonCalculationService';
import { EMISSION_FACTORS as MAIN_FACTORS } from '@/constants/emissionFactors';
import { 
  TransportInput, 
  EnergyInput, 
  FoodInput, 
  DigitalInput, 
  WasteInput, 
  CompleteFootprintInput 
} from '@/types';

export type { TransportInput, EnergyInput, FoodInput, DigitalInput, WasteInput, CompleteFootprintInput };

export const EMISSION_FACTORS = MAIN_FACTORS;

/**
 * Calculates Transport Emissions (kg CO2e)
 */
export function calculateTransportEmissions(input: TransportInput): number {
  return CarbonCalculationService.calculateTransport(input);
}

/**
 * Calculates Home Energy Emissions (kg CO2e)
 */
export function calculateEnergyEmissions(input: EnergyInput): number {
  return CarbonCalculationService.calculateEnergy(input);
}

/**
 * Calculates Food/Diet Emissions (kg CO2e)
 */
export function calculateFoodEmissions(input: FoodInput): number {
  return CarbonCalculationService.calculateFood(input);
}

/**
 * Calculates Digital Footprint Emissions (kg CO2e)
 */
export function calculateDigitalEmissions(input: DigitalInput): number {
  return CarbonCalculationService.calculateDigital(input);
}

/**
 * Calculates Waste emissions (kg CO2e)
 */
export function calculateWasteEmissions(input: WasteInput): number {
  return CarbonCalculationService.calculateWaste(input);
}

/**
 * Aggregates all daily emissions into a single total footprint (kg CO2e)
 */
export function calculateTotalDailyFootprint(input: CompleteFootprintInput): {
  total: number;
  transport: number;
  energy: number;
  food: number;
  digital: number;
  waste: number;
} {
  return CarbonCalculationService.calculateTotal(input);
}

/**
 * Returns user sustainability score (0 - 100) based on emissions and offsets.
 */
export function calculateSustainabilityScore(dailyFootprintKg: number): number {
  return CarbonCalculationService.calculateScore(dailyFootprintKg);
}
