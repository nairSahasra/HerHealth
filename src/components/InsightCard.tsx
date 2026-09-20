'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Activity, Moon, Brain, ShieldCheck } from 'lucide-react';
import { HealthInsight } from '@/lib/types';

interface InsightCardProps {
  insight: HealthInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sleep & Energy':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'Stress & Symptoms':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'Activity & Recovery':
        return <Activity className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-rose-500" />;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
            High Confidence
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
            Moderate Confidence
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
            Emerging Rhythm
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/90 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
            {getCategoryIcon(insight.category)}
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              {insight.category}
            </span>
            <div className="flex items-center gap-2">
              {getConfidenceBadge(insight.confidence)}
              <span className="text-[10px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                r = {insight.correlationScore > 0 ? `+${insight.correlationScore}` : insight.correlationScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-stone-900 text-sm mb-1.5 leading-snug">
        {insight.title}
      </h3>
      <p className="text-xs text-stone-600 mb-3 leading-relaxed">
        {insight.description}
      </p>

      {/* Actionable recommendation block */}
      <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100/80 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-rose-950 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Actionable Guidance (Non-Prescriptive)</span>
        </div>
        <p className="text-stone-700 text-[11px] leading-relaxed">
          {insight.recommendation}
        </p>
      </div>
    </div>
  );
}
