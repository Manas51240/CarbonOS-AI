'use client';

import { Info } from 'lucide-react';

interface DigitalOutputCardProps {
  emissions: number;
  phoneCharges: number;
  carMilesEquivalent: string;
}

export default function DigitalOutputCard({
  emissions,
  phoneCharges,
  carMilesEquivalent
}: DigitalOutputCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col items-center justify-between text-center relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full filter blur-lg -mr-6 -mt-6" />
        
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider self-start mb-6">Digital Footprint</h2>
        
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-4xl mb-4">
            🔌
          </div>
          <span className="text-3xl font-black text-foreground">{emissions.toFixed(3)}</span>
          <span className="text-xs font-semibold text-muted-foreground mt-0.5">kg CO₂e / day</span>
        </div>

        {/* Equivalences */}
        {emissions > 0 && (
          <div className="w-full mt-6 bg-secondary/40 border border-muted/50 rounded-2xl p-4 text-left flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Smartphone Charges:</span>
              <span className="font-bold">{phoneCharges} charges</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Car Miles Equiv:</span>
              <span className="font-bold text-orange-500">{carMilesEquivalent} miles</span>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3 bg-background">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block mb-0.5">Optimization Hint:</span>
          Streaming in Standard Definition (SD) consumes roughly 75% less network transmission energy than High Definition (HD), significantly reducing active server loads.
        </div>
      </div>
    </div>
  );
}
