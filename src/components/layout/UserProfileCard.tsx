'use client';

import { Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

interface UserProfileCardProps {
  user: UserProfile | null;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-4 mb-6 relative overflow-hidden group bg-background/50 border border-muted/80 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-muted shadow-md" />
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-muted/50 text-center">
          <div>
            <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-2" />
            <div className="h-5 bg-muted rounded w-1/3 mx-auto" />
          </div>
          <div className="border-l border-muted/50">
            <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-2" />
            <div className="h-5 bg-muted rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 mb-6 relative overflow-hidden group bg-background/50 border border-muted/80">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full filter blur-xl -mr-6 -mt-6 group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-background shadow-md">
          {user.displayName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{user.displayName}</h2>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs text-muted-foreground font-medium">
              {user.greenPoints} Green Points
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-muted/50 text-center">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Eco Score</p>
          <p className="text-lg font-bold text-primary">{user.sustainabilityScore}/100</p>
        </div>
        <div className="border-l border-muted/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CO₂ Offset</p>
          <p className="text-lg font-bold text-accent">{Math.round(user.co2SavedKg)} kg</p>
        </div>
      </div>
    </div>
  );
}
