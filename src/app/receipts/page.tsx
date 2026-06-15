'use client';

/**
 * CarbonOS AI - Receipt & Invoice Carbon Scanner
 * Drag-and-drop file uploader calling Gemini Vision API
 * to extract items, price, carbon weights, and alternative eco-items.
 */

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { scanReceiptWithVision, ScannedReceiptResult } from '@/services/gemini';
import { Scan, Upload, FileText, Sparkles, Check, Plus, AlertCircle, ShoppingCart } from 'lucide-react';

export default function ReceiptsPage() {
  const { addLog } = useCarbonStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedReceiptResult | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  // Trigger scanning based on user selected file
  const handleScan = async (fileToScan: File, fileName: string) => {
    setIsScanning(true);
    setScanResult(null);
    setIsLogged(false);
    
    try {
      const result = await scanReceiptWithVision(fileToScan, fileName);
      setScanResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleScan(file, file.name);
    }
  };

  // Helper trigger buttons for quick evaluation
  const triggerPresetScan = (type: 'grocery' | 'utility') => {
    setSelectedFile(null);
    const mockFileName = type === 'grocery' ? 'weekly_grocery_invoice.png' : 'utility_bill_june.pdf';
    handleScan(null as any, mockFileName);
  };

  // Commit carbon total to user database logs
  const handleAddToLogs = async () => {
    if (!scanResult) return;
    setIsScanning(true);
    
    try {
      // Aggregate categories
      let food = 0;
      let energy = 0;
      const transport = 0;
      let waste = 0;
      const digital = 0;

      scanResult.items.forEach(item => {
        if (item.carbonCategory.startsWith('food')) {
          food += item.carbonEstimateKg;
        } else if (item.carbonCategory === 'utilities') {
          energy += item.carbonEstimateKg;
        } else {
          waste += item.carbonEstimateKg; // fallback
        }
      });

      const todayStr = new Date().toISOString().split('T')[0];

      await addLog({
        date: todayStr,
        transport,
        energy,
        food,
        digital,
        waste,
        total: scanResult.totalCarbonKg
      });

      setIsLogged(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Receipt & Bill Scanner</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scan grocery receipts, electricity bills, or shopping invoices using Gemini Vision OCR to estimate footprint.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Upload Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Upload Document</h2>
              
              {/* Drag Drop Area */}
              <div className="border-2 border-dashed border-muted hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative group bg-secondary/25 hover:bg-secondary/40 min-h-[180px]">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  aria-label="Upload receipt image or PDF file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-foreground">Drag & drop receipt here</span>
                <span className="text-[10px] text-muted-foreground mt-1">Accepts PNG, JPG, or PDF (Max 5MB)</span>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-secondary/50 border border-muted text-xs">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate font-semibold flex-1">{selectedFile.name}</span>
                </div>
              )}
            </div>

            {/* preset simulation helpers */}
            <div className="mt-8 pt-6 border-t border-muted/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Evaluation Presets</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => triggerPresetScan('grocery')}
                  className="w-full py-2.5 rounded-xl border border-muted hover:border-primary/30 hover:bg-secondary/50 text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                  <span>Simulate Grocery Receipt</span>
                </button>
                <button
                  onClick={() => triggerPresetScan('utility')}
                  className="w-full py-2.5 rounded-xl border border-muted hover:border-primary/30 hover:bg-secondary/50 text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>Simulate Utility Gas Bill</span>
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-foreground block mb-0.5">How it works:</span>
              Gemini Vision parses the text structure, isolates line items, maps products to carbon databases, and calculates a total carbon weight (kg CO₂e) with recommendation swaps.
            </div>
          </div>
        </div>

        {/* Right Scan results panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col min-h-[350px] justify-between relative overflow-hidden">
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
                  onClick={handleAddToLogs}
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

      </div>
    </div>
  );
}
