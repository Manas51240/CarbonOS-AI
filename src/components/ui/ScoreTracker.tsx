'use client';

/**
 * CarbonOS AI - Sustainability Score Visualizer
 * Animated radial dial dashboard displaying the user's score (0-100)
 * with semantic gradient highlights and rating comments.
 */

import { useEffect, useState } from 'react';

interface ScoreTrackerProps {
  score: number;
  size?: number;
}

export default function ScoreTracker({ score, size = 180 }: ScoreTrackerProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animates the score counting up on mount or score change
  useEffect(() => {
    let start = 0;
    const end = Math.max(0, Math.min(100, score));
    if (start === end) {
      setAnimatedScore(end);
      return;
    }

    const duration = 1000; // 1s animation
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG parameters
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Semantic rating and colors
  let rating = 'Poor';
  let ratingColor = 'text-destructive';
  let gradientId = 'score-low';

  if (score >= 85) {
    rating = 'Excellent';
    ratingColor = 'text-accent';
    gradientId = 'score-high';
  } else if (score >= 70) {
    rating = 'Good';
    ratingColor = 'text-primary';
    gradientId = 'score-mid';
  } else if (score >= 50) {
    rating = 'Average';
    ratingColor = 'text-amber-500';
    gradientId = 'score-avg';
  }

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Dial */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="score-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" /> {/* Emerald */}
              <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
            </linearGradient>
            <linearGradient id="score-mid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F9D58" /> {/* Google green */}
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
            <linearGradient id="score-avg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" /> {/* Amber */}
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="score-low" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" /> {/* Red */}
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Underlay Track */}
          <circle
            className="text-muted/30 stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          
          {/* Progress Circle */}
          <circle
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Text Center Overlays */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight">
            {animatedScore}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
            Carbon Rating
          </span>
        </div>
      </div>
      
      {/* Label Indicator */}
      <div className="mt-3 text-center">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-secondary/70 border border-muted/50 ${ratingColor}`}>
          {rating}
        </span>
      </div>
    </div>
  );
}
