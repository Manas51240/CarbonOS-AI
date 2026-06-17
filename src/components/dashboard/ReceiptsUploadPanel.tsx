'use client';

import { Upload, FileText, ShoppingCart, AlertCircle } from 'lucide-react';

interface ReceiptsUploadPanelProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPresetScan: (type: 'grocery' | 'utility') => void;
}

export default function ReceiptsUploadPanel({
  selectedFile,
  onFileChange,
  onPresetScan
}: ReceiptsUploadPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col justify-between bg-background">
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Upload Document</h2>
          
          {/* Drag Drop Area */}
          <div className="border-2 border-dashed border-muted hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative group bg-secondary/25 hover:bg-secondary/40 min-h-[180px]">
            <input
              id="receipt-file-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChange}
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
              onClick={() => onPresetScan('grocery')}
              className="w-full py-2.5 rounded-xl border border-muted hover:border-primary/30 hover:bg-secondary/50 text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-primary" />
              <span>Simulate Grocery Receipt</span>
            </button>
            <button
              onClick={() => onPresetScan('utility')}
              className="w-full py-2.5 rounded-xl border border-muted hover:border-primary/30 hover:bg-secondary/50 text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Simulate Utility Gas Bill</span>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-muted/80 text-xs text-muted-foreground flex gap-3 bg-background">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-foreground block mb-0.5">How it works:</span>
          Gemini Vision parses the text structure, isolates line items, maps products to carbon databases, and calculates a total carbon weight (kg CO₂e) with recommendation swaps.
        </div>
      </div>
    </div>
  );
}
