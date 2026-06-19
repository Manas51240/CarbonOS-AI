import { Challenge, Reward, LeaderboardEntry } from '@/types';

export const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Meatless Monday', description: 'Switch to a vegetarian or vegan diet for the day.', category: 'food', pointsReward: 150, co2SavedEstimate: 3.2, durationDays: 1, progress: 0, completed: false, joined: false },
  { id: 'c2', title: 'Car-free Commute', description: 'Walk, cycle, or take transit instead of driving.', category: 'transport', pointsReward: 200, co2SavedEstimate: 5.4, durationDays: 1, progress: 0, completed: false, joined: false },
  { id: 'c3', title: 'Eco Energy Saving', description: 'Lower heating/cooling or unplug inactive devices.', category: 'energy', pointsReward: 120, co2SavedEstimate: 2.1, durationDays: 1, progress: 0, completed: false, joined: false }
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Plant 10 Trees in the Amazon', description: 'Collaborate with OneTreePlanted to reforest ecosystems.', provider: 'OneTreePlanted', costPoints: 500, category: 'donation', image: '🌳' },
  { id: 'r2', title: '$10 Sustainable Clothing Discount', description: 'Voucher for plastic-free organic cotton items.', provider: 'ThreadEco', costPoints: 300, category: 'product', image: '👕' },
  { id: 'r3', title: '1 Month Free Electric Ride-share', description: 'Free unlock passes and 15% off micro-mobility.', provider: 'Lime/Bird', costPoints: 750, category: 'service', image: '🛴' },
  { id: 'r4', title: 'Offset 500kg CO2 Directly', description: 'Carbon removal purchase (Biochar & Climeworks).', provider: 'CarbonCure', costPoints: 1000, category: 'donation', image: '💨' },
  { id: 'r5', title: 'Bamboo Eco-Friendly Cutlery Set', description: 'Reusable zero-waste cutlery kit from bamboo.', provider: 'ZeroWasteShop', costPoints: 450, category: 'product', image: '🍴' }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sumit Ahuja', score: 96, points: 2850, saved: 412, isCurrentUser: false },
  { rank: 2, name: 'Akshat Mishra', score: 92, points: 2400, saved: 388, isCurrentUser: false },
  { rank: 3, name: 'Priscilla Green', score: 89, points: 2150, saved: 320, isCurrentUser: false },
  { rank: 4, name: 'Sarah Connor', score: 85, points: 1900, saved: 290, isCurrentUser: false },
  { rank: 5, name: 'David Suzuki', score: 82, points: 1750, saved: 275, isCurrentUser: false }
];
