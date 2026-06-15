'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { calculateTransportEmissions } from '@/utils/carbonCalculations';
import ParadigmBanner from '@/components/shared/ParadigmBanner';
import TravelInputs from '@/components/dashboard/TravelInputs';
import TravelOutputCard from '@/components/dashboard/TravelOutputCard';

/**
 * CarbonOS AI - Travel Footprint Analyzer
 * Advanced transportation emissions tracker with alternative routes comparison.
 */
export default function TravelPage() {
  const { addLog } = useCarbonStore();
  const [travelType, setTravelType] = useState<'car' | 'flight' | 'transit'>('car');
  const [distance, setDistance] = useState<string>('');
  const [subMode, setSubMode] = useState<string>('gasoline');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

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
  
  const emissions = calculateTransportEmissions({
    type: travelType,
    distance: distVal,
    fuelOrClass: subMode
  });

  const cleanAlternativeEmissions = calculateTransportEmissions({
    type: 'transit',
    distance: distVal,
    fuelOrClass: 'train'
  });

  const savingsKg = Math.max(0, emissions - cleanAlternativeEmissions);

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
      <ParadigmBanner />
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Travel Footprint Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Assess flight, road travel, or transit emissions and explore carbon-efficient travel options.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TravelInputs
          travelType={travelType}
          distance={distance}
          subMode={subMode}
          isLogged={isLogged}
          loading={loading}
          onTypeChange={handleTypeChange}
          onDistanceChange={setDistance}
          onSubModeChange={setSubMode}
          onLogTrip={handleLogTrip}
        />

        <TravelOutputCard
          travelType={travelType}
          distance={distance}
          emissions={emissions}
          cleanAlternativeEmissions={cleanAlternativeEmissions}
          savingsKg={savingsKg}
        />
      </div>
    </div>
  );
}
