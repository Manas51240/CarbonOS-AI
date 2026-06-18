'use client';

import { PlaneTakeoff, Car, Bus, Compass } from 'lucide-react';

interface TravelInputsProps {
  travelType: 'car' | 'flight' | 'transit';
  distance: string;
  subMode: string;
  isLogged: boolean;
  loading: boolean;
  onTypeChange: (type: 'car' | 'flight' | 'transit') => void;
  onDistanceChange: (val: string) => void;
  onSubModeChange: (val: string) => void;
  onLogTrip: () => void;
}

export default function TravelInputs({
  travelType,
  distance,
  subMode,
  isLogged,
  loading,
  onTypeChange,
  onDistanceChange,
  onSubModeChange,
  onLogTrip
}: TravelInputsProps) {
  const distVal = parseFloat(distance) || 0;

  return (
    <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between bg-background">
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Configure Journey</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6" role="group" aria-label="Travel mode">
          <button
            onClick={() => onTypeChange('car')}
            aria-pressed={travelType === 'car'}
            className={`py-3 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
              travelType === 'car' ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-secondary/25 text-muted-foreground'
            }`}
          >
            <Car aria-hidden="true" className="w-4 h-4" />
            <span>Road Commute</span>
          </button>
          
          <button
            onClick={() => onTypeChange('flight')}
            aria-pressed={travelType === 'flight'}
            className={`py-3 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
              travelType === 'flight' ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-secondary/25 text-muted-foreground'
            }`}
          >
            <PlaneTakeoff aria-hidden="true" className="w-4 h-4" />
            <span>Air Travel</span>
          </button>

          <button
            onClick={() => onTypeChange('transit')}
            aria-pressed={travelType === 'transit'}
            className={`py-3 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
              travelType === 'transit' ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-secondary/25 text-muted-foreground'
            }`}
          >
            <Bus aria-hidden="true" className="w-4 h-4" />
            <span>Public Transit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="distance-input" className="text-xs font-bold text-muted-foreground">Travel Distance (miles)</label>
            <input
              id="distance-input"
              type="number"
              placeholder="e.g. 25"
              value={distance}
              onChange={(e) => onDistanceChange(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="submode-select" className="text-xs font-bold text-muted-foreground">
              {travelType === 'car' ? 'Fuel / Engine Type' : travelType === 'flight' ? 'Flight Cabin Class' : 'Transit Mode'}
            </label>
            <select
              id="submode-select"
              value={subMode}
              onChange={(e) => onSubModeChange(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
            >
              {travelType === 'car' && (
                <>
                  <option value="gasoline">Gasoline Car (0.40kg/mi)</option>
                  <option value="diesel">Diesel Car (0.41kg/mi)</option>
                  <option value="hybrid">Hybrid Engine (0.20kg/mi)</option>
                  <option value="electric">Electric Vehicle (0.08kg/mi)</option>
                </>
              )}
              {travelType === 'flight' && (
                <>
                  <option value="economy">Economy Class (Base factor)</option>
                  <option value="business">Business Class (2.9x multiplier)</option>
                  <option value="first">First Class (4.0x multiplier)</option>
                </>
              )}
              {travelType === 'transit' && (
                <>
                  <option value="bus">City Bus (0.09kg/mi)</option>
                  <option value="train">Electric Rail / Train (0.04kg/mi)</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
          <Compass className="w-4 h-4 text-primary" />
          <span>EPA transport parameters updated automatically.</span>
        </span>

        <button
          onClick={onLogTrip}
          disabled={distVal <= 0 || loading || isLogged}
          className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
            isLogged ? 'bg-accent text-accent-foreground shadow-accent/20' : 'bg-primary text-primary-foreground hover:shadow-lg'
          }`}
        >
          {isLogged ? 'Trip Logged!' : 'Log Journey'}
        </button>
      </div>
    </div>
  );
}
