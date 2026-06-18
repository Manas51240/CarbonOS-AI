'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Target } from 'lucide-react';
import ParadigmBanner from '@/components/shared/ParadigmBanner';
import LeaderboardView from '@/components/dashboard/LeaderboardView';
import ChallengesView from '@/components/dashboard/ChallengesView';

/**
 * CarbonOS AI - Gamified Community Center
 * Integrates interactive Leaderboards comparing scores
 * and daily/weekly Green Challenges with incremental progress.
 */
export default function CommunityPage() {
  const { user } = useAuth();
  const { challenges, leaderboard, joinChallenge, completeChallengeProgress } = useCarbonStore();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleProgressIncrement = async (challengeId: string) => {
    setUpdatingId(challengeId);
    try {
      await completeChallengeProgress(challengeId, 25);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <ParadigmBanner />
      <header className="border-b border-muted/50 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Hub</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Compete on the leaderboard, join carbon-reduction challenges, and earn Green Points.
          </p>
        </div>
      </header>

      {/* Tabs Menu */}
      <div
        role="tablist"
        aria-label="Community Sections"
        className="flex bg-secondary/60 rounded-2xl p-1.5 border border-muted/50 self-start"
      >
        <button
          id="tab-leaderboard"
          role="tab"
          aria-selected={activeTab === 'leaderboard'}
          aria-controls="panel-leaderboard"
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Global Leaderboard</span>
        </button>
        <button
          id="tab-challenges"
          role="tab"
          aria-selected={activeTab === 'challenges'}
          aria-controls="panel-challenges"
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Green Challenges</span>
        </button>
      </div>

      <div
        id="panel-leaderboard"
        role="tabpanel"
        aria-labelledby="tab-leaderboard"
        hidden={activeTab !== 'leaderboard'}
      >
        {activeTab === 'leaderboard' && (
          <LeaderboardView leaderboard={leaderboard} user={user} />
        )}
      </div>

      <div
        id="panel-challenges"
        role="tabpanel"
        aria-labelledby="tab-challenges"
        hidden={activeTab !== 'challenges'}
      >
        {activeTab === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            updatingId={updatingId}
            onProgressIncrement={handleProgressIncrement}
            onJoinChallenge={joinChallenge}
          />
        )}
      </div>
    </div>
  );
}
