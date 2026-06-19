import { createContext } from 'react';
import { FootprintLog, Challenge, Reward, LeaderboardEntry } from '@/types';

export interface SustainabilityAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionRequired?: string;
  date: string;
}

export interface CarbonStoreContextType {
  logs: FootprintLog[];
  challenges: Challenge[];
  rewards: Reward[];
  purchasedRewards: string[];
  leaderboard: LeaderboardEntry[];
  alerts: SustainabilityAlert[];
  twinSimState: {
    dietType: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy';
    carFuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
    dailyCommuteMiles: number;
    homeEnergySource: 'grid-mix' | 'partial-solar' | '100-solar';
    digitalUsageLevel: 'low' | 'average' | 'high';
  };
  loading: boolean;
  addLog: (log: Omit<FootprintLog, 'id'>) => Promise<void>;
  updateTwinSim: (updates: Partial<CarbonStoreContextType['twinSimState']>) => void;
  joinChallenge: (challengeId: string) => Promise<void>;
  completeChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  redeemStoreReward: (rewardId: string) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
}

export const CarbonStoreContext = createContext<CarbonStoreContextType | undefined>(undefined);
