/**
 * CarbonOS AI - Core Type Definitions
 */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  sustainabilityScore: number;
  greenPoints: number;
  co2SavedKg: number;
  carbonTwin: {
    diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
    transportMode: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
    commuteDistance: number;
    homeEnergy: 'grid-mix' | 'partial-solar' | '100-solar';
    digitalUsage: 'low' | 'average' | 'high';
    avatarUrl?: string;
  };
}

export interface FootprintLog {
  id: string;
  date: string; // YYYY-MM-DD
  transport: number; // kg CO2
  energy: number;
  food: number;
  digital: number;
  waste: number;
  total: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'digital' | 'waste';
  pointsReward: number;
  co2SavedEstimate: number;
  durationDays: number;
  progress: number; // 0 to 100
  completed: boolean;
  joined: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  provider: string;
  costPoints: number;
  category: 'donation' | 'product' | 'service';
  image: string;
}

export interface SustainabilityAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionRequired?: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ScannedReceiptResult {
  storeName: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    carbonCategory: 'food-high' | 'food-medium' | 'food-low' | 'electronics' | 'utilities' | 'other';
    carbonEstimateKg: number;
    ecoFriendlyAlternative?: string;
  }>;
  totalCost: number;
  totalCarbonKg: number;
  sustainabilityInsight: string;
}

export interface TransportInput {
  type: 'car' | 'flight' | 'transit';
  distance: number;
  fuelOrClass?: string;
}

export interface EnergyInput {
  electricityKwh: number;
  gasTherms: number;
  cleanEnergyPercentage: number;
}

export interface FoodInput {
  dietType: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
  servingsRedMeat: number;
  localFoodPercentage: number;
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

export interface CompleteFootprintInput {
  transport: TransportInput[];
  energy: EnergyInput;
  food: FoodInput;
  digital: DigitalInput;
  waste: WasteInput;
}

export interface CarbonTwinState {
  dietType: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
  carFuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  dailyCommuteMiles: number;
  homeEnergySource: 'grid-mix' | 'partial-solar' | '100-solar';
  digitalUsageLevel: 'low' | 'average' | 'high';
}
