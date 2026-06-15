'use client';

import { Layers, RefreshCw, Sparkles, Check } from 'lucide-react';
import { CarbonTwinState } from '@/types';
import SimulatedShareBreakdown from './SimulatedShareBreakdown';
import SimulatorControls from './SimulatorControls';

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

        <SimulatorControls
          diet={diet}
          commuteDist={commuteDist}
          transportMode={transportMode}
          energySource={energySource}
          digitalLevel={digitalLevel}
          onDietChange={onDietChange}
          onCommuteChange={onCommuteChange}
          onTransportChange={onTransportChange}
          onEnergyChange={onEnergyChange}
          onDigitalChange={onDigitalChange}
        />

        {/* Share breakdown */}
        <SimulatedShareBreakdown simShare={simShare} />
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
  );
}
