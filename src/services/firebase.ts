/**
 * CarbonOS AI - Firebase Service Layer
 * Dual-mode database and authentication service.
 * Automatically falls back to interactive localStorage engine if Firebase env keys are missing.
 */

import { UserProfile, FootprintLog, Challenge, Reward, LeaderboardEntry } from '@/types';
import { FootprintLogSchema, CarbonTwinSchema, RedeemSchema, JoinChallengeSchema, ChallengeProgressSchema } from '@/validators';

// Initial mock challenges
const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Meatless Monday',
    description: 'Switch to a vegetarian or vegan diet for the entire day to save greenhouse gases.',
    category: 'food',
    pointsReward: 150,
    co2SavedEstimate: 3.2,
    durationDays: 1,
    progress: 0,
    completed: false,
    joined: false,
  },
  {
    id: 'c2',
    title: 'Zero Waste Week',
    description: 'Reduce landfill waste to under 1 lb per day by recycling and composting.',
    category: 'waste',
    pointsReward: 400,
    co2SavedEstimate: 8.5,
    durationDays: 7,
    progress: 0,
    completed: false,
    joined: false,
  },
  {
    id: 'c3',
    title: 'Commute Cleanly',
    description: 'Walk, cycle, or use public transit for all travel for 3 consecutive days.',
    category: 'transport',
    pointsReward: 300,
    co2SavedEstimate: 12.0,
    durationDays: 3,
    progress: 0,
    completed: false,
    joined: false,
  },
  {
    id: 'c4',
    title: 'Digital Cleanse',
    description: 'Unsubscribe from 20 newsletters and stream in standard definition to save network emissions.',
    category: 'digital',
    pointsReward: 100,
    co2SavedEstimate: 1.5,
    durationDays: 2,
    progress: 0,
    completed: false,
    joined: false,
  },
  {
    id: 'c5',
    title: 'Eco-Power Hour',
    description: 'Turn off all standby electronics and reduce HVAC usage during peak hours (4 PM - 8 PM).',
    category: 'energy',
    pointsReward: 200,
    co2SavedEstimate: 4.8,
    durationDays: 1,
    progress: 0,
    completed: false,
    joined: false,
  }
];

// Initial mock rewards
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

// Initial mock leaderboard users
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sumit Ahuja', score: 96, points: 2850, saved: 412, isCurrentUser: false },
  { rank: 2, name: 'Akshat Mishra', score: 92, points: 2400, saved: 388, isCurrentUser: false },
  { rank: 3, name: 'Priscilla Green', score: 89, points: 2150, saved: 320, isCurrentUser: false },
  { rank: 4, name: 'Sarah Connor', score: 85, points: 1900, saved: 290, isCurrentUser: false },
  { rank: 5, name: 'David Suzuki', score: 82, points: 1750, saved: 275, isCurrentUser: false },
];

/**
 * Checks if Firebase has been fully configured
 */
export const isFirebaseConfigured = (): boolean => {
  return typeof window !== 'undefined' && 
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined &&
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '';
};

// ==========================================
// INTERACTIVE LOCAL STORAGE / FALLBACK IMPLEMENTATION
// ==========================================

const LOCAL_STORAGE_KEYS = {
  USER_SESSION: 'carbonos_user_session',
  USER_PROFILE: 'carbonos_user_profile',
  FOOTPRINT_LOGS: 'carbonos_footprint_logs',
  CHALLENGES: 'carbonos_challenges',
  REWARDS: 'carbonos_rewards',
  PURCHASED_REWARDS: 'carbonos_purchased_rewards'
};

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/**
 * Firebase Auth, Database & Storage Wrapper
 */
export const FirebaseService = {
  // Auth API
  auth: {
    async getCurrentUser(): Promise<UserProfile | null> {
      return getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
    },

    async signIn(email: string): Promise<UserProfile> {
      // Create user if not existing
      let profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile || profile.email !== email) {
        const name = email.split('@')[0];
        profile = {
          uid: Math.random().toString(36).substring(2, 9),
          email,
          displayName: name.charAt(0).toUpperCase() + name.slice(1),
          sustainabilityScore: 78,
          greenPoints: 620,
          co2SavedKg: 45.5,
          carbonTwin: {
            diet: 'flexitarian',
            transportMode: 'gasoline',
            commuteDistance: 15,
            homeEnergy: 'grid-mix',
            digitalUsage: 'average',
          }
        };
        setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, profile);
      }
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_SESSION, profile.uid);
      return profile;
    },

    async signUp(email: string, name: string): Promise<UserProfile> {
      const profile: UserProfile = {
        uid: Math.random().toString(36).substring(2, 9),
        email,
        displayName: name,
        sustainabilityScore: 70, // default starter score
        greenPoints: 200, // starting bonus
        co2SavedKg: 0,
        carbonTwin: {
          diet: 'flexitarian',
          transportMode: 'gasoline',
          commuteDistance: 15,
          homeEnergy: 'grid-mix',
          digitalUsage: 'average',
        }
      };
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, profile);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_SESSION, profile.uid);
      return profile;
    },

    async signOut(): Promise<void> {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
      }
    },

    onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
      if (typeof window === 'undefined') return () => {};
      
      const checkAuth = () => {
        const uid = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SESSION);
        if (uid) {
          const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
          callback(profile);
        } else {
          callback(null);
        }
      };

      // Trigger initial check
      checkAuth();

      // Listen to storage changes
      window.addEventListener('storage', checkAuth);
      return () => {
        window.removeEventListener('storage', checkAuth);
      };
    }
  },

  // Firestore DB API
  db: {
    // Carbon Footprint Logs
    async getFootprintLogs(): Promise<FootprintLog[]> {
      const defaultLogs: FootprintLog[] = [
        { id: '1', date: '2026-06-10', transport: 8.5, energy: 6.2, food: 2.5, digital: 0.4, waste: 1.2, total: 18.8 },
        { id: '2', date: '2026-06-11', transport: 9.1, energy: 5.8, food: 3.3, digital: 0.5, waste: 1.1, total: 19.8 },
        { id: '3', date: '2026-06-12', transport: 0.0, energy: 6.0, food: 1.7, digital: 0.3, waste: -0.2, total: 7.8 }, // Zero commute, vegetarian, recycling
        { id: '4', date: '2026-06-13', transport: 4.2, energy: 5.5, food: 2.5, digital: 0.6, waste: 1.0, total: 13.8 },
        { id: '5', date: '2026-06-14', transport: 8.0, energy: 6.1, food: 2.5, digital: 0.4, waste: 1.1, total: 18.1 },
      ];
      return getLocalStorageItem<FootprintLog[]>(LOCAL_STORAGE_KEYS.FOOTPRINT_LOGS, defaultLogs);
    },

    async addFootprintLog(log: Omit<FootprintLog, 'id'>): Promise<FootprintLog> {
      const validatedLog = FootprintLogSchema.parse(log);
      const logs = await this.getFootprintLogs();
      const newLog: FootprintLog = {
        ...validatedLog,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      // Keep logs ordered by date
      const updatedLogs = [...logs.filter(l => l.date !== log.date), newLog].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setLocalStorageItem(LOCAL_STORAGE_KEYS.FOOTPRINT_LOGS, updatedLogs);

      // Dynamically recalculate user score based on the latest logs
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (profile) {
        // Average total footprint of last 3 days
        const lastThree = updatedLogs.slice(-3);
        const avgFootprint = lastThree.reduce((sum, l) => sum + l.total, 0) / Math.max(1, lastThree.length);
        
        // Calculate score: Under 10kg = 100, Above 40kg = 0
        let score = 100;
        if (avgFootprint > 10) {
          score = Math.max(0, Math.min(100, Math.round(100 - ((avgFootprint - 10) / 30) * 100)));
        }

        const newProfile = {
          ...profile,
          sustainabilityScore: score,
          // Reward user for log entries
          greenPoints: profile.greenPoints + 15
        };
        setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, newProfile);
      }

      return newLog;
    },

    // Carbon Twin Settings
    async updateCarbonTwin(twin: UserProfile['carbonTwin']): Promise<UserProfile> {
      const validatedTwin = CarbonTwinSchema.parse(twin);
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile) throw new Error('User profile not initialized');
      
      const updatedProfile = { ...profile, carbonTwin: validatedTwin };
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, updatedProfile);
      return updatedProfile;
    },

    // Challenges
    async getChallenges(): Promise<Challenge[]> {
      return getLocalStorageItem<Challenge[]>(LOCAL_STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
    },

    async joinChallenge(id: string): Promise<Challenge[]> {
      const { challengeId } = JoinChallengeSchema.parse({ challengeId: id });
      const challenges = await this.getChallenges();
      const updated = challenges.map(c => c.id === challengeId ? { ...c, joined: true, progress: 10 } : c);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.CHALLENGES, updated);
      return updated;
    },

    async updateChallengeProgress(id: string, addProgress: number): Promise<{ challenges: Challenge[], completed: boolean, pointsAwarded: number }> {
      const { challengeId, progress: validatedAddProgress } = ChallengeProgressSchema.parse({ challengeId: id, progress: addProgress });
      const challenges = await this.getChallenges();
      let completed = false;
      let pointsAwarded = 0;
      
      const updated = challenges.map(c => {
        if (c.id === challengeId && c.joined && !c.completed) {
          const newProgress = Math.min(100, c.progress + validatedAddProgress);
          const isDone = newProgress >= 100;
          if (isDone) {
            completed = true;
            pointsAwarded = c.pointsReward;
          }
          return { ...c, progress: newProgress, completed: isDone };
        }
        return c;
      });

      setLocalStorageItem(LOCAL_STORAGE_KEYS.CHALLENGES, updated);

      if (completed && pointsAwarded > 0) {
        const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
        if (profile) {
          const target = challenges.find(c => c.id === challengeId);
          setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, {
            ...profile,
            greenPoints: profile.greenPoints + pointsAwarded,
            co2SavedKg: profile.co2SavedKg + (target?.co2SavedEstimate || 0)
          });
        }
      }

      return { challenges: updated, completed, pointsAwarded };
    },

    // Rewards & Marketplace
    async getRewards(): Promise<Reward[]> {
      return getLocalStorageItem<Reward[]>(LOCAL_STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    },

    async getPurchasedRewards(): Promise<string[]> {
      return getLocalStorageItem<string[]>(LOCAL_STORAGE_KEYS.PURCHASED_REWARDS, []);
    },

    async redeemReward(rewardId: string): Promise<{ success: boolean, message: string, profile?: UserProfile }> {
      const { rewardId: validatedRewardId } = RedeemSchema.parse({ rewardId });
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile) return { success: false, message: 'Profile not found' };
      
      const rewards = await this.getRewards();
      const reward = rewards.find(r => r.id === validatedRewardId);
      if (!reward) return { success: false, message: 'Reward item not found' };
      
      if (profile.greenPoints < reward.costPoints) {
        return { success: false, message: 'Insufficient green points' };
      }

      const purchased = getLocalStorageItem<string[]>(LOCAL_STORAGE_KEYS.PURCHASED_REWARDS, []);
      
      const updatedProfile = {
        ...profile,
        greenPoints: profile.greenPoints - reward.costPoints
      };

      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, updatedProfile);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.PURCHASED_REWARDS, [...purchased, rewardId]);

      return {
        success: true,
        message: `Successfully redeemed: ${reward.title}!`,
        profile: updatedProfile
      };
    },

    // Leaderboards
    async getLeaderboard(): Promise<LeaderboardEntry[]> {
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile) return MOCK_LEADERBOARD;
      
      const list = [...MOCK_LEADERBOARD];
      const existingUserIndex = list.findIndex(u => u.name === profile.displayName);
      
      const userItem = {
        rank: 0, // calculated below
        name: profile.displayName,
        score: profile.sustainabilityScore,
        points: profile.greenPoints,
        saved: Math.round(profile.co2SavedKg),
        isCurrentUser: true
      };

      if (existingUserIndex >= 0) {
        list[existingUserIndex] = userItem;
      } else {
        list.push(userItem);
      }

      // Sort and recalculate ranks
      return list
        .sort((a, b) => b.points - a.points)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
    }
  },

  // Storage API
  storage: {
    async uploadReceipt(file: File): Promise<string> {
      // Simulate file upload delay and return an object url / mock URL
      await new Promise(resolve => setTimeout(resolve, 800));
      return URL.createObjectURL(file);
    }
  }
};
