import { EMISSION_FACTORS } from '@/constants/emissionFactors';
import { 
  TransportInput, 
  EnergyInput, 
  FoodInput, 
  DigitalInput, 
  WasteInput, 
  CompleteFootprintInput 
} from '@/types';

/**
 * Service for calculating greenhouse gas emissions in kg CO₂e.
 */
export class CarbonCalculationService {
  /**
   * Calculates emissions for transportation commutes.
   */
  static calculateTransport(input: TransportInput): number {
    const { type, distance, fuelOrClass } = input;
    if (distance <= 0) return 0;

    switch (type) {
      case 'car': {
        const fuel = (fuelOrClass || 'gasoline') as keyof typeof EMISSION_FACTORS.car;
        const factor = EMISSION_FACTORS.car[fuel] ?? EMISSION_FACTORS.car.gasoline;
        return distance * factor;
      }
      case 'flight': {
        const seatClass = (fuelOrClass || 'economy') as keyof typeof EMISSION_FACTORS.flight.multipliers;
        const multiplier = EMISSION_FACTORS.flight.multipliers[seatClass] ?? 1.0;
        
        let baseFactor = EMISSION_FACTORS.flight.mediumHaul;
        if (distance < 300) {
          baseFactor = EMISSION_FACTORS.flight.shortHaul;
        } else if (distance > 1500) {
          baseFactor = EMISSION_FACTORS.flight.longHaul;
        }
        
        return distance * baseFactor * multiplier;
      }
      case 'transit': {
        const mode = (fuelOrClass || 'bus') as keyof typeof EMISSION_FACTORS.transit;
        const factor = EMISSION_FACTORS.transit[mode] ?? EMISSION_FACTORS.transit.bus;
        return distance * factor;
      }
      default:
        return 0;
    }
  }

  /**
   * Calculates emissions for home energy usage.
   */
  static calculateEnergy(input: EnergyInput): number {
    const { electricityKwh, gasTherms, cleanEnergyPercentage } = input;
    
    const cleanMultiplier = Math.max(0, Math.min(100, 100 - cleanEnergyPercentage)) / 100;
    const electricityEmissions = electricityKwh * EMISSION_FACTORS.energy.electricityKwh * cleanMultiplier;
    const gasEmissions = gasTherms * EMISSION_FACTORS.energy.gasTherm;
    
    return Math.max(0, electricityEmissions + gasEmissions);
  }

  /**
   * Calculates emissions for food consumption.
   */
  static calculateFood(input: FoodInput): number {
    const { dietType, servingsRedMeat, localFoodPercentage } = input;
    
    const baseEmissions = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.flexitarian;
    const meatEmissions = Math.max(0, servingsRedMeat) * EMISSION_FACTORS.food.redMeatServing;
    
    const localMultiplier = 1 - (Math.max(0, Math.min(100, localFoodPercentage)) / 100) * 0.10;
    
    return (baseEmissions * localMultiplier) + meatEmissions;
  }

  /**
   * Calculates emissions for digital operations.
   */
  static calculateDigital(input: DigitalInput): number {
    const { emailsSent, streamingHours, videoCallsHours, cloudStorageGb } = input;
    
    const emailEmissions = Math.max(0, emailsSent) * EMISSION_FACTORS.digital.email;
    const streamEmissions = Math.max(0, streamingHours) * EMISSION_FACTORS.digital.streamingHour;
    const videoEmissions = Math.max(0, videoCallsHours) * EMISSION_FACTORS.digital.videoCallHour;
    const storageEmissions = Math.max(0, cloudStorageGb) * EMISSION_FACTORS.digital.cloudStorageGbMonth * (1 / 30);
    
    return emailEmissions + streamEmissions + videoEmissions + storageEmissions;
  }

  /**
   * Calculates emissions for waste disposal.
   */
  static calculateWaste(input: WasteInput): number {
    const { landfillLbs, recycledLbs, compostedLbs } = input;
    
    const landfillEmissions = Math.max(0, landfillLbs) * EMISSION_FACTORS.waste.landfill;
    const recyclingSavings = Math.max(0, recycledLbs) * EMISSION_FACTORS.waste.recycledOffset;
    const compostSavings = Math.max(0, compostedLbs) * EMISSION_FACTORS.waste.compostedOffset;
    
    return Math.max(0, landfillEmissions + recyclingSavings + compostSavings);
  }

  /**
   * Aggregates all consumption footprints.
   */
  static calculateTotal(input: CompleteFootprintInput) {
    const transport = input.transport.reduce((sum, item) => sum + this.calculateTransport(item), 0);
    const energy = this.calculateEnergy(input.energy);
    const food = this.calculateFood(input.food);
    const digital = this.calculateDigital(input.digital);
    const waste = this.calculateWaste(input.waste);
    
    return {
      total: transport + energy + food + digital + waste,
      transport,
      energy,
      food,
      digital,
      waste,
    };
  }

  /**
   * Computes index rating (0 - 100).
   */
  static calculateScore(dailyFootprintKg: number): number {
    if (dailyFootprintKg <= 10) return 100;
    if (dailyFootprintKg >= 50) return 0;
    
    const score = 100 - ((dailyFootprintKg - 10) / 40) * 100;
    return Math.round(score);
  }

  /**
   * Categorizes and aggregates carbon emissions from receipt items.
   */
  static calculateReceiptEmissions(items: { carbonCategory: string; carbonEstimateKg: number }[]): {
    food: number;
    energy: number;
    transport: number;
    waste: number;
    digital: number;
  } {
    let food = 0;
    let energy = 0;
    let waste = 0;
    
    items.forEach(item => {
      if (item.carbonCategory.startsWith('food')) {
        food += item.carbonEstimateKg;
      } else if (item.carbonCategory === 'utilities') {
        energy += item.carbonEstimateKg;
      } else {
        waste += item.carbonEstimateKg;
      }
    });

    return {
      food,
      energy,
      transport: 0,
      waste,
      digital: 0,
    };
  }
}
