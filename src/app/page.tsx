'use client';

import { Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { useCarbonScore } from '@/hooks/useCarbonScore';
import { useEmissionTracking } from '@/hooks/useEmissionTracking';
import { useSustainabilityInsights } from '@/hooks/useSustainabilityInsights';
import { CarbonCalculationService } from '@/services/CarbonCalculationService';

import ParadigmBanner from '@/components/shared/ParadigmBanner';
import ScoreTracker from '@/components/ui/ScoreTracker';
import DailyBreakdown from '@/components/dashboard/DailyBreakdown';
import QuickLogForm from '@/components/dashboard/QuickLogForm';
import TodayReductionPlan from '@/components/dashboard/TodayReductionPlan';
import { EmissionsTrendChart } from '@/components/ui/InteractiveChart';

/**
 * CarbonOS AI - Main Console Dashboard
 * Displays central sustainability scores, logs, trends, and plans.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { score } = useCarbonScore();
  const { logs, addLog } = useEmissionTracking();
  const { alerts, personalizedPlan, challenges } = useSustainabilityInsights();

  const activeAlert = alerts[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr) || logs[logs.length - 1] || null;

  const handleLogActivity = async (
    carMiles: number, 
    electricityKwh: number, 
    diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy'
  ) => {
    const cleanEnergyPercentage = user?.carbonTwin?.homeEnergy === '100-solar' 
      ? 100 
      : user?.carbonTwin?.homeEnergy === 'partial-solar' 
      ? 50 
      : 0;

    const footprint = CarbonCalculationService.calculateTotal({
      transport: [{ type: 'car', distance: carMiles, fuelOrClass: user?.carbonTwin?.transportMode || 'gasoline' }],
      energy: { electricityKwh, gasTherms: 0, cleanEnergyPercentage },
      food: { dietType: diet, servingsRedMeat: diet === 'meat-heavy' ? 1.5 : 0, localFoodPercentage: 20 },
      digital: { emailsSent: 15, streamingHours: 2, videoCallsHours: 1, cloudStorageGb: 10 },
      waste: { landfillLbs: 2, recycledLbs: 1.5, compostedLbs: 0.5 }
    });

    await addLog({
      date: todayStr,
      transport: footprint.transport,
      energy: footprint.energy,
      food: footprint.food,
      digital: footprint.digital,
      waste: footprint.waste,
      total: footprint.total
    });
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      {/* Visual Paradigm Flow Banner */}
      <ParadigmBanner />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Console Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="font-bold text-foreground">{user?.displayName}</span>! Here is your sustainability index today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-secondary/80 border border-muted/80 rounded-xl px-4 py-2.5 shadow-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>June 15, 2026</span>
        </div>
      </header>

      {/* Heatwave & Sustainability Alerts Ticker */}
      {activeAlert && (
        <div className="p-4 rounded-2xl border flex items-start gap-4 shadow-sm relative overflow-hidden bg-destructive/10 border-destructive/20 text-destructive-foreground">
          <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full filter blur-lg -mr-6 -mt-6" />
          <div className="p-2 rounded-xl bg-background flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              {activeAlert.title}
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{activeAlert.message}</p>
          </div>
          <Link href="/alerts" className="text-xs font-bold flex items-center gap-1 hover:underline text-primary self-center">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Hero Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-between border border-muted/80 bg-background">
          <h2 className="text-sm font-bold text-muted-foreground self-start mb-2 uppercase tracking-wider">Sustainability Score</h2>
          <ScoreTracker score={score} size={150} />
          <p className="text-xs text-center text-muted-foreground mt-4 font-medium px-4">
            Derived from your baseline carbon twin settings and daily logs.
          </p>
        </div>
        <DailyBreakdown todayLog={todayLog} />
      </section>

      {/* Plan and Charts section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TodayReductionPlan personalizedPlan={personalizedPlan} />
          
          <div className="glass-card rounded-3xl p-6 border border-muted/80 bg-background">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Historical Trend & Forecast</h2>
            <EmissionsTrendChart logs={logs} />
          </div>
        </div>

        <QuickLogForm onLogSubmit={handleLogActivity} />
      </section>
 
      {/* Daily Challenges Quick Access */}
      <section className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col md:flex-row justify-between items-center gap-4 bg-background">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider">Active Challenge Tracker</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {challenges.filter(c => c.joined && !c.completed).length > 0 
              ? `You have ${challenges.filter(c => c.joined && !c.completed).length} active challenges to earn Green Points!`
              : 'No active challenges joined. Head over to the Leaderboards to take part in daily eco goals!'}
          </p>
        </div>
        <Link href="/community" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:shadow-md transition-all duration-300">
          Browse Challenges
        </Link>
      </section>
    </div>
  );
}
