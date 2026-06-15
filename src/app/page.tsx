'use client';

/**
 * CarbonOS AI - Main Console Dashboard
 * Primary panel coordinating score arcs, quick logging forms, interactive forecasting,
 * and regional alerts.
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import ScoreTracker from '@/components/ui/ScoreTracker';
import { EmissionsTrendChart, EmissionsDistributionChart } from '@/components/ui/InteractiveChart';
import { calculateTotalDailyFootprint } from '@/utils/carbonCalculations';
import { 
  Sparkles, 
  Calendar, 
  Car, 
  Flame, 
  Utensils, 
  Plus, 
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { logs, addLog, challenges, alerts } = useCarbonStore();

  // Quick activity logger state
  const [carMiles, setCarMiles] = useState<string>('');
  const [diet, setDiet] = useState<'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy'>('flexitarian');
  const [electricity, setElectricity] = useState<string>('');
  const [isLogging, setIsLogging] = useState(false);

  const activeAlert = alerts[0]; // main heatwave alert

  // Quick submit
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    const transportMiles = parseFloat(carMiles) || 0;
    const homeKwh = parseFloat(electricity) || 0;

    // Standard aggregation
    const footprint = calculateTotalDailyFootprint({
      transport: [{ type: 'car', distance: transportMiles, fuelOrClass: user?.carbonTwin?.transportMode || 'gasoline' }],
      energy: { electricityKwh: homeKwh, gasTherms: 0, cleanEnergyPercentage: user?.carbonTwin?.homeEnergy === '100-solar' ? 100 : user?.carbonTwin?.homeEnergy === 'partial-solar' ? 50 : 0 },
      food: { dietType: diet, servingsRedMeat: diet === 'meat-heavy' ? 1.5 : 0, localFoodPercentage: 20 },
      digital: { emailsSent: 15, streamingHours: 2, videoCallsHours: 1, cloudStorageGb: 10 },
      waste: { landfillLbs: 2, recycledLbs: 1.5, compostedLbs: 0.5 }
    });

    const todayStr = new Date().toISOString().split('T')[0];

    try {
      await addLog({
        date: todayStr,
        transport: footprint.transport,
        energy: footprint.energy,
        food: footprint.food,
        digital: footprint.digital,
        waste: footprint.waste,
        total: footprint.total
      });

      // Reset
      setCarMiles('');
      setElectricity('');
    } finally {
      setIsLogging(false);
    }
  };

  // Calculate stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === todayStr) || logs[logs.length - 1];

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      {/* Top Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Console Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="font-bold text-foreground">{user?.displayName}</span>! Here is your sustainability index today.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold bg-secondary/80 border border-muted/80 rounded-xl px-4 py-2.5 shadow-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>June 14, 2026</span>
        </div>
      </header>

      {/* Heatwave & Sustainability Alerts Ticker */}
      {activeAlert && (
        <div className={`p-4 rounded-2xl border flex items-start gap-4 shadow-sm relative overflow-hidden transition-all duration-300 ${
          activeAlert.type === 'danger'
            ? 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full filter blur-lg -mr-6 -mt-6" />
          <div className="p-2 rounded-xl bg-background flex items-center justify-center shadow-sm">
            <AlertTriangle className={`w-5 h-5 ${activeAlert.type === 'danger' ? 'text-destructive' : 'text-amber-500'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              {activeAlert.title}
              <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{activeAlert.message}</p>
            {activeAlert.actionRequired && (
              <p className="text-xs font-bold text-foreground mt-2 flex items-center gap-1">
                👉 <span className="underline decoration-dotted">{activeAlert.actionRequired}</span>
              </p>
            )}
          </div>
          <Link href="/alerts" className="text-xs font-bold flex items-center gap-1 hover:underline text-primary self-center">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Hero Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Score Arc */}
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-between border border-muted/80">
          <h2 className="text-sm font-bold text-muted-foreground self-start mb-2 uppercase tracking-wider">Sustainability Score</h2>
          <ScoreTracker score={user?.sustainabilityScore || 70} size={150} />
          <p className="text-xs text-center text-muted-foreground mt-4 font-medium px-4">
            Score derived from emissions logs and offset contributions. Keep daily emissions under 10kg to reach 100!
          </p>
        </div>

        {/* Daily Footprint Breakdown */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-muted/80 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Emissions Breakdown</h2>
              <p className="text-[10px] text-muted-foreground">Showing logs for: {todayLog?.date || 'Today (Simulated)'}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">{(todayLog?.total || 14.5).toFixed(1)}</span>
              <span className="text-xs font-semibold text-muted-foreground ml-1">kg CO₂e</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center">
            {todayLog ? (
              <EmissionsDistributionChart data={todayLog} />
            ) : (
              <div className="text-xs text-muted-foreground text-center w-full">No emissions logged today yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Main Charts & Logger section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Forecast Graph */}
        <div className="glass-card rounded-3xl p-6 border border-muted/80 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Historical Trend & AI Forecast</h2>
              <p className="text-[10px] text-muted-foreground">Track emission trajectories compared to reduction targets</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-12.4% avg decrease</span>
            </div>
          </div>
          <EmissionsTrendChart logs={logs} />
        </div>

        {/* Quick Log Form */}
        <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Quick Log Activity</h2>
            <p className="text-xs text-muted-foreground mb-6">Log today's key actions to update your carbon twin</p>
            
            <form onSubmit={handleLogActivity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="quick-commute-input" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-primary" />
                  <span>Commute (Car Miles)</span>
                </label>
                <input
                  id="quick-commute-input"
                  type="number"
                  placeholder="e.g. 15"
                  value={carMiles}
                  onChange={(e) => setCarMiles(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="quick-power-input" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Home Power (Grid kWh)</span>
                </label>
                <input
                  id="quick-power-input"
                  type="number"
                  placeholder="e.g. 12"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="quick-diet-select" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-red-500" />
                  <span>Primary Diet Choice</span>
                </label>
                <select
                  id="quick-diet-select"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
                >
                  <option value="vegan">Vegan (Low Impact)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="flexitarian">Low-meat Flexitarian</option>
                  <option value="meat-heavy">Meat Heavy (High Impact)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLogging}
                className="w-full py-3 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              >
                <Plus className="w-4 h-4" />
                <span>Log Activity Today</span>
              </button>
            </form>
          </div>

          <div className="text-[10px] text-center text-muted-foreground mt-6 border-t border-muted/50 pt-4 font-semibold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Updates your forecasting and avatar twin instantly!</span>
          </div>
        </div>
      </section>

      {/* Daily Challenges Quick Access */}
      <section className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col md:flex-row justify-between items-center gap-4">
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
