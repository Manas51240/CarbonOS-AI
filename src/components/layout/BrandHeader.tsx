'use client';

import { Leaf } from 'lucide-react';

export default function BrandHeader() {
  return (
    <div className="flex items-center gap-3 mb-8 px-2">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 animate-float">
        <Leaf aria-hidden="true" className="w-6 h-6 text-background" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-emerald-600 bg-clip-text text-transparent">
          CarbonOS <span className="font-light">AI</span>
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          Sustainable Intelligence
        </p>
      </div>
    </div>
  );
}
