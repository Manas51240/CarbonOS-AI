'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { calculateDigitalEmissions } from '@/utils/carbonCalculations';
import ParadigmBanner from '@/components/shared/ParadigmBanner';
import DigitalInputs from '@/components/dashboard/DigitalInputs';
import DigitalOutputCard from '@/components/dashboard/DigitalOutputCard';

/**
 * CarbonOS AI - Digital Carbon Calculator
 * Estimates emissions from cloud servers, streaming services, emails,
 * and virtual conferences, providing comparisons and saving tips.
 */
export default function DigitalPage() {
  const { addLog } = useCarbonStore();
  const [emails, setEmails] = useState('15');
  const [streaming, setStreaming] = useState('2');
  const [calls, setCalls] = useState('1');
  const [storage, setStorage] = useState('20');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  // Compute live calculations
  const emailsVal = parseInt(emails) || 0;
  const streamingVal = parseFloat(streaming) || 0;
  const callsVal = parseFloat(calls) || 0;
  const storageVal = parseInt(storage) || 0;

  const emissions = calculateDigitalEmissions({
    emailsSent: emailsVal,
    streamingHours: streamingVal,
    videoCallsHours: callsVal,
    cloudStorageGb: storageVal
  });

  const phoneCharges = Math.round(emissions / 0.005);
  const carMilesEquivalent = (emissions / 0.404).toFixed(2);

  const handleLogDigital = async () => {
    if (emissions <= 0 || loading) return;
    setLoading(true);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await addLog({
        date: todayStr,
        transport: 0,
        energy: 0,
        food: 0,
        digital: emissions,
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
        <h1 className="text-3xl font-extrabold tracking-tight">Digital Carbon Calculator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Measure the server-side carbon impact of your emails, video streams, and cloud databases.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DigitalInputs
          emails={emails}
          setEmails={setEmails}
          streaming={streaming}
          setStreaming={setStreaming}
          calls={calls}
          setCalls={setCalls}
          storage={storage}
          setStorage={setStorage}
          emissions={emissions}
          isLogged={isLogged}
          loading={loading}
          onLogDigital={handleLogDigital}
          onResetLogged={() => setIsLogged(false)}
        />

        <DigitalOutputCard
          emissions={emissions}
          phoneCharges={phoneCharges}
          carMilesEquivalent={carMilesEquivalent}
        />
      </div>
    </div>
  );
}
