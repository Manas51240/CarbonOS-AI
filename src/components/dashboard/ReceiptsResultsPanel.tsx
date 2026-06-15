'use client';

import { Scan, Sparkles, Check, Plus } from 'lucide-react';
import { ScannedReceiptResult } from '@/services/gemini';

interface ReceiptsResultsPanelProps {
  isScanning: boolean;
  scanResult: ScannedReceiptResult | null;
  isLogged: boolean;
  onAddToLogs: () => void;
}

export default function ReceiptsResultsPanel({
  isScanning,
  scanResult,
  isLogged,
  onAddToLogs
}: ReceiptsResultsPanelProps) {
  return (
    <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col min-h-[350px] justify-between relative overflow-hidden bg-background">
      {isScanning && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-spin mb-4">
            <Scan className="w-6 h-6 text-background" />
          </div>
          <h3 className="font-bold text-sm">Gemini Vision AI Engine Processing...</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Extracting characters and analyzing carbon values.</p>
        </div>
      )}

      {scanResult ? (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Result header */}
            <div className="flex justify-between items-start border-b border-muted/50 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-black tracking-tight">{scanResult.storeName}</h2>
                <p className="text-[10px] text-muted-foreground font-semibold">Processed Date: {scanResult.date}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-muted-foreground block">Carbon Footprint</span>
                <span className="text-xl font-black text-primary">{scanResult.totalCarbonKg.toFixed(1)} kg CO₂e</span>
              </div>
            </div>

            {/* Items list */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Extracted Items</h3>
              <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-1">
                {scanResult.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/35 border border-muted/30">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <span className="font-bold text-primary">{item.carbonEstimateKg.toFixed(1)} kg</span>
                    </div>
                    {item.ecoFriendlyAlternative && (
                      <div className="text-[10px] text-muted-foreground italic flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        <span>{item.ecoFriendlyAlternative}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI recommendation details */}
            <div className="mt-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground font-medium">
              <div className="font-bold text-primary mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>Gemini Sustainability Advice:</span>
              </div>
              {scanResult.sustainabilityInsight}
            </div>
          </div>

          {/* Commit action footer */}
          <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground font-semibold">
              Basket cost: <span className="font-bold text-foreground">${scanResult.totalCost.toFixed(2)}</span>
            </div>
            
            <button
              onClick={onAddToLogs}
              disabled={isLogged}
              className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                isLogged
                  ? 'bg-accent text-accent-foreground shadow-accent/20'
                  : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              {isLogged ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Daily Log!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Scanned Total to Logs</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <Scan className="w-12 h-12 text-muted-foreground/60 mb-3 animate-pulse" />
          <h3 className="font-bold text-sm text-muted-foreground">Scan Console Empty</h3>
          <p className="text-xs text-muted-foreground/85 mt-0.5 max-w-[280px]">
            Upload a JPEG receipt or click a simulation preset on the left to see itemized carbon analyses.
          </p>
        </div>
      )}
    </div>
  );
}
