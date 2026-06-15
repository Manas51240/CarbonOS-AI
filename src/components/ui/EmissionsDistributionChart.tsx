'use client';

import { useState } from 'react';

interface DistributionData {
  transport: number;
  energy: number;
  food: number;
  digital: number;
  waste: number;
}

export function EmissionsDistributionChart({ data }: { data: DistributionData }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const categories = [
    { name: 'Transport', value: data.transport, color: '#0F9D58', darkColor: '#10B981' },
    { name: 'Home Energy', value: data.energy, color: '#4285F4', darkColor: '#60A5FA' },
    { name: 'Diet & Food', value: data.food, color: '#DB4437', darkColor: '#F87171' },
    { name: 'Digital Impact', value: data.digital, color: '#9C27B0', darkColor: '#C084FC' },
    { name: 'Waste Output', value: data.waste, color: '#F4B400', darkColor: '#FBBF24' }
  ];

  const total = categories.reduce((sum, c) => sum + c.value, 0) || 1;
  const filtered = categories.filter(c => c.value > 0);

  const size = 220, radius = 70, strokeWidth = 26, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {filtered.map((cat, idx) => {
            const percentage = cat.value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle * circumference;
            accumulatedAngle += percentage;

            return (
              <circle
                key={cat.name}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out cursor-pointer stroke-current"
                style={{ stroke: cat.color }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{categories[hoveredIdx].name}</span>
              <span className="text-xl font-bold">{((categories[hoveredIdx].value / total) * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-muted-foreground">{categories[hoveredIdx].value.toFixed(1)} kg</span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Daily Total</span>
              <span className="text-2xl font-black">{total.toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground">kg CO₂e</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 w-full md:w-auto min-w-[150px]">
        {categories.map((cat, idx) => {
          const val = cat.value;
          const percent = total > 0 ? (val / total) * 100 : 0;
          return (
            <div
              key={cat.name}
              className={`flex items-center justify-between gap-4 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                hoveredIdx === idx ? 'bg-secondary/70 translate-x-1' : 'hover:bg-secondary/35'
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-semibold text-muted-foreground">{cat.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold block">{percent.toFixed(0)}%</span>
                <span className="text-[10px] text-muted-foreground">{val.toFixed(1)} kg</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
