'use client';

import { Sparkles, HelpCircle } from 'lucide-react';
import { ActionPlanStep } from '@/services/SustainabilityCoachService';

interface TodayReductionPlanProps {
  personalizedPlan: ActionPlanStep[];
}

/**
 * Presentational component displaying the personalized carbon reduction advice.
 */
export default function TodayReductionPlan({ personalizedPlan }: TodayReductionPlanProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col gap-5 bg-background shadow-sm">
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Today's Carbon Reduction Plan</span>
        </h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Customized actions generated from your active Carbon Twin baseline.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {personalizedPlan.map((step, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-2xl bg-secondary/35 hover:bg-secondary/45 border border-muted/30 transition-all duration-300 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-foreground">{step.title}</span>
              <span className="text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full">
                Saves ~{step.offsetSavingKg}kg CO₂e
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              {step.strategy}
            </p>

            <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-1 border-t border-muted/20 pt-2 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                <span className="font-bold text-foreground">Why generated:</span> {step.reasonGenerated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
