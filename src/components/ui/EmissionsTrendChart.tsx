'use client';

import { useState } from 'react';

interface LogData { date: string; total: number; }
interface ChartPoint { x: number; y: number; val: number; date: string; isForecast: boolean; }

// --- Sub-component: Grid markings ---
function ChartGrid({ maxVal, minVal, width, height, paddingX, paddingY }: {
  maxVal: number; minVal: number; width: number; height: number; paddingX: number; paddingY: number;
}) {
  return (
    <>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = paddingY + ratio * (height - 2 * paddingY);
        const val = maxVal - ratio * (maxVal - minVal);
        return (
          <g key={ratio} className="opacity-25">
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
            <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="10" className="fill-muted-foreground font-semibold">{val.toFixed(0)}</text>
          </g>
        );
      })}
    </>
  );
}

// --- Sub-component: Hover tooltip ---
function ChartTooltip({ point, width, height }: { point: ChartPoint; width: number; height: number }) {
  return (
    <div
      className="absolute glass-card p-2 rounded-lg pointer-events-none border border-muted/80 shadow-md text-xs font-semibold"
      style={{ left: `${(point.x / width) * 100}%`, top: `${(point.y / height) * 100 - 30}%`, transform: 'translate(-50%, -100%)' }}
    >
      <div className="text-[9px] text-muted-foreground uppercase">{point.isForecast ? 'AI Proj Forecast' : 'Emissions Log'}</div>
      <div>{point.val.toFixed(1)} kg CO₂e</div>
      <div className="text-[9px] font-normal text-muted-foreground mt-0.5">{point.date}</div>
    </div>
  );
}

export function EmissionsTrendChart({ logs }: { logs: LogData[] }) {
  const [activePointIdx, setActivePointIdx] = useState<number | null>(null);
  const hasLogs = logs.length > 0;
  const lastLogTotal = hasLogs ? logs[logs.length - 1].total : 18;
  const forecastPoints = [
    { date: 'Proj Day 1', total: lastLogTotal * 0.90, isForecast: true },
    { date: 'Proj Day 2', total: lastLogTotal * 0.82, isForecast: true },
    { date: 'Proj Day 3', total: lastLogTotal * 0.75, isForecast: true },
  ];
  const allPoints = [...logs.map(l => ({ ...l, isForecast: false })), ...forecastPoints];

  const width = 500, height = 220, paddingX = 40, paddingY = 30;
  const maxVal = Math.max(...allPoints.map(p => p.total), 25) * 1.15;
  const minVal = 0;

  const points: ChartPoint[] = allPoints.map((p, idx) => ({
    x: paddingX + (idx / (allPoints.length - 1)) * (width - 2 * paddingX),
    y: height - paddingY - ((p.total - minVal) / (maxVal - minVal)) * (height - 2 * paddingY),
    val: p.total, date: p.date, isForecast: p.isForecast,
  }));

  const historyPoints = points.filter(p => !p.isForecast);
  const forecastLinePoints = points.filter((p, i) => p.isForecast || i === historyPoints.length - 1);
  const getPath = (coords: ChartPoint[]) => coords.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, '');
  const getArea = (coords: ChartPoint[]) => `${getPath(coords)} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '500/220' }}>
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0F9D58" stopOpacity="0.25" /><stop offset="100%" stopColor="#0F9D58" stopOpacity="0.00" /></linearGradient>
            <linearGradient id="forecast-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#10B981" stopOpacity="0.15" /><stop offset="100%" stopColor="#10B981" stopOpacity="0.00" /></linearGradient>
          </defs>

          <ChartGrid maxVal={maxVal} minVal={minVal} width={width} height={height} paddingX={paddingX} paddingY={paddingY} />

          {historyPoints.length > 0 && (
            <>
              <path d={getArea(historyPoints)} fill="url(#area-gradient)" />
              <path d={getPath(historyPoints)} fill="none" stroke="#0F9D58" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          {forecastLinePoints.length > 0 && (
            <path d={getPath(forecastLinePoints)} fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />
          )}

          {points.map((p, idx) => {
            const isActive = activePointIdx === idx;
            const label = `${p.isForecast ? 'AI Project Forecast' : 'Emissions Log'} for ${p.date}: ${p.val.toFixed(1)} kg CO2e`;
            return (
              <g key={idx}>
                {isActive && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="#0F9D58" strokeWidth="1.5" strokeDasharray="2 2" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />}
                <circle cx={p.x} cy={p.y} r="15" fill="transparent" className="cursor-pointer focus-visible:outline-none" role="button" tabIndex={0} aria-label={label}
                  onMouseEnter={() => setActivePointIdx(idx)} onMouseLeave={() => setActivePointIdx(null)}
                  onFocus={() => setActivePointIdx(idx)} onBlur={() => setActivePointIdx(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePointIdx(isActive ? null : idx); } }}
                />
                <circle cx={p.x} cy={p.y} r={isActive ? '7' : '4'} fill={p.isForecast ? '#10B981' : '#0F9D58'} stroke="var(--color-background)" strokeWidth="2" className="transition-all duration-150 pointer-events-none" />
              </g>
            );
          })}

          {points.filter((_, i) => i % 2 === 0).map((p, idx) => (
            <text key={idx} x={p.x} y={height - paddingY + 16} textAnchor="middle" fontSize="9" className="fill-muted-foreground font-semibold">{p.date.split('-').slice(-2).join('/')}</text>
          ))}
        </svg>

        {activePointIdx !== null && <ChartTooltip point={points[activePointIdx]} width={width} height={height} />}
      </div>

      <div className="flex gap-4 mt-2 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-semibold"><span className="w-3 h-1 bg-[#0F9D58] rounded-full inline-block" /><span>Historical Logs</span></div>
        <div className="flex items-center gap-1.5 font-semibold"><span className="w-3 h-1 border-t border-dashed border-[#10B981] rounded-full inline-block" /><span>AI Forecast Trend</span></div>
      </div>
    </div>
  );
}
