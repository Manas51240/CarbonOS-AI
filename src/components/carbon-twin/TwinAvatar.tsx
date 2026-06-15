'use client';

import { Info, Leaf } from 'lucide-react';


interface TwinAvatarProps {
  displayName: string;
  dailyTotal: number;
  currentTotal: number;
  projectedSavings: {
    dailySaving: number;
    monthlySaving: number;
    annualSaving: number;
    reductionPotentialPercentage: number;
  };
}

/**
 * Presentational component displaying the carbon twin avatar and savings details.
 */
export default function TwinAvatar({
  displayName,
  dailyTotal,
  currentTotal,
  projectedSavings
}: TwinAvatarProps) {
  // Determine avatar background health status
  let healthStatus = 'optimal';
  let healthLabel = 'Eco Champion';
  let glowColor = 'shadow-[0_0_50px_-5px_rgba(16,185,129,0.35)] border-emerald-500/35';
  let avatarEmoji = '🌿';

  if (dailyTotal > 30) {
    healthStatus = 'critical';
    healthLabel = 'Smog Heavy';
    glowColor = 'shadow-[0_0_50px_-5px_rgba(239,68,68,0.35)] border-red-500/35';
    avatarEmoji = '🏭';
  } else if (dailyTotal > 18) {
    healthStatus = 'warning';
    healthLabel = 'Carbon Moderate';
    glowColor = 'shadow-[0_0_50px_-5px_rgba(245,158,11,0.35)] border-amber-500/35';
    avatarEmoji = '🚗';
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`glass-card rounded-3xl p-6 border flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 bg-background ${glowColor}`}>
        <span className={`absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
          healthStatus === 'optimal' 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : healthStatus === 'warning'
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {healthLabel}
        </span>

        {/* Animated Avatar Visualizer */}
        <div className="w-32 h-32 rounded-full bg-secondary/80 border-2 border-muted flex items-center justify-center text-6xl shadow-inner mt-8 mb-6 relative animate-float">
          <span className="relative z-10">{avatarEmoji}</span>
          <div className="absolute inset-0 bg-primary/5 rounded-full filter blur-md animate-pulse" />
        </div>

        <h2 className="text-lg font-bold">{displayName}'s Twin</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Simulated Daily Carbon Output:
        </p>
        <div className="mt-3 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-black">{dailyTotal.toFixed(1)}</span>
          <span className="text-xs font-semibold text-muted-foreground">kg CO₂e</span>
        </div>

        {/* CURRENT vs PROJECTED vs FUTURE SAVINGS */}
        <div className="w-full mt-6 bg-secondary/45 border border-muted/50 rounded-2xl p-4 text-left flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Current Footprint:</span>
            <span className="font-bold text-foreground">{currentTotal.toFixed(1)} kg/day</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Projected Footprint:</span>
            <span className="font-bold text-primary">{dailyTotal.toFixed(1)} kg/day</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-muted/20 pt-2">
            <span className="text-muted-foreground font-semibold">Reduction Potential:</span>
            <span className="font-black text-accent">{projectedSavings.reductionPotentialPercentage}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Future Carbon Savings:</span>
            <span className="font-black text-emerald-500 flex items-center gap-0.5">
              <Leaf className="w-3.5 h-3.5 fill-emerald-500" />
              <span>{projectedSavings.annualSaving.toFixed(1)} kg/year</span>
            </span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs bg-background">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5 text-primary">
          <Info className="w-4 h-4 text-primary" />
          <span>What is a Carbon Twin?</span>
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Your carbon twin is an active clone that mirrors your consumption habits. Changing parameters updates your projected forecast. Save settings to establish a new baseline.
        </p>
      </div>
    </div>
  );
}
