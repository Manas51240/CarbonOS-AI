'use client';

/**
 * CarbonOS AI - Travel Footprint Analyzer
 * Advanced transportation emissions tracker with alternative routes comparison.
 */

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { calculateTransportEmissions, EMISSION_FACTORS } from '@/utils/carbonCalculations';
import { PlaneTakeoff, Car, Bus, Train, Plus, Check, Compass, Info, TrendingDown } from 'lucide-react';

export default function TravelPage() {
  const { addLog } = useCarbonStore();
  const [travelType, setTravelType] = useState<'car' | 'flight' | 'transit'>('car');
  const [distance, setDistance] = useState<string>('');
  const [subMode, setSubMode] = useState<string>('gasoline');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync submode options when type changes
  const handleTypeChange = (type: 'car' | 'flight' | 'transit') => {
    setTravelType(type);
    setIsLogged(false);
    if (type === 'car') {
      setSubMode('gasoline');
    } else if (type === 'flight') {
      setSubMode('economy');
    } else {
      setSubMode('bus');
    }
  };

  const distVal = parseFloat(distance) || 0;
  
  // Calculate selected mode emissions
  const emissions = calculateTransportEmissions({
    type: travelType,
    distance: distVal,
    fuelOrClass: subMode
  });

  // Calculate clean alternative for comparison (e.g. electric train equivalent)
  const cleanAlternativeEmissions = calculateTransportEmissions({
    type: 'transit',
    distance: distVal,
    fuelOrClass: 'train'
  });

  const savingsKg = Math.max(0, emissions - cleanAlternativeEmissions);

  // Log transport emissions
  const handleLogTrip = async () => {
    if (distVal <= 0 || loading) return;
    setLoading(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await addLog({
        date: todayStr,
        transport: emissions,
        energy: 0,
        food: 0,
        digital: 0,
        waste: 0,
        total: emissions
      });
      setIsLogged(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Travel Footprint Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Assess flight, road travel, or transit emissions and explore carbon-efficient travel options.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Inputs panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Configure Journey</h2>
            
            {/* Mode Select Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => handleTypeChange('car')}
                className={`py-3.5 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${
                  travelType === 'car'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted bg-secondary/25 hover:bg-secondary/50 text-muted-foreground'
                }`}
              >
                <Car className="w-5 h-5" />
                <span>Road Commute</span>
              </button>
              
              <button
                onClick={() => handleTypeChange('flight')}
                className={`py-3.5 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${
                  travelType === 'flight'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted bg-secondary/25 hover:bg-secondary/50 text-muted-foreground'
                }`}
              >
                <PlaneTakeoff className="w-5 h-5" />
                <span>Air Travel</span>
              </button>

              <button
                onClick={() => handleTypeChange('transit')}
                className={`py-3.5 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${
                  travelType === 'transit'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted bg-secondary/25 hover:bg-secondary/50 text-muted-foreground'
                }`}
              >
                <Bus className="w-5 h-5" />
                <span>Public Transit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distance input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="distance-input" className="text-xs font-bold text-muted-foreground">Travel Distance (miles)</label>
                <input
                  id="distance-input"
                  type="number"
                  placeholder="e.g. 25"
                  value={distance}
                  onChange={(e) => { setDistance(e.target.value); setIsLogged(false); }}
                  className="w-full px-3.5 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary text-sm font-semibold outline-none transition-all duration-300"
                />
              </div>

              {/* Sub-mode selections */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="submode-select" className="text-xs font-bold text-muted-foreground">
                  {travelType === 'car' ? 'Fuel / Engine Type' : travelType === 'flight' ? 'Flight Cabin Class' : 'Transit Mode'}
                </label>
                
                <select
                  id="submode-select"
                  value={subMode}
                  onChange={(e) => { setSubMode(e.target.value); setIsLogged(false); }}
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
              onClick={handleLogTrip}
              disabled={distVal <= 0 || loading || isLogged}
              className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                isLogged
                  ? 'bg-accent text-accent-foreground shadow-accent/20'
                  : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              {isLogged ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Trip Logged!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Log Journey</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full filter blur-lg -mr-6 -mt-6" />
            
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider self-start mb-6">Emissions Summary</h2>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-4xl mb-4">
                {travelType === 'car' ? '🚗' : travelType === 'flight' ? '✈️' : '🚆'}
              </div>
              <span className="text-3xl font-black text-foreground">{emissions.toFixed(1)}</span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">kg CO₂e Total</span>
            </div>

            {/* Travel alternative stats */}
            {distVal > 0 && savingsKg > 0 && (
              <div className="w-full mt-6 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-left">
                <h3 className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span>Eco-Optimization Savings</span>
                </h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Choosing an electric train for this route reduces travel emissions to just <span className="font-bold text-foreground">{cleanAlternativeEmissions.toFixed(1)}kg</span>, saving <span className="font-bold text-foreground">{savingsKg.toFixed(1)}kg</span> CO₂.
                </p>
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block mb-0.5">Air Travel Note:</span>
              Flight calculations apply multiplier factors (business: 2.9x, first: 4.0x) due to the larger space allocation per seat and high-altitude radiative forcing emissions.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
