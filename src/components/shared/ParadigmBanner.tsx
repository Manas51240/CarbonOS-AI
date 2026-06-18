'use client';

import { ArrowRight, Info, Eye, BarChart3, Zap, ShieldCheck } from 'lucide-react';

/**
 * Presentational component displaying the CarbonOS AI paradigm banner:
 * UNDERSTAND -> TRACK -> REDUCE -> IMPROVE
 */
export default function ParadigmBanner() {
  const steps = [
    { label: 'Understand', icon: Eye, color: 'text-blue-500 bg-blue-500/10 border-blue-500/25' },
    { label: 'Track', icon: BarChart3, color: 'text-primary bg-primary/10 border-primary/25' },
    { label: 'Reduce', icon: Zap, color: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
    { label: 'Improve', icon: ShieldCheck, color: 'text-accent bg-accent/10 border-accent/25' },
  ];

  return (
    <div className="glass-card rounded-3xl p-5 border border-muted/80 relative overflow-hidden bg-gradient-to-r from-secondary/35 via-background to-secondary/35 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-xl pointer-events-none" />
      
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center border shadow-sm">
          <Info aria-hidden="true" className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-xs text-foreground uppercase tracking-wider">Carbon Reduction Lifecycle</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Follow the core process to optimize your environmental footprint.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 md:gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center gap-1.5 md:gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${step.color} shadow-sm`}>
                <Icon aria-hidden="true" className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-muted-foreground/60" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
