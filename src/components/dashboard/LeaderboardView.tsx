'use client';

import { RefreshCw } from 'lucide-react';
import { UserProfile } from '@/types';

interface LeaderboardViewProps {
  leaderboard: any[];
  user: UserProfile | null;
}

export default function LeaderboardView({ leaderboard, user }: LeaderboardViewProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col gap-4 bg-background">
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
  );
}
