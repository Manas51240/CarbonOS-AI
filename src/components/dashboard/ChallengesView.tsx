'use client';

import { CheckCircle, Target, Award, ArrowUp, RefreshCw, Zap } from 'lucide-react';
import { Challenge } from '@/types';

interface ChallengesViewProps {
  challenges: Challenge[];
  updatingId: string | null;
  onProgressIncrement: (challengeId: string) => Promise<void>;
  onJoinChallenge: (challengeId: string) => Promise<void>;
}

export default function ChallengesView({
  challenges,
  updatingId,
  onProgressIncrement,
  onJoinChallenge
}: ChallengesViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {challenges.map((c) => (
        <div
          key={c.id}
          className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
            c.completed
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : c.joined
              ? 'border-primary/20 bg-primary/5'
              : 'border-muted/80 bg-background'
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
                <div 
                  className="w-full bg-muted h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={c.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${c.title} progress`}
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                
                <button
                  onClick={() => onProgressIncrement(c.id)}
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
                onClick={() => onJoinChallenge(c.id)}
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
  );
}
