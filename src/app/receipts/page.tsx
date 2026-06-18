'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { scanReceiptWithVision, ScannedReceiptResult } from '@/services/gemini';
import { CarbonCalculationService } from '@/services/CarbonCalculationService';
import ParadigmBanner from '@/components/shared/ParadigmBanner';
import ReceiptsUploadPanel from '@/components/dashboard/ReceiptsUploadPanel';
import ReceiptsResultsPanel from '@/components/dashboard/ReceiptsResultsPanel';

/**
 * CarbonOS AI - Receipt & Invoice Carbon Scanner
 * Drag-and-drop file uploader calling Gemini Vision API
 * to extract items, price, carbon weights, and alternative eco-items.
 */
export default function ReceiptsPage() {
  const { addLog } = useCarbonStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedReceiptResult | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  const handleScan = async (fileToScan: File | null, fileName: string) => {
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

  const triggerPresetScan = (type: 'grocery' | 'utility') => {
    setSelectedFile(null);
    const mockFileName = type === 'grocery' ? 'weekly_grocery_invoice.png' : 'utility_bill_june.pdf';
    handleScan(null, mockFileName);
  };

  const handleAddToLogs = async () => {
    if (!scanResult) return;
    setIsScanning(true);
    
    try {
      const breakdown = CarbonCalculationService.calculateReceiptEmissions(scanResult.items);
      const todayStr = new Date().toISOString().split('T')[0];

      await addLog({
        date: todayStr,
        transport: breakdown.transport,
        energy: breakdown.energy,
        food: breakdown.food,
        digital: breakdown.digital,
        waste: breakdown.waste,
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
      <ParadigmBanner />
      <header className="border-b border-muted/50 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Receipt & Bill Scanner</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scan grocery receipts, electricity bills, or shopping invoices using Gemini Vision OCR to estimate footprint.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ReceiptsUploadPanel
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onPresetScan={triggerPresetScan}
        />

        <ReceiptsResultsPanel
          isScanning={isScanning}
          scanResult={scanResult}
          isLogged={isLogged}
          onAddToLogs={handleAddToLogs}
        />
      </div>
    </div>
  );
}
