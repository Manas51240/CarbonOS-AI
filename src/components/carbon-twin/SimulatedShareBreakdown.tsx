'use client';

interface SimulatedShareBreakdownProps {
  simShare: { transport: number; energy: number; food: number; digital: number };
}

export default function SimulatedShareBreakdown({ simShare }: SimulatedShareBreakdownProps) {
  return (
    <div className="mt-8 pt-6 border-t border-muted/50">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Simulated Share</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🚗 Transport</span>
          <span className="text-sm font-bold text-foreground">{simShare.transport.toFixed(1)} kg</span>
        </div>
        <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">⚡ Energy</span>
          <span className="text-sm font-bold text-foreground">{simShare.energy.toFixed(1)} kg</span>
        </div>
        <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">🍔 Food & Diet</span>
          <span className="text-sm font-bold text-foreground">{simShare.food.toFixed(1)} kg</span>
        </div>
        <div className="bg-secondary/30 border border-muted/50 rounded-2xl p-3">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">💻 Digital</span>
          <span className="text-sm font-bold text-foreground">{simShare.digital.toFixed(1)} kg</span>
        </div>
      </div>
    </div>
  );
}
