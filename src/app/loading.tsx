import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-foreground bg-background">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Leaf className="w-8 h-8 text-background animate-spin-slow" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold tracking-tight text-primary">CarbonOS AI</h2>
          <p className="text-xs text-muted-foreground">Syncing environmental metrics...</p>
        </div>
      </div>
    </div>
  );
}
