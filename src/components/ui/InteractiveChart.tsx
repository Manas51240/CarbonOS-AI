'use client';

/**
 * CarbonOS AI - Interactive Data Visualizations
 * High-performance, zero-bloat custom SVG chart widgets.
 * Renders beautiful, fully responsive donut breakdowns and multi-line forecasts.
 */

import { useState } from 'react';

// ==========================================
// 1. EMISSIONS DONUT DISTRIBUTION CHART
// ==========================================

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
    { name: 'Transport', value: data.transport, color: '#0F9D58', darkColor: '#10B981' }, // Google Green / Emerald
    { name: 'Home Energy', value: data.energy, color: '#4285F4', darkColor: '#60A5FA' }, // Blue
    { name: 'Diet & Food', value: data.food, color: '#DB4437', darkColor: '#F87171' },  // Red
    { name: 'Digital Impact', value: data.digital, color: '#9C27B0', darkColor: '#C084FC' }, // Purple
    { name: 'Waste Output', value: data.waste, color: '#F4B400', darkColor: '#FBBF24' } // Yellow
  ];

  const total = categories.reduce((sum, c) => sum + c.value, 0) || 1;
  const filtered = categories.filter(c => c.value > 0);

  // SVG parameters
  const size = 220;
  const radius = 70;
  const strokeWidth = 26;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 justify-center w-full">
      {/* Donut SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {filtered.map((cat, idx) => {
            const percentage = cat.value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedAngle * circumference;
            accumulatedAngle += percentage;

            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={cat.name}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out cursor-pointer stroke-current"
                style={{
                  stroke: cat.color,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {hoveredIdx !== null ? (
            <>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                {categories[hoveredIdx].name}
              </span>
              <span className="text-xl font-bold">
                {((categories[hoveredIdx].value / total) * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-muted-foreground">
                {categories[hoveredIdx].value.toFixed(1)} kg
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                Daily Total
              </span>
              <span className="text-2xl font-black">{total.toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground">kg CO₂e</span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
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
                <span
                  className="w-3.5 h-3.5 rounded-md"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                  {cat.name}
                </span>
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

// ==========================================
// 2. EMISSIONS HISTORICAL & FORECAST LINE CHART
// ==========================================

interface LogData {
  date: string;
  total: number;
}

export function EmissionsTrendChart({ logs }: { logs: LogData[] }) {
  const [activePointIdx, setActivePointIdx] = useState<number | null>(null);

  // Extend data with simulated 3-day projection
  const hasLogs = logs.length > 0;
  
  const displayLogs = [...logs];
  // If we have logs, append a dashed forecasted projection
  const lastLogTotal = hasLogs ? logs[logs.length - 1].total : 18;
  const forecastPoints = [
    { date: 'Proj Day 1', total: lastLogTotal * 0.90, isForecast: true },
    { date: 'Proj Day 2', total: lastLogTotal * 0.82, isForecast: true },
    { date: 'Proj Day 3', total: lastLogTotal * 0.75, isForecast: true }
  ];

  const allPoints = [
    ...displayLogs.map(l => ({ ...l, isForecast: false })),
    ...forecastPoints
  ];

  // Chart dimensions
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...allPoints.map(p => p.total), 25) * 1.15;
  const minVal = 0;

  // Calculate coordinates
  const points = allPoints.map((p, idx) => {
    const x = paddingX + (idx / (allPoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((p.total - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, val: p.total, date: p.date, isForecast: p.isForecast };
  });

  // Construct SVG Path
  const historyPoints = points.filter(p => !p.isForecast);
  const forecastLinePoints = points.filter((p, i) => p.isForecast || i === historyPoints.length - 1);

  const getLinePath = (coords: typeof points) => {
    if (coords.length === 0) return '';
    return coords.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const getAreaPath = (coords: typeof points) => {
    if (coords.length === 0) return '';
    const linePath = getLinePath(coords);
    return `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  };

  const historyLinePath = getLinePath(historyPoints);
  const historyAreaPath = getAreaPath(historyPoints);
  const forecastLinePath = getLinePath(forecastLinePoints);

  return (
    <div className="w-full flex flex-col items-center">
      {/* SVG Container */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '500/220' }}>
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F9D58" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0F9D58" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="forecast-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + ratio * (height - 2 * paddingY);
            const val = maxVal - ratio * (maxVal - minVal);
            return (
              <g key={ratio} className="opacity-25">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-muted-foreground font-semibold"
                >
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Historical Area & Line */}
          {historyPoints.length > 0 && (
            <>
              <path d={historyAreaPath} fill="url(#area-gradient)" />
              <path d={historyLinePath} fill="none" stroke="#0F9D58" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {/* Forecasted Line */}
          {forecastLinePoints.length > 0 && (
            <path
              d={forecastLinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Nodes */}
          {points.map((p, idx) => {
            const isHovered = activePointIdx === idx;
            return (
              <g key={idx}>
                {/* Invisible hover area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="15"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePointIdx(idx)}
                  onMouseLeave={() => setActivePointIdx(null)}
                />
                {/* Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? '7' : '4'}
                  fill={p.isForecast ? '#10B981' : '#0F9D58'}
                  stroke="var(--color-background)"
                  strokeWidth="2"
                  className="transition-all duration-150 pointer-events-none"
                />
              </g>
            );
          })}

          {/* Date Labels */}
          {points.filter((_, i) => i % 2 === 0).map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - paddingY + 16}
              textAnchor="middle"
              fontSize="9"
              className="fill-muted-foreground font-semibold"
            >
              {p.date.split('-').slice(-2).join('/')}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePointIdx !== null && (
          <div
            className="absolute glass-card p-2 rounded-lg pointer-events-none border border-muted/80 shadow-md text-xs font-semibold"
            style={{
              left: `${(points[activePointIdx].x / width) * 100}%`,
              top: `${(points[activePointIdx].y / height) * 100 - 30}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="text-[9px] text-muted-foreground uppercase">
              {points[activePointIdx].isForecast ? 'AI Proj Forecast' : 'Emissions Log'}
            </div>
            <div>{points[activePointIdx].val.toFixed(1)} kg CO₂e</div>
            <div className="text-[9px] font-normal text-muted-foreground mt-0.5">
              {points[activePointIdx].date}
            </div>
          </div>
        )}
      </div>
      
      {/* Legend Indicator */}
      <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-1 bg-[#0F9D58] rounded-full inline-block" />
          <span>Historical Logs</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-1 border-t border-dashed border-[#10B981] rounded-full inline-block" />
          <span>AI Forecast Trend</span>
        </div>
      </div>
    </div>
  );
}
