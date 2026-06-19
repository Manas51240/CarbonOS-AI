'use client';

/**
 * CarbonOS AI - Environmental & Eco Alerts Center
 * Renders regional alerts (heatwaves, air quality) and provides gamified
 * action plans. Completing alert tasks rewards points.
 */

import { useState } from 'react';
import { useSustainabilityInsights } from '@/hooks/useSustainabilityInsights';
import { Bell, AlertTriangle, Thermometer, Wind, Zap, Check, Sparkles } from 'lucide-react';
import ParadigmBanner from '@/components/shared/ParadigmBanner';

export default function AlertsPage() {
  const { alerts, rewardAlertAction } = useSustainabilityInsights();
  const [completedAlertIds, setCompletedAlertIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePerformAction = async (alertId: string) => {
    setLoadingId(alertId);
    try {
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Delegate rewarding transaction to custom hook
      await rewardAlertAction();

      setCompletedAlertIds(prev => [...prev, alertId]);
    } finally {
      setLoadingId(null);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <Wind className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/5';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5';
      default:
        return 'border-muted/80';
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <ParadigmBanner />
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Eco Alerts</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time weather warnings, air quality alerts, and regional grid load relief tasks.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Alerts Flow */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {alerts.map((alert) => {
            const isCompleted = completedAlertIds.includes(alert.id);
            const isLoading = loadingId === alert.id;

            return (
              <div
                key={alert.id}
                className={`glass-card rounded-3xl p-6 border flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${getBorderColor(
                  alert.type
                )}`}
              >
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border shadow-sm">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm">{alert.title}</h2>
                      <span className="text-[9px] text-muted-foreground font-semibold">{alert.date}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                    alert.type === 'danger'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : alert.type === 'warning'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {alert.type}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed px-1">{alert.message}</p>

                {/* Grid relief instructions */}
                {alert.actionRequired && (
                  <div className="bg-secondary/45 border border-muted/50 rounded-2xl p-4 mt-2">
                    <h3 className="text-[10px] font-extrabold text-foreground uppercase tracking-wider mb-2">Relief Action Checklist</h3>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">{alert.actionRequired}</p>
                    
                    <div className="mt-4 flex justify-between items-center border-t border-muted/30 pt-3">
                      <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Earns +50 Green Points</span>
                      </span>

                      {isCompleted ? (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5" />
                          <span>Action Checked!</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePerformAction(alert.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-wider hover:shadow-md cursor-pointer transition-all duration-300 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {isLoading ? 'Checking...' : 'I Did This'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Info pane */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground">
            <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <span>Smart Grid Response</span>
            </h3>
            <p className="leading-relaxed">
              When regional temperatures rise, household air conditioners force power grids to supply carbon-heavy combustion reserve plants. 
              <br /><br />
              Adjusting thermostat baselines or delaying power-heavy appliances during peak advisories directly reduces grid strain and minimizes localized carbon spikes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
