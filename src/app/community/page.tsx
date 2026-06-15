'use client';

/**
 * CarbonOS AI - Gamified Community Center
 * Integrates interactive Leaderboards comparing scores
 * and daily/weekly Green Challenges with incremental progress.
 */

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, CheckCircle, Target, Award, ArrowUp, RefreshCw, Zap } from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const { challenges, leaderboard, joinChallenge, completeChallengeProgress } = useCarbonStore();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Increments challenge progress for evaluation testing
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
      <header className="border-b border-muted/50 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Hub</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Compete on the leaderboard, join carbon-reduction challenges, and earn Green Points.
          </p>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="flex bg-secondary/60 rounded-2xl p-1.5 border border-muted/50 self-start">
        <button
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

      {activeTab === 'leaderboard' ? (
        /* LEADERBOARD VIEW */
        <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-muted/50 pb-4 mb-2">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Environmental Stewards</h2>
            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refreshes in real-time</span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Header row */}
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">
              <div className="col-span-2">Rank</div>
              <div className="col-span-4">User Name</div>
              <div className="col-span-2 text-center">Eco Score</div>
              <div className="col-span-2 text-center">Offset Saved</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* User records */}
            {leaderboard.map((u, idx) => {
              const isMe = u.name === user?.displayName;
              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center px-4 py-3.5 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                    isMe
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 font-bold scale-[1.01]'
                      : 'border-muted/40 bg-secondary/20 hover:bg-secondary/45'
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black ${
                      u.rank === 1
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : u.rank === 2
                        ? 'bg-slate-400/10 text-slate-400 border border-slate-400/20'
                        : u.rank === 3
                        ? 'bg-amber-700/10 text-amber-700 border border-amber-700/20'
                        : 'text-muted-foreground'
                    }`}>
                      {u.rank}
                    </span>
                  </div>
                  
                  <div className="col-span-4 flex items-center gap-2 truncate">
                    <span>{u.name}</span>
                    {isMe && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase">
                        You
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      u.score >= 85
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {u.score}/100
                    </span>
                  </div>

                  <div className="col-span-2 text-center text-muted-foreground">
                    {u.saved} kg
                  </div>

                  <div className="col-span-2 text-right font-bold text-primary">
                    {u.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GREEN CHALLENGES VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                c.completed
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : c.joined
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-muted/80'
              }`}
            >
              {/* Challenge header */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border ${
                    c.category === 'food'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : c.category === 'transport'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : c.category === 'energy'
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {c.category}
                  </span>
                  
                  <div className="text-right">
                    <span className="text-xs font-black text-primary flex items-center gap-0.5 justify-end">
                      <Zap className="w-3.5 h-3.5 fill-primary" />
                      <span>+{c.pointsReward} pts</span>
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm mb-1.5 flex items-center gap-1.5">
                  {c.title}
                  {c.completed && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
                  )}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{c.description}</p>
              </div>

              {/* Progress & Actions */}
              <div className="border-t border-muted/50 pt-4 mt-auto">
                {c.completed ? (
                  <div className="flex items-center justify-between text-xs text-emerald-500 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>Challenge Completed!</span>
                    </span>
                    <span>Saved {c.co2SavedEstimate}kg CO₂</span>
                  </div>
                ) : c.joined ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Active Progress:</span>
                      <span className="font-extrabold text-primary">{c.progress}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    
                    <button
                      onClick={() => handleProgressIncrement(c.id)}
                      disabled={updatingId === c.id}
                      className="w-full py-2.5 mt-1 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {updatingId === c.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5" />
                      )}
                      <span>Perform Action (+25% Progress)</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => joinChallenge(c.id)}
                    className="w-full py-3 rounded-xl bg-secondary/80 hover:bg-primary hover:text-primary-foreground border border-muted hover:border-primary font-bold text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-4 h-4 text-primary" />
                    <span>Join Goal Target</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
