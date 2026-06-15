'use client';

import { Layers, RefreshCw, Sparkles, Check } from 'lucide-react';
import { CarbonTwinState } from '@/types';

interface SimulatorParamsProps {
  diet: CarbonTwinState['dietType'];
  commuteDist: number;
  transportMode: CarbonTwinState['carFuel'];
  energySource: CarbonTwinState['homeEnergySource'];
  digitalLevel: CarbonTwinState['digitalUsageLevel'];
  simShare: { transport: number; energy: number; food: number; digital: number };
  isSaving: boolean;
  saveSuccess: boolean;
  onReset: () => void;
  onDietChange: (val: CarbonTwinState['dietType']) => void;
  onCommuteChange: (val: number) => void;
  onTransportChange: (val: CarbonTwinState['carFuel']) => void;
  onEnergyChange: (val: CarbonTwinState['homeEnergySource']) => void;
  onDigitalChange: (val: CarbonTwinState['digitalUsageLevel']) => void;
  onSave: () => void;
}

/**
 * Presentational component displaying sliders and dropdown parameter selectors for the Carbon Twin simulation.
 */
export default function SimulatorParams({
  diet,
  commuteDist,
  transportMode,
  energySource,
  digitalLevel,
  simShare,
  isSaving,
  saveSuccess,
  onReset,
  onDietChange,
  onCommuteChange,
  onTransportChange,
  onEnergyChange,
  onDigitalChange,
  onSave
}: SimulatorParamsProps) {
  return (
    <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between bg-background shadow-sm">
      <div>
        <div className="flex justify-between items-center mb-8 border-b border-muted/50 pb-4">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>Simulation Parameters</span>
          </h2>
          <button 
            onClick={onReset}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg bg-secondary/50 hover:bg-secondary border transition-all duration-200 cursor-pointer"
            title="Reset simulation parameters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diet Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="diet-select" className="text-xs font-bold text-muted-foreground">Diet Selection</label>
            <select
              id="diet-select"
              value={diet}
              onChange={(e) => onDietChange(e.target.value as any)}
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
              <label htmlFor="commute-range" className="text-xs font-bold text-muted-foreground">Daily Commute Distance</label>
              <span className="text-xs font-bold text-primary">{commuteDist} miles</span>
            </div>
            <input
              id="commute-range"
              type="range"
              min="0"
              max="100"
              value={commuteDist}
              onChange={(e) => onCommuteChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
            />
          </div>

          {/* Vehicle Fuel Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transport-select" className="text-xs font-bold text-muted-foreground">Vehicle Engine Type</label>
            <select
              id="transport-select"
              value={transportMode}
              onChange={(e) => onTransportChange(e.target.value as any)}
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
            <label htmlFor="energy-select" className="text-xs font-bold text-muted-foreground">Home Electricity Grid Source</label>
            <select
              id="energy-select"
              value={energySource}
              onChange={(e) => onEnergyChange(e.target.value as any)}
              className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
            >
              <option value="100-solar">100% Rooftop Solar / Off-Grid</option>
              <option value="partial-solar">Partial Solar / Renewable Plan</option>
              <option value="grid-mix">Standard Utility Grid Mix</option>
            </select>
          </div>

          {/* Digital level */}
          <div className="flex flex-col gap-2">
            <label htmlFor="digital-select" className="text-xs font-bold text-muted-foreground">Digital Usage Pattern</label>
            <select
              id="digital-select"
              value={digitalLevel}
              onChange={(e) => onDigitalChange(e.target.value as any)}
              className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
            >
              <option value="low">Minimal (Eco stream, local mail)</option>
              <option value="average">Standard Work / Stream Mix</option>
              <option value="high">Heavy (4K Stream, server storage)</option>
            </select>
          </div>
        </div>

        {/* Share breakdown */}
        <div className="mt-8 pt-6 border-t border-muted/50">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Simulated Share</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🚗 Transport</span>
              <span className="text-sm font-bold text-foreground">{simShare.transport.toFixed(1)} kg</span>
            </div>
            <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">⚡ Energy</span>
              <span className="text-sm font-bold text-foreground">{simShare.energy.toFixed(1)} kg</span>
            </div>
            <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🍔 Food & Diet</span>
              <span className="text-sm font-bold text-foreground">{simShare.food.toFixed(1)} kg</span>
            </div>
            <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">💻 Digital</span>
              <span className="text-sm font-bold text-foreground">{simShare.digital.toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <span className="text-xs text-muted-foreground font-semibold">
          Committing updates your default Carbon Twin baseline.
        </span>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            saveSuccess
              ? 'bg-accent text-accent-foreground shadow-accent/20'
              : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Twin Synchronized!</span>
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
  );
}
