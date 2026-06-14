'use client';

/**
 * CarbonOS AI - Digital Carbon Calculator
 * Estimates emissions from cloud servers, streaming services, emails,
 * and virtual conferences, providing comparisons and saving tips.
 */

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { calculateDigitalEmissions, EMISSION_FACTORS } from '@/utils/carbonCalculations';
import { Smartphone, Mail, Tv, Video, Database, Plus, Check, Info, TrendingDown } from 'lucide-react';

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

  // Comparisons (Smartphone charges: 1 charge is approx 0.005 kg CO2)
  const phoneCharges = Math.round(emissions / 0.005);
  // Average car miles equivalence (1 mile gasoline = 0.404 kg CO2)
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
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Digital Carbon Calculator</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Measure the server-side carbon impact of your emails, video streams, and cloud databases.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Input Sliders Panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Daily Usage Estimates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emails sent/received */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Emails Exchanged</span>
                  </label>
                  <span className="text-xs font-bold text-primary">{emails} emails</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={emails}
                  onChange={(e) => { setEmails(e.target.value); setIsLogged(false); }}
                  className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
                />
              </div>

              {/* Streaming Video hours */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-purple-500" />
                    <span>Video Streaming (HD)</span>
                  </label>
                  <span className="text-xs font-bold text-primary">{streaming} hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={streaming}
                  onChange={(e) => { setStreaming(e.target.value); setIsLogged(false); }}
                  className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
                />
              </div>

              {/* Video Calls */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-500" />
                    <span>Video Conferences</span>
                  </label>
                  <span className="text-xs font-bold text-primary">{calls} hours</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={calls}
                  onChange={(e) => { setCalls(e.target.value); setIsLogged(false); }}
                  className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
                />
              </div>

              {/* Cloud storage */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-orange-500" />
                    <span>Cloud Backups size</span>
                  </label>
                  <span className="text-xs font-bold text-primary">{storage} GB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={storage}
                  onChange={(e) => { setStorage(e.target.value); setIsLogged(false); }}
                  className="w-full h-2 rounded-lg bg-secondary/80 outline-none cursor-pointer mt-3"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Network transmission calculations applied.</span>
            </span>

            <button
              onClick={handleLogDigital}
              disabled={emissions <= 0 || loading || isLogged}
              className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                isLogged
                  ? 'bg-accent text-accent-foreground shadow-accent/20'
                  : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              {isLogged ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Log Saved!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Log Digital Output</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full filter blur-lg -mr-6 -mt-6" />
            
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider self-start mb-6">Digital Footprint</h2>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-4xl mb-4">
                🔌
              </div>
              <span className="text-3xl font-black text-foreground">{emissions.toFixed(3)}</span>
              <span className="text-xs font-semibold text-muted-foreground mt-0.5">kg CO₂e / day</span>
            </div>

            {/* Equivalences */}
            {emissions > 0 && (
              <div className="w-full mt-6 bg-secondary/40 border border-muted/50 rounded-2xl p-4 text-left flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Smartphone Charges:</span>
                  <span className="font-bold">{phoneCharges} charges</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Car Miles Equiv:</span>
                  <span className="font-bold text-orange-500">{carMilesEquivalent} miles</span>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block mb-0.5">Optimization Hint:</span>
              Streaming in Standard Definition (SD) consumes roughly 75% less network transmission energy than High Definition (HD), significantly reducing active server loads.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
