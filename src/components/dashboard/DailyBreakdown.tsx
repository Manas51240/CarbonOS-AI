'use client';

import { FootprintLog } from '@/types';
import { EmissionsDistributionChart } from '@/components/ui/InteractiveChart';

interface DailyBreakdownProps {
  todayLog: FootprintLog | null;
}

/**
 * Presentational component displaying daily, weekly, and monthly footprint projections
 * along with the category emissions breakdown chart.
 */
export default function DailyBreakdown({ todayLog }: DailyBreakdownProps) {
  const dailyVal = todayLog?.total ?? 14.5;
  const weeklyVal = dailyVal * 7;
  const monthlyVal = dailyVal * 30.4;

  const stats = [
    { label: 'Daily footprint', value: dailyVal.toFixed(1), unit: 'kg CO₂e' },
    { label: 'Weekly projected', value: weeklyVal.toFixed(1), unit: 'kg CO₂e' },
    { label: 'Monthly projected', value: monthlyVal.toFixed(1), unit: 'kg CO₂e' },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-muted/80 lg:col-span-2 bg-background shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-muted/50 pb-4">
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Emissions Tracker</h2>
          <p className="text-[10px] text-muted-foreground">Showing logs for: {todayLog?.date || 'Today (Simulated)'}</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-secondary/40 border border-muted/50 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{s.label}</span>
              <span className="text-base font-black text-primary">{s.value}</span>
              <span className="text-[9px] text-muted-foreground ml-1 font-semibold">{s.unit}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-[160px] flex items-center justify-center">
        {todayLog ? (
          <EmissionsDistributionChart data={todayLog} />
        ) : (
          <div className="text-xs text-muted-foreground text-center w-full">No emissions logged today yet.</div>
        )}
      </div>
    </div>
  );
}
