'use client';

/**
 * CarbonOS AI - AI Carbon Twin Simulator Dashboard
 * Real-time lifestyle simulator letting users configure different parameters
 * and visualize their carbon clone footprint.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { calculateTotalDailyFootprint } from '@/utils/carbonCalculations';
import { FirebaseService } from '@/services/firebase';
import { Layers, Sparkles, Check, Info, Heart, RefreshCw } from 'lucide-react';

export default function CarbonTwinPage() {
  const { user, refreshProfile } = useAuth();
  const { twinSimState, updateTwinSim } = useCarbonStore();

  // Local state to manage sliders before committing or comparing
  const [diet, setDiet] = useState(twinSimState.dietType);
  const [commuteDist, setCommuteDist] = useState(twinSimState.dailyCommuteMiles);
  const [transportMode, setTransportMode] = useState(twinSimState.carFuel);
  const [energySource, setEnergySource] = useState(twinSimState.homeEnergySource);
  const [digitalLevel, setDigitalLevel] = useState(twinSimState.digitalUsageLevel);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with global store state initially
  useEffect(() => {
    setDiet(twinSimState.dietType);
    setCommuteDist(twinSimState.dailyCommuteMiles);
    setTransportMode(twinSimState.carFuel);
    setEnergySource(twinSimState.homeEnergySource);
    setDigitalLevel(twinSimState.digitalUsageLevel);
  }, [twinSimState]);

  // Calculate live simulator emissions
  const computeSimulatedFootprint = () => {
    // Translate energy
    const electricityKwh = energySource === '100-solar' ? 0 : energySource === 'partial-solar' ? 6 : 12;
    // Translate digital
    const digitalInputs = 
      digitalLevel === 'low' 
        ? { emailsSent: 5, streamingHours: 1, videoCallsHours: 0, cloudStorageGb: 2 } 
        : digitalLevel === 'high' 
        ? { emailsSent: 40, streamingHours: 6, videoCallsHours: 4, cloudStorageGb: 50 } 
        : { emailsSent: 15, streamingHours: 2, videoCallsHours: 1, cloudStorageGb: 10 };

    const wasteInputs = { landfillLbs: 2, recycledLbs: 1.5, compostedLbs: 0.5 };

    const totals = calculateTotalDailyFootprint({
      transport: [{ type: 'car', distance: commuteDist, fuelOrClass: transportMode }],
      energy: { electricityKwh, gasTherms: 0, cleanEnergyPercentage: energySource === '100-solar' ? 100 : energySource === 'partial-solar' ? 50 : 0 },
      food: { dietType: diet, servingsRedMeat: diet === 'meat-heavy' ? 1.5 : 0, localFoodPercentage: 20 },
      digital: digitalInputs,
      waste: wasteInputs
    });

    return totals;
  };

  const simFootprint = computeSimulatedFootprint();
  const dailyTotal = simFootprint.total;

  // Determine avatar background health status based on daily carbon totals
  let healthStatus = 'optimal'; // < 12kg
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

  // Commit simulator changes back to user database settings
  const handleCommitSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      updateTwinSim({
        dietType: diet,
        dailyCommuteMiles: commuteDist,
        carFuel: transportMode,
        homeEnergySource: energySource,
        digitalUsageLevel: digitalLevel
      });

      // Update actual firebase-mock user record
      await FirebaseService.db.updateCarbonTwin({
        diet,
        transportMode,
        commuteDistance: commuteDist,
        homeEnergy: energySource,
        digitalUsage: digitalLevel
      });

      // Trigger recalculations
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Carbon Twin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Simulate carbon-emission variations and configure your lifestyle twin parameters.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Avatar Panel */}
        <div className="flex flex-col gap-6">
          <div className={`glass-card rounded-3xl p-6 border flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 ${glowColor}`}>
            {/* Health status badge */}
            <span className={`absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              healthStatus === 'optimal' 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse'
                : healthStatus === 'warning'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20 animate-bounce'
            }`}>
              {healthLabel}
            </span>

            {/* Simulated Avatar Visualizer */}
            <div className="w-32 h-32 rounded-full bg-secondary/80 border-2 border-muted flex items-center justify-center text-6xl shadow-inner mt-8 mb-6 relative animate-float">
              <span className="relative z-10">{avatarEmoji}</span>
              <div className="absolute inset-0 bg-primary/5 rounded-full filter blur-md animate-pulse" />
            </div>

            <h2 className="text-lg font-bold">{user?.displayName}'s Twin</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Simulated Daily Carbon Footprint output:
            </p>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black">{dailyTotal.toFixed(1)}</span>
              <span className="text-xs font-semibold text-muted-foreground">kg CO₂e</span>
            </div>

            {/* Simulated versus average */}
            <div className="w-full mt-6 bg-secondary/40 border border-muted/50 rounded-2xl p-4 text-left">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-muted-foreground font-semibold">Sim Footprint:</span>
                <span className="font-bold">{dailyTotal.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Global Target:</span>
                <span className="font-bold text-accent">5.0 kg</span>
              </div>
              <div className="w-full bg-muted/50 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    dailyTotal <= 12 ? 'bg-accent' : dailyTotal <= 25 ? 'bg-amber-500' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, (dailyTotal / 35) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5 text-primary">
              <Info className="w-4 h-4 text-primary" />
              <span>What is a Carbon Twin?</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Your carbon twin is an active clone that mirrors your consumption habits. Changing your parameters updates your projected forecast. Save settings to establish a new carbon footprint baseline.
            </p>
          </div>
        </div>

        {/* Right Sliders Simulator Panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-muted/50 pb-4">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Simulation Parameters</span>
              </h2>
              <button 
                onClick={() => {
                  setDiet(twinSimState.dietType);
                  setCommuteDist(twinSimState.dailyCommuteMiles);
                  setTransportMode(twinSimState.carFuel);
                  setEnergySource(twinSimState.homeEnergySource);
                  setDigitalLevel(twinSimState.digitalUsageLevel);
                }}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg bg-secondary/50 hover:bg-secondary border transition-all duration-200"
                title="Reset simulation parameters to match user profile settings"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diet Type */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Diet Selection</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
                >
                  <option value="vegan">Vegan (Low CO₂)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="flexitarian">Flexitarian (Low-meat)</option>
                  <option value="meat-heavy">Meat Heavy (High CO₂)</option>
                </select>
              </div>

              {/* Commute Distance slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground">Daily Commute Distance</label>
                  <span className="text-xs font-bold text-primary">{commuteDist} miles</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={commuteDist}
                  onChange={(e) => setCommuteDist(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
                />
              </div>

              {/* Vehicle Fuel Type */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Vehicle Engine Type</label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
                >
                  <option value="electric">Electric (EV)</option>
                  <option value="hybrid">Hybrid Engine</option>
                  <option value="gasoline">Gasoline Engine</option>
                  <option value="diesel">Diesel Engine</option>
                </select>
              </div>

              {/* Energy Source */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Home Electricity Grid Source</label>
                <select
                  value={energySource}
                  onChange={(e) => setEnergySource(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
                >
                  <option value="100-solar">100% Rooftop Solar / Off-Grid</option>
                  <option value="partial-solar">Partial Solar / Renewable Plan</option>
                  <option value="grid-mix">Standard Utility Grid Mix</option>
                </select>
              </div>

              {/* Digital level */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Digital Usage Pattern</label>
                <select
                  value={digitalLevel}
                  onChange={(e) => setDigitalLevel(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
                >
                  <option value="low">Minimal (Eco stream, local mail)</option>
                  <option value="average">Standard Work / Stream Mix</option>
                  <option value="high">Heavy (4K Stream, server storage)</option>
                </select>
              </div>
            </div>

            {/* Sim breakdown bars */}
            <div className="mt-8 pt-6 border-t border-muted/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Simulated Footprint Share</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🚗 Transport</span>
                  <span className="text-sm font-bold text-foreground">{simFootprint.transport.toFixed(1)} kg</span>
                </div>
                <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">⚡ Energy</span>
                  <span className="text-sm font-bold text-foreground">{simFootprint.energy.toFixed(1)} kg</span>
                </div>
                <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🍔 Food & Diet</span>
                  <span className="text-sm font-bold text-foreground">{simFootprint.food.toFixed(1)} kg</span>
                </div>
                <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">💻 Digital</span>
                  <span className="text-sm font-bold text-foreground">{simFootprint.digital.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>Saving updates your profile defaults and recalculates your score.</span>
            </span>

            <button
              onClick={handleCommitSettings}
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                saveSuccess
                  ? 'bg-accent text-accent-foreground shadow-accent/20'
                  : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Synchronized!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Commit Twin Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
