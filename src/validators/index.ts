import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
});

export const CarbonTwinSchema = z.object({
  diet: z.enum(['vegan', 'vegetarian', 'flexitarian', 'meat-heavy']),
  transportMode: z.enum(['gasoline', 'diesel', 'hybrid', 'electric']),
  commuteDistance: z.number().min(0).max(150, { message: 'Commute distance must be between 0 and 150 miles' }),
  homeEnergy: z.enum(['grid-mix', 'partial-solar', '100-solar']),
  digitalUsage: z.enum(['low', 'average', 'high']),
});

export const RedeemSchema = z.object({
  rewardId: z.string().min(1, { message: 'Reward ID is required' }),
});

export const FootprintLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be YYYY-MM-DD' }),
  transport: z.number().nonnegative(),
  energy: z.number().nonnegative(),
  food: z.number().nonnegative(),
  digital: z.number().nonnegative(),
  waste: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const JoinChallengeSchema = z.object({
  challengeId: z.string().min(1, { message: 'Challenge ID is required' }),
});

export const ChallengeProgressSchema = z.object({
  challengeId: z.string().min(1, { message: 'Challenge ID is required' }),
  progress: z.number().min(0, { message: 'Progress increment must be non-negative' }),
});

export const FootprintLoggedDetailsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalCo2: z.number().nonnegative(),
}).strict();

export const TwinSimulationDetailsSchema = z.object({
  dietType: z.enum(['vegan', 'vegetarian', 'flexitarian', 'meat-heavy']).optional(),
  carFuel: z.enum(['gasoline', 'diesel', 'hybrid', 'electric']).optional(),
  dailyCommuteMiles: z.number().min(0).max(150).optional(),
  homeEnergySource: z.enum(['grid-mix', 'partial-solar', '100-solar']).optional(),
  digitalUsageLevel: z.enum(['low', 'average', 'high']).optional(),
  changed: z.string().optional(),
}).strict();

export const ChallengeCompletedDetailsSchema = z.object({
  challengeId: z.string().min(1),
  pointsAwarded: z.number().nonnegative(),
}).strict();

export const RewardRedeemedDetailsSchema = z.object({
  rewardId: z.string().min(1),
}).strict();

export const CoachQueryDetailsSchema = z.object({
  query: z.string().min(1),
}).strict();

export const AnalyticsDetailsSchemaMap = {
  footprint_logged: FootprintLoggedDetailsSchema,
  twin_simulation: TwinSimulationDetailsSchema,
  challenge_completed: ChallengeCompletedDetailsSchema,
  reward_redeemed: RewardRedeemedDetailsSchema,
  coach_query: CoachQueryDetailsSchema,
};

