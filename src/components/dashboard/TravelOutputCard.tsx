'use client';

import { Info, TrendingDown } from 'lucide-react';

interface TravelOutputCardProps {
  travelType: 'car' | 'flight' | 'transit';
  distance: string;
  emissions: number;
  cleanAlternativeEmissions: number;
  savingsKg: number;
}

export default function TravelOutputCard({
  travelType,
  distance,
  emissions,
  cleanAlternativeEmissions,
  savingsKg
}: TravelOutputCardProps) {
  const distVal = parseFloat(distance) || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col items-center justify-between text-center relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full filter blur-lg -mr-6 -mt-6" />
        
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider self-start mb-6">Emissions Summary</h2>
        
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-4xl mb-4">
            {travelType === 'car' ? '🚗' : travelType === 'flight' ? '✈️' : '🚆'}
          </div>
          <span className="text-3xl font-black text-foreground">{emissions.toFixed(1)}</span>
          <span className="text-xs font-semibold text-muted-foreground mt-0.5">kg CO₂e Total</span>
        </div>

        {/* Travel alternative stats */}
        {distVal > 0 && savingsKg > 0 && (
          <div className="w-full mt-6 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-left">
            <h3 className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-2">
              <TrendingDown className="w-4 h-4" />
              <span>Eco-Optimization Savings</span>
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Choosing an electric train for this route reduces travel emissions to just <span className="font-bold text-foreground">{cleanAlternativeEmissions.toFixed(1)}kg</span>, saving <span className="font-bold text-foreground">{savingsKg.toFixed(1)}kg</span> CO₂.
            </p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3 bg-background">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-0.5">Air Travel Note:</span>
          Flight calculations apply multiplier factors (business: 2.9x, first: 4.0x) due to the larger space allocation per seat and high-altitude radiative forcing emissions.
        </div>
      </div>
    </div>
  );
}
