import { Reward } from '@/types';
import { RedeemSchema } from '@/validators';

const INITIAL_REWARDS: Reward[] = [
  {
    id: 'r1',
    title: 'Plant 10 Trees in the Amazon',
    description: 'Collaborate with OneTreePlanted to reforest damaged ecosystems and absorb carbon.',
    provider: 'OneTreePlanted',
    costPoints: 500,
    category: 'donation',
    image: '🌳'
  },
  {
    id: 'r2',
    title: '$10 Sustainable Clothing Discount',
    description: '$10 voucher code for organic cotton items with zero plastic packaging.',
    provider: 'ThreadEco',
    costPoints: 300,
    category: 'product',
    image: '👕'
  },
  {
    id: 'r3',
    title: '1 Month Free Electric Ride-share',
    description: 'Get free unlock passes and 15% off ride charges for green micro-mobility.',
    provider: 'Lime/Bird',
    costPoints: 750,
    category: 'service',
    image: '🛴'
  },
  {
    id: 'r4',
    title: 'Offset 500kg CO2 Directly',
    description: 'Direct air capture purchase via carbon removal projects (Biochar & Climeworks).',
    provider: 'CarbonCure',
    costPoints: 1000,
    category: 'donation',
    image: '💨'
  },
  {
    id: 'r5',
    title: 'Bamboo Eco-Friendly Cutlery Set',
    description: 'Reusable zero-waste travel cutlery kit made from organic biodegradable bamboo.',
    provider: 'ZeroWasteShop',
    costPoints: 450,
    category: 'product',
    image: '🍴'
  }
];

const REWARDS_STORAGE_KEY = 'carbonos_rewards';
const PURCHASED_STORAGE_KEY = 'carbonos_purchased_rewards';

/**
 * Service managing rewards, redemptions, and point transactions.
 */
export class RewardsService {
  /**
   * Fetches all rewards.
   */
  static async getRewards(): Promise<Reward[]> {
    if (typeof window === 'undefined') return INITIAL_REWARDS;
    const item = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(INITIAL_REWARDS));
      return INITIAL_REWARDS;
    }
    return JSON.parse(item);
  }

  /**
   * Fetches IDs of purchased rewards.
   */
  static async getPurchasedRewards(): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    const item = localStorage.getItem(PURCHASED_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  }

  /**
   * Redeems a marketplace reward.
   */
  static async redeemReward(
    rewardId: string,
    userPoints: number
  ): Promise<{ success: boolean; message: string; pointsDeducted: number }> {
    // Validate request schema
    const validation = RedeemSchema.safeParse({ rewardId });
    if (!validation.success) {
       return { success: false, message: validation.error.issues[0].message, pointsDeducted: 0 };
    }

    const rewards = await this.getRewards();
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Reward item not found', pointsDeducted: 0 };
    }

    // Enforce balance boundaries
    if (userPoints < reward.costPoints) {
      return { success: false, message: 'Insufficient green points', pointsDeducted: 0 };
    }

    // Update purchased registry
    if (typeof window !== 'undefined') {
      const purchased = await this.getPurchasedRewards();
      localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify([...purchased, rewardId]));
    }

    return {
      success: true,
      message: `Successfully redeemed: ${reward.title}!`,
      pointsDeducted: reward.costPoints
    };
  }
}
