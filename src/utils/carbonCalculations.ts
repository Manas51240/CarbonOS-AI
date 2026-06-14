/**
 * CarbonOS AI - Carbon Calculations Engine
 * Aligned with EPA (Environmental Protection Agency) & IPCC Guidelines.
 */

export interface TransportInput {
  type: 'car' | 'flight' | 'transit';
  distance: number; // in miles
  fuelOrClass?: string; // car: 'gasoline' | 'diesel' | 'hybrid' | 'electric'; flight: 'economy' | 'business' | 'first'; transit: 'bus' | 'train'
}

export interface EnergyInput {
  electricityKwh: number;
  gasTherms: number;
  cleanEnergyPercentage: number; // 0 to 100
}

export interface FoodInput {
  dietType: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
  servingsRedMeat: number;
  localFoodPercentage: number; // 0 to 100
}

export interface DigitalInput {
  emailsSent: number;
  streamingHours: number;
  videoCallsHours: number;
  cloudStorageGb: number;
}

export interface WasteInput {
  landfillLbs: number;
  recycledLbs: number;
  compostedLbs: number;
}

// Constants for emission factors (in kg CO2e)
export const EMISSION_FACTORS = {
  // Transport factors per mile
  car: {
    gasoline: 0.404,
    diesel: 0.411,
    hybrid: 0.198,
    electric: 0.082, // grid average equivalent
  },
  flight: {
    shortHaul: 0.254, // < 300 miles
    mediumHaul: 0.187, // 300 - 1500 miles
    longHaul: 0.165, // > 1500 miles
    multipliers: {
      economy: 1.0,
      business: 2.9,
      first: 4.0,
    },
  },
  transit: {
    bus: 0.089,
    train: 0.041,
  },

  // Home energy factors
  energy: {
    electricityKwh: 0.371, // average US grid factor
    gasTherm: 5.302, // 5.3 kg CO2 per therm
  },

  // Food daily base factors (kg CO2e per day)
  food: {
    vegan: 1.5,
    vegetarian: 1.7,
    flexitarian: 2.5,
    'meat-heavy': 3.3,
    redMeatServing: 4.5, // per serving (approx. 4oz)
  },

  // Digital factors (kg CO2e)
  digital: {
    email: 0.004, // average email
    streamingHour: 0.036, // HD streaming
    videoCallHour: 0.150, // standard group video call
    cloudStorageGbMonth: 0.007, // per GB per month (approx. 0.00023 per day)
  },

  // Waste factors per lb
  waste: {
    landfill: 0.453, // 0.453 kg CO2e per lb
    recycledOffset: -0.25, // offset/saving per lb recycled
    compostedOffset: -0.20, // offset/saving per lb composted
  },
};

/**
 * Calculates Transport Emissions (kg CO2e)
 */
export function calculateTransportEmissions(input: TransportInput): number {
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
 * Calculates Home Energy Emissions (kg CO2e)
 */
export function calculateEnergyEmissions(input: EnergyInput): number {
  const { electricityKwh, gasTherms, cleanEnergyPercentage } = input;
  
  const cleanMultiplier = Math.max(0, Math.min(100, 100 - cleanEnergyPercentage)) / 100;
  const electricityEmissions = electricityKwh * EMISSION_FACTORS.energy.electricityKwh * cleanMultiplier;
  const gasEmissions = gasTherms * EMISSION_FACTORS.energy.gasTherm;
  
  return Math.max(0, electricityEmissions + gasEmissions);
}

/**
 * Calculates Food/Diet Emissions (kg CO2e)
 */
export function calculateFoodEmissions(input: FoodInput): number {
  const { dietType, servingsRedMeat, localFoodPercentage } = input;
  
  let baseEmissions = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.flexitarian;
  const meatEmissions = Math.max(0, servingsRedMeat) * EMISSION_FACTORS.food.redMeatServing;
  
  // Local food reduction: up to 10% offset on base diet emissions
  const localMultiplier = 1 - (Math.max(0, Math.min(100, localFoodPercentage)) / 100) * 0.10;
  
  return (baseEmissions * localMultiplier) + meatEmissions;
}

/**
 * Calculates Digital Footprint Emissions (kg CO2e)
 */
export function calculateDigitalEmissions(input: DigitalInput): number {
  const { emailsSent, streamingHours, videoCallsHours, cloudStorageGb } = input;
  
  const emailEmissions = Math.max(0, emailsSent) * EMISSION_FACTORS.digital.email;
  const streamEmissions = Math.max(0, streamingHours) * EMISSION_FACTORS.digital.streamingHour;
  const videoEmissions = Math.max(0, videoCallsHours) * EMISSION_FACTORS.digital.videoCallHour;
  const storageEmissions = Math.max(0, cloudStorageGb) * EMISSION_FACTORS.digital.cloudStorageGbMonth * (1 / 30); // per day
  
  return emailEmissions + streamEmissions + videoEmissions + storageEmissions;
}

/**
 * Calculates Waste emissions (kg CO2e)
 */
export function calculateWasteEmissions(input: WasteInput): number {
  const { landfillLbs, recycledLbs, compostedLbs } = input;
  
  const landfillEmissions = Math.max(0, landfillLbs) * EMISSION_FACTORS.waste.landfill;
  const recyclingSavings = Math.max(0, recycledLbs) * EMISSION_FACTORS.waste.recycledOffset;
  const compostSavings = Math.max(0, compostedLbs) * EMISSION_FACTORS.waste.compostedOffset;
  
  // Total emissions can't go below 0 (offsets are just reductions)
  return Math.max(0, landfillEmissions + recyclingSavings + compostSavings);
}

/**
 * Aggregates all daily emissions into a single total footprint (kg CO2e)
 */
export interface CompleteFootprintInput {
  transport: TransportInput[];
  energy: EnergyInput;
  food: FoodInput;
  digital: DigitalInput;
  waste: WasteInput;
}

export function calculateTotalDailyFootprint(input: CompleteFootprintInput): {
  total: number;
  transport: number;
  energy: number;
  food: number;
  digital: number;
  waste: number;
} {
  const transport = input.transport.reduce((sum, item) => sum + calculateTransportEmissions(item), 0);
  const energy = calculateEnergyEmissions(input.energy);
  const food = calculateFoodEmissions(input.food);
  const digital = calculateDigitalEmissions(input.digital);
  const waste = calculateWasteEmissions(input.waste);
  
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
 * Returns user sustainability score (0 - 100) based on emissions and offsets.
 * Under 10kg CO2e daily = 100 score, above 50kg CO2e daily = 0 score.
 */
export function calculateSustainabilityScore(dailyFootprintKg: number): number {
  if (dailyFootprintKg <= 10) return 100;
  if (dailyFootprintKg >= 50) return 0;
  
  // Linear scale between 10kg (100) and 50kg (0)
  const score = 100 - ((dailyFootprintKg - 10) / 40) * 100;
  return Math.round(score);
}
