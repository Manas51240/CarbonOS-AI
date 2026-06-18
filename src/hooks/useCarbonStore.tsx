'use client';

/**
 * CarbonOS AI - Sustainability & Carbon State Management Store
 * Coordinates carbon calculation engine, Firebase DB logs, and simulations.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FirebaseService } from '@/services/firebase';
import { FootprintLog, Challenge, Reward, LeaderboardEntry } from '@/types';
import { AnalyticsService } from '@/services/analytics';
import { useAuth } from './useAuth';

export interface SustainabilityAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionRequired?: string;
  date: string;
}

interface CarbonStoreContextType {
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

const CarbonStoreContext = createContext<CarbonStoreContextType | undefined>(undefined);

// Static environment/sustainability alerts (simulating localized push alerts)
const DEFAULT_ALERTS: SustainabilityAlert[] = [
  {
    id: 'a1',
    type: 'danger',
    title: 'Extreme Heatwave Advisory',
    message: 'Local temperatures projected to reach 104°F tomorrow. Grid load is expected to hit peak levels.',
    actionRequired: 'Pre-cool your house in the morning and adjust thermostat to 78°F during peak hours (4 PM - 8 PM) to prevent brownouts.',
    date: '2026-06-14'
  },
  {
    id: 'a2',
    type: 'warning',
    title: 'High PM2.5 Air Quality Warning',
    message: 'Stagnant air has concentrated particulate emissions from vehicle exhausts in your urban sector.',
    actionRequired: 'Avoid unnecessary driving; walk or utilize zero-emission electric rail commutes today.',
    date: '2026-06-13'
  },
  {
    id: 'a3',
    type: 'info',
    title: 'Regional Green Energy Surge',
    message: 'Strong local wind currents have generated a surplus of renewable energy on the state power grid.',
    actionRequired: 'Excellent time to run heavy appliances (laundry, dishwashing) as grid carbon footprint is reduced by 40%.',
    date: '2026-06-12'
  }
];

export function CarbonStoreProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshProfile } = useAuth();
  const [logs, setLogs] = useState<FootprintLog[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [purchasedRewards, setPurchasedRewards] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [alerts] = useState<SustainabilityAlert[]>(DEFAULT_ALERTS);
  const [loading, setLoading] = useState<boolean>(true);

  // AI Carbon Twin state initialized with user context
  const [twinSimState, setTwinSimState] = useState<CarbonStoreContextType['twinSimState']>({
    dietType: 'flexitarian',
    carFuel: 'gasoline',
    dailyCommuteMiles: 15,
    homeEnergySource: 'grid-mix',
    digitalUsageLevel: 'average',
  });

  // Sync twin simulator initial state with actual user database values when loaded
  useEffect(() => {
    if (user?.carbonTwin) {
      setTwinSimState({
        dietType: (user.carbonTwin.diet || 'flexitarian') as any,
        carFuel: (user.carbonTwin.transportMode || 'gasoline') as any,
        dailyCommuteMiles: user.carbonTwin.commuteDistance || 15,
        homeEnergySource: (user.carbonTwin.homeEnergy === '100-solar' ? '100-solar' : user.carbonTwin.homeEnergy === 'partial-solar' ? 'partial-solar' : 'grid-mix'),
        digitalUsageLevel: (user.carbonTwin.digitalUsage || 'average') as any,
      });
    }
  }, [user]);

  // Load database items
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [fetchedLogs, fetchedChallenges, fetchedRewards, fetchedPurchased, fetchedLeaderboard] = await Promise.all([
        FirebaseService.db.getFootprintLogs(),
        FirebaseService.db.getChallenges(),
        FirebaseService.db.getRewards(),
        FirebaseService.db.getPurchasedRewards(),
        FirebaseService.db.getLeaderboard(),
      ]);

      setLogs(fetchedLogs);
      setChallenges(fetchedChallenges);
      setRewards(fetchedRewards);
      setPurchasedRewards(fetchedPurchased);
      setLeaderboard(fetchedLeaderboard);
    } catch (e) {
      console.error('Failed to load carbon store data', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const addLog = async (logInput: Omit<FootprintLog, 'id'>) => {
    if (!user) return;
    try {
      const newLog = await FirebaseService.db.addFootprintLog(logInput);
      
      // Update local state reactively
      setLogs(prev => [...prev.filter(l => l.date !== logInput.date), newLog].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ));

      // Refresh profile (points & score update)
      await refreshProfile();
      await AnalyticsService.logEvent(user.uid, 'footprint_logged', { date: logInput.date, totalCo2: logInput.total });
      
      // Update leaderboard ranking reactively
      const updatedLeaderboard = await FirebaseService.db.getLeaderboard();
      setLeaderboard(updatedLeaderboard);
    } catch (e) {
      console.error('Failed to add carbon footprint log', e);
    }
  };

  const updateTwinSim = (updates: Partial<CarbonStoreContextType['twinSimState']>) => {
    setTwinSimState(prev => {
      const next = { ...prev, ...updates };
      
      // Log event in BigQuery simulator
      if (user) {
        AnalyticsService.logEvent(user.uid, 'twin_simulation', next);
      }
      return next;
    });
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) return;
    try {
      const updated = await FirebaseService.db.joinChallenge(challengeId);
      setChallenges(updated);
    } catch (e) {
      console.error('Failed to join challenge', e);
    }
  };

  const completeChallengeProgress = async (challengeId: string, addProgress: number) => {
    if (!user) return;
    try {
      const { challenges: updated, completed, pointsAwarded } = 
        await FirebaseService.db.updateChallengeProgress(challengeId, addProgress);
      
      setChallenges(updated);

      if (completed) {
        await refreshProfile();
        const updatedLeaderboard = await FirebaseService.db.getLeaderboard();
        setLeaderboard(updatedLeaderboard);
        await AnalyticsService.logEvent(user.uid, 'challenge_completed', { challengeId, pointsAwarded });
      }
    } catch (e) {
      console.error('Failed to update challenge progress', e);
    }
  };

  const redeemStoreReward = async (rewardId: string) => {
    if (!user) return { success: false, message: 'Must be logged in' };
    try {
      const res = await FirebaseService.db.redeemReward(rewardId);
      if (res.success) {
        setPurchasedRewards(prev => [...prev, rewardId]);
        await refreshProfile();
        
        const updatedLeaderboard = await FirebaseService.db.getLeaderboard();
        setLeaderboard(updatedLeaderboard);
        
        await AnalyticsService.logEvent(user.uid, 'reward_redeemed', { rewardId });
      }
      return { success: res.success, message: res.message };
    } catch (e) {
      return { success: false, message: 'Failed to redeem reward: ' + String(e) };
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadData();
  };

  return (
    <CarbonStoreContext.Provider
      value={{
        logs,
        challenges,
        rewards,
        purchasedRewards,
        leaderboard,
        alerts,
        twinSimState,
        loading,
        addLog,
        updateTwinSim,
        joinChallenge,
        completeChallengeProgress,
        redeemStoreReward,
        refreshData,
      }}
    >
      {children}
    </CarbonStoreContext.Provider>
  );
}

export function useCarbonStore() {
  const context = useContext(CarbonStoreContext);
  if (context === undefined) {
    throw new Error('useCarbonStore must be used within a CarbonStoreProvider');
  }
  return context;
}
