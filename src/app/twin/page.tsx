'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCarbonTwin } from '@/hooks/useCarbonTwin';
import { useForecast } from '@/hooks/useForecast';
import { useEmissionTracking } from '@/hooks/useEmissionTracking';

import { CarbonCalculationService } from '@/services/CarbonCalculationService';

import ParadigmBanner from '@/components/shared/ParadigmBanner';
import TwinAvatar from '@/components/carbon-twin/TwinAvatar';
import SimulatorParams from '@/components/carbon-twin/SimulatorParams';
import { CarbonTwinState } from '@/types';

/**
 * CarbonOS AI - AI Carbon Twin Simulator Dashboard
 * Real-time lifestyle simulator page.
 */
export default function CarbonTwinPage() {
  const { user } = useAuth();
  const { twinSimState, commitTwinSettings } = useCarbonTwin();
  const { getProjectedSavings } = useForecast();
  const { logs } = useEmissionTracking();

  // Local state to manage sliders before committing or comparing
  const [diet, setDiet] = useState<CarbonTwinState['dietType']>(twinSimState.dietType);
  const [commuteDist, setCommuteDist] = useState<number>(twinSimState.dailyCommuteMiles);
  const [transportMode, setTransportMode] = useState<CarbonTwinState['carFuel']>(twinSimState.carFuel);
  const [energySource, setEnergySource] = useState<CarbonTwinState['homeEnergySource']>(twinSimState.homeEnergySource);
  const [digitalLevel, setDigitalLevel] = useState<CarbonTwinState['digitalUsageLevel']>(twinSimState.digitalUsageLevel);
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

  // Translate power and digital levels to values for CalculationService
  const electricityKwh = energySource === '100-solar' ? 0 : energySource === 'partial-solar' ? 6 : 12;
  const digitalInputs = 
    digitalLevel === 'low' 
      ? { emailsSent: 5, streamingHours: 1, videoCallsHours: 0, cloudStorageGb: 2 } 
      : digitalLevel === 'high' 
      ? { emailsSent: 40, streamingHours: 6, videoCallsHours: 4, cloudStorageGb: 50 } 
      : { emailsSent: 15, streamingHours: 2, videoCallsHours: 1, cloudStorageGb: 10 };

  const simFootprint = CarbonCalculationService.calculateTotal({
    transport: [{ type: 'car', distance: commuteDist, fuelOrClass: transportMode }],
    energy: { electricityKwh, gasTherms: 0, cleanEnergyPercentage: energySource === '100-solar' ? 100 : energySource === 'partial-solar' ? 50 : 0 },
    food: { dietType: diet, servingsRedMeat: diet === 'meat-heavy' ? 1.5 : 0, localFoodPercentage: 20 },
    digital: digitalInputs,
    waste: { landfillLbs: 2, recycledLbs: 1.5, compostedLbs: 0.5 }
  });

  const dailyTotal = simFootprint.total;
  const currentTotal = logs.length > 0 ? logs[logs.length - 1].total : 14.5;
  const projectedSavings = getProjectedSavings(dailyTotal);

  const handleReset = () => {
    setDiet(twinSimState.dietType);
    setCommuteDist(twinSimState.dailyCommuteMiles);
    setTransportMode(twinSimState.carFuel);
    setEnergySource(twinSimState.homeEnergySource);
    setDigitalLevel(twinSimState.digitalUsageLevel);
  };

  const handleCommitSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Delegate settings commit side-effects entirely to custom hook
      await commitTwinSettings({
        diet,
        transportMode,
        commuteDistance: commuteDist,
        homeEnergy: energySource,
        digitalUsage: digitalLevel
      });

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
      <ParadigmBanner />

      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Carbon Twin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Simulate carbon-emission variations and configure your lifestyle twin parameters.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TwinAvatar 
          displayName={user?.displayName || 'there'} 
          dailyTotal={dailyTotal} 
          currentTotal={currentTotal} 
          projectedSavings={projectedSavings} 
        />

        <SimulatorParams 
          diet={diet}
          commuteDist={commuteDist}
          transportMode={transportMode}
          energySource={energySource}
          digitalLevel={digitalLevel}
          simShare={simFootprint}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          onReset={handleReset}
          onDietChange={setDiet}
          onCommuteChange={setCommuteDist}
          onTransportChange={setTransportMode}
          onEnergyChange={setEnergySource}
          onDigitalChange={setDigitalLevel}
          onSave={handleCommitSettings}
        />
      </div>
    </div>
  );
}
