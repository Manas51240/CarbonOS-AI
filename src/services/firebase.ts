import { UserProfile, FootprintLog, Challenge, Reward, LeaderboardEntry } from '@/types';
import { FootprintLogSchema, CarbonTwinSchema, RedeemSchema, JoinChallengeSchema, ChallengeProgressSchema } from '@/validators';

import { INITIAL_CHALLENGES, INITIAL_REWARDS, MOCK_LEADERBOARD } from '@/constants/mocks';

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

export const isFirebaseConfigured = (): boolean => {
  return typeof window !== 'undefined' && 
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined &&
         process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== '';
};

export const FirebaseService = {
  auth: {
    getCurrentUser(): UserProfile | null {
      return getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
    },
    async signIn(email: string): Promise<UserProfile> {
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
          carbonTwin: { diet: 'flexitarian', transportMode: 'gasoline', commuteDistance: 15, homeEnergy: 'grid-mix', digitalUsage: 'average' }
        };
        setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, profile);
      }
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_SESSION, profile.uid);
      if (typeof document !== 'undefined') {
        document.cookie = `carbonos_user_session=${profile.uid}; path=/; max-age=31536000; SameSite=Lax`;
      }
      return profile;
    },
    async signUp(email: string, name: string): Promise<UserProfile> {
      const profile: UserProfile = {
        uid: Math.random().toString(36).substring(2, 9),
        email,
        displayName: name,
        sustainabilityScore: 70,
        greenPoints: 200,
        co2SavedKg: 0,
        carbonTwin: { diet: 'flexitarian', transportMode: 'gasoline', commuteDistance: 15, homeEnergy: 'grid-mix', digitalUsage: 'average' }
      };
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, profile);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_SESSION, profile.uid);
      if (typeof document !== 'undefined') {
        document.cookie = `carbonos_user_session=${profile.uid}; path=/; max-age=31536000; SameSite=Lax`;
      }
      return profile;
    },
    async signOut(): Promise<void> {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_SESSION);
      }
      if (typeof document !== 'undefined') {
        document.cookie = 'carbonos_user_session=; path=/; max-age=0; SameSite=Lax';
      }
    },
    onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
      if (typeof window === 'undefined') return () => {};
      const checkAuth = () => {
        const uid = getLocalStorageItem<string | null>(LOCAL_STORAGE_KEYS.USER_SESSION, null);
        callback(uid ? getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null) : null);
      };
      checkAuth();
      window.addEventListener('storage', checkAuth);
      return () => window.removeEventListener('storage', checkAuth);
    }
  },

  db: {
    async getFootprintLogs(): Promise<FootprintLog[]> {
      const defaultLogs: FootprintLog[] = [
        { id: '1', date: '2026-06-10', transport: 8.5, energy: 6.2, food: 2.5, digital: 0.4, waste: 1.2, total: 18.8 },
        { id: '2', date: '2026-06-11', transport: 9.1, energy: 5.8, food: 3.3, digital: 0.5, waste: 1.1, total: 19.8 },
        { id: '3', date: '2026-06-12', transport: 0.0, energy: 6.0, food: 1.7, digital: 0.3, waste: -0.2, total: 7.8 },
        { id: '4', date: '2026-06-13', transport: 4.2, energy: 5.5, food: 2.5, digital: 0.6, waste: 1.0, total: 13.8 },
        { id: '5', date: '2026-06-14', transport: 8.0, energy: 6.1, food: 2.5, digital: 0.4, waste: 1.1, total: 18.1 },
      ];
      return getLocalStorageItem<FootprintLog[]>(LOCAL_STORAGE_KEYS.FOOTPRINT_LOGS, defaultLogs);
    },
    async addFootprintLog(log: Omit<FootprintLog, 'id'>): Promise<FootprintLog> {
      const validatedLog = FootprintLogSchema.parse(log);
      const logs = await this.getFootprintLogs();
      const newLog: FootprintLog = { ...validatedLog, id: Math.random().toString(36).substring(2, 9) };
      const updatedLogs = [...logs.filter(l => l.date !== log.date), newLog].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setLocalStorageItem(LOCAL_STORAGE_KEYS.FOOTPRINT_LOGS, updatedLogs);

      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (profile) {
        const lastThree = updatedLogs.slice(-3);
        const avgFootprint = lastThree.reduce((sum, l) => sum + l.total, 0) / Math.max(1, lastThree.length);
        let score = 100;
        if (avgFootprint > 10) {
          score = Math.max(0, Math.min(100, Math.round(100 - ((avgFootprint - 10) / 30) * 100)));
        }
        setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, { ...profile, sustainabilityScore: score, greenPoints: profile.greenPoints + 15 });
      }
      return newLog;
    },
    async updateCarbonTwin(twin: UserProfile['carbonTwin']): Promise<UserProfile> {
      const validatedTwin = CarbonTwinSchema.parse(twin);
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile) throw new Error('User profile not initialized');
      const updatedProfile = { ...profile, carbonTwin: validatedTwin };
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, updatedProfile);
      return updatedProfile;
    },
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
          if (isDone) { completed = true; pointsAwarded = c.pointsReward; }
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
      const updatedProfile = { ...profile, greenPoints: profile.greenPoints - reward.costPoints };
      setLocalStorageItem(LOCAL_STORAGE_KEYS.USER_PROFILE, updatedProfile);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.PURCHASED_REWARDS, [...purchased, rewardId]);
      return { success: true, message: `Successfully redeemed: ${reward.title}!`, profile: updatedProfile };
    },
    async getLeaderboard(): Promise<LeaderboardEntry[]> {
      const profile = getLocalStorageItem<UserProfile | null>(LOCAL_STORAGE_KEYS.USER_PROFILE, null);
      if (!profile) return MOCK_LEADERBOARD;
      const list = [...MOCK_LEADERBOARD];
      const existingUserIndex = list.findIndex(u => u.name === profile.displayName);
      const userItem = { rank: 0, name: profile.displayName, score: profile.sustainabilityScore, points: profile.greenPoints, saved: Math.round(profile.co2SavedKg), isCurrentUser: true };
      if (existingUserIndex >= 0) {
        list[existingUserIndex] = userItem;
      } else {
        list.push(userItem);
      }
      return list.sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
    }
  },

  storage: {
    async uploadReceipt(file: File): Promise<string> {
      await new Promise(resolve => setTimeout(resolve, 800));
      return URL.createObjectURL(file);
    }
  }
};
