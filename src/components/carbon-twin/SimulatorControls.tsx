'use client';

import { CarbonTwinState } from '@/types';

interface SimulatorControlsProps {
  diet: CarbonTwinState['dietType'];
  commuteDist: number;
  transportMode: CarbonTwinState['carFuel'];
  energySource: CarbonTwinState['homeEnergySource'];
  digitalLevel: CarbonTwinState['digitalUsageLevel'];
  onDietChange: (val: CarbonTwinState['dietType']) => void;
  onCommuteChange: (val: number) => void;
  onTransportChange: (val: CarbonTwinState['carFuel']) => void;
  onEnergyChange: (val: CarbonTwinState['homeEnergySource']) => void;
  onDigitalChange: (val: CarbonTwinState['digitalUsageLevel']) => void;
}

export default function SimulatorControls({
  diet,
  commuteDist,
  transportMode,
  energySource,
  digitalLevel,
  onDietChange,
  onCommuteChange,
  onTransportChange,
  onEnergyChange,
  onDigitalChange
}: SimulatorControlsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Diet Type */}
      <div className="flex flex-col gap-2">
        <label htmlFor="diet-select" className="text-xs font-bold text-muted-foreground">Diet Selection</label>
        <select
          id="diet-select"
          value={diet}
          onChange={(e) => onDietChange(e.target.value as CarbonTwinState['dietType'])}
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
          aria-valuetext={`${commuteDist} miles`}
          className="w-full h-2 rounded-lg bg-secondary/80 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer mt-3"
        />
      </div>

      {/* Vehicle Fuel Type */}
      <div className="flex flex-col gap-2">
        <label htmlFor="transport-select" className="text-xs font-bold text-muted-foreground">Vehicle Engine Type</label>
        <select
          id="transport-select"
          value={transportMode}
          onChange={(e) => onTransportChange(e.target.value as CarbonTwinState['carFuel'])}
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
          onChange={(e) => onEnergyChange(e.target.value as CarbonTwinState['homeEnergySource'])}
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
          onChange={(e) => onDigitalChange(e.target.value as CarbonTwinState['digitalUsageLevel'])}
          className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
        >
          <option value="low">Minimal (Eco stream, local mail)</option>
          <option value="average">Standard Work / Stream Mix</option>
          <option value="high">Heavy (4K Stream, server storage)</option>
        </select>
      </div>
    </div>
  );
}
