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
