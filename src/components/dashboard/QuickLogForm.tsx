'use client';

import { useState } from 'react';
import { Sparkles, Car, Flame, Utensils, Plus } from 'lucide-react';

interface QuickLogFormProps {
  onLogSubmit: (carMiles: number, electricityKwh: number, diet: 'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy') => Promise<void>;
}

/**
 * Presentational component for logging daily carbon activities.
 */
export default function QuickLogForm({ onLogSubmit }: QuickLogFormProps) {
  const [carMiles, setCarMiles] = useState('');
  const [electricity, setElectricity] = useState('');
  const [diet, setDiet] = useState<'vegan' | 'vegetarian' | 'flexitarian' | 'meat-heavy'>('flexitarian');
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      const miles = parseFloat(carMiles) || 0;
      const kwh = parseFloat(electricity) || 0;
      await onLogSubmit(miles, kwh, diet);
      setCarMiles('');
      setElectricity('');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-muted/80 flex flex-col justify-between bg-background shadow-sm">
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Quick Log Activity</h2>
        <p className="text-xs text-muted-foreground mb-6">Log today's key actions to update your carbon twin</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quick-commute-input" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 animate-pulse-glow">
              <Car className="w-3.5 h-3.5 text-primary" />
              <span>Commute (Car Miles)</span>
            </label>
            <input
              id="quick-commute-input"
              type="number"
              placeholder="e.g. 15"
              value={carMiles}
              onChange={(e) => setCarMiles(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quick-power-input" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Home Power (Grid kWh)</span>
            </label>
            <input
              id="quick-power-input"
              type="number"
              placeholder="e.g. 12"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quick-diet-select" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-red-500" />
              <span>Primary Diet Choice</span>
            </label>
            <select
              id="quick-diet-select"
              value={diet}
              onChange={(e) => setDiet(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
            >
              <option value="vegan">Vegan (Low Impact)</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="flexitarian">Low-meat Flexitarian</option>
              <option value="meat-heavy">Meat Heavy (High Impact)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLogging}
            className="w-full py-3 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity Today</span>
          </button>
        </form>
      </div>

      <div className="text-[10px] text-center text-muted-foreground mt-6 border-t border-muted/50 pt-4 font-semibold flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Updates your forecasting and avatar twin instantly!</span>
      </div>
    </div>
  );
}
