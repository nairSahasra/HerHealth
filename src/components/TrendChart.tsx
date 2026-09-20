'use client';

import React, { useState } from 'react';
import { Moon, Zap, Smile, Activity, AlertCircle } from 'lucide-react';
import { DailyCheckInData } from '@/lib/types';

interface TrendChartProps {
  logs: DailyCheckInData[];
}

export default function TrendChart({ logs }: TrendChartProps) {
  const [metric, setMetric] = useState<'sleep_energy' | 'mood_stress'>('sleep_energy');
  const [timeRange, setTimeRange] = useState<7 | 14>(14);

  const displayLogs = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-timeRange);

  if (displayLogs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center py-12 text-stone-400">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No check-in history logged yet. Complete a daily check-in to see your trends.</p>
      </div>
    );
  }

  // Calculate chart bounds
  const chartHeight = 160;
  const chartWidth = 600;
  const padding = 30;

  const getX = (index: number) => {
    if (displayLogs.length <= 1) return padding;
    return padding + (index / (displayLogs.length - 1)) * (chartWidth - padding * 2);
  };

  // Metric points
  const pointsA = displayLogs.map((log, i) => {
    const val = metric === 'sleep_energy' ? Math.min(10, Math.max(0, log.sleepHours)) : log.mood;
    const maxVal = metric === 'sleep_energy' ? 10 : 5;
    const y = chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);
    return { x: getX(i), y, val, date: log.date };
  });

  const pointsB = displayLogs.map((log, i) => {
    const val = metric === 'sleep_energy' ? log.energy : log.stressLevel;
    const maxVal = 5;
    const y = chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);
    return { x: getX(i), y, val, date: log.date };
  });

  const makePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-600" />
            Longitudinal Trend Correlation
          </h3>
          <p className="text-xs text-stone-500">
            Compare biometric variables over time to identify physiological rhythms
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMetric('sleep_energy')}
              className={`px-3 py-1 rounded-md transition-colors ${
                metric === 'sleep_energy' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
              }`}
            >
              Sleep vs Energy
            </button>
            <button
              onClick={() => setMetric('mood_stress')}
              className={`px-3 py-1 rounded-md transition-colors ${
                metric === 'mood_stress' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
              }`}
            >
              Mood vs Stress
            </button>
          </div>

          {/* Time range */}
          <div className="flex bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-2 py-1 rounded-md transition-colors ${
                timeRange === 7 ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange(14)}
              className={`px-2 py-1 rounded-md transition-colors ${
                timeRange === 14 ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500'
              }`}
            >
              14d
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = chartHeight - padding - pct * (chartHeight - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#F1EFE9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Line A */}
          <path
            d={makePath(pointsA)}
            fill="none"
            stroke={metric === 'sleep_energy' ? '#6366F1' : '#E11D48'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Line B */}
          <path
            d={makePath(pointsB)}
            fill="none"
            stroke={metric === 'sleep_energy' ? '#F59E0B' : '#8B5CF6'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Points A */}
          {pointsA.map((pt, idx) => (
            <circle
              key={`a-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill={metric === 'sleep_energy' ? '#6366F1' : '#E11D48'}
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${metric === 'sleep_energy' ? 'Sleep' : 'Mood'}: ${pt.val} on ${pt.date}`}</title>
            </circle>
          ))}

          {/* Points B */}
          {pointsB.map((pt, idx) => (
            <circle
              key={`b-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill={metric === 'sleep_energy' ? '#F59E0B' : '#8B5CF6'}
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${metric === 'sleep_energy' ? 'Energy' : 'Stress'}: ${pt.val} on ${pt.date}`}</title>
            </circle>
          ))}

          {/* X Axis dates */}
          {displayLogs.map((log, idx) => {
            if (idx % 2 !== 0 && displayLogs.length > 7) return null;
            return (
              <text
                key={`label-${idx}`}
                x={getX(idx)}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize="9"
                fill="#A8A29E"
                fontFamily="sans-serif"
              >
                {log.date.slice(5)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              metric === 'sleep_energy' ? 'bg-indigo-500' : 'bg-rose-600'
            }`}
          />
          <span className="text-stone-700 font-medium">
            {metric === 'sleep_energy' ? 'Sleep Duration (hrs)' : 'Mood Score (1-5)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              metric === 'sleep_energy' ? 'bg-amber-500' : 'bg-purple-500'
            }`}
          />
          <span className="text-stone-700 font-medium">
            {metric === 'sleep_energy' ? 'Energy Level (1-5)' : 'Stress Level (1-5)'}
          </span>
        </div>
      </div>
    </div>
  );
}
