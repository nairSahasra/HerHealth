'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PlusCircle,
  Moon,
  Zap,
  Smile,
  Activity,
  Calendar,
  FileText,
  Shield,
  MessageSquareHeart,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { DEMO_PROFILES } from '@/components/ProfileSwitcher';
import InsightCard from '@/components/InsightCard';
import TrendChart from '@/components/TrendChart';
import CheckInModal from '@/components/CheckInModal';
import { DailyCheckInData, HealthInsight, UserProfile } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [logs, setLogs] = useState<DailyCheckInData[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Find matching profile or default
      const profile = DEMO_PROFILES.find((p) => p.id === userId) || DEMO_PROFILES[0];
      setUser(profile);

      // Fetch logs
      const logsRes = await fetch(`/api/check-in?userId=${userId}`);
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }

      // Fetch insights
      const insightsRes = await fetch(`/api/insights?userId=${userId}`);
      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    loadUserData(savedId);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      loadUserData(newId);
    };

    const handleCheckInAdded = () => {
      const currentId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      loadUserData(currentId);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    window.addEventListener('herhealth_checkin_added', handleCheckInAdded);

    return () => {
      window.removeEventListener('herhealth_profile_changed', handleProfileChange);
      window.removeEventListener('herhealth_checkin_added', handleCheckInAdded);
    };
  }, []);

  const latestLog = logs[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Universal Cohort Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-100/90 via-rose-50 to-stone-100 p-6 sm:p-8 border border-rose-200/70 relative overflow-hidden shadow-xs">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-rose-200/80 text-rose-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Universal Well-Being Scope • Active Cohort: {user.name} (Age {user.age})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Welcome back, {user.name}.
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
            HerHealth is designed for your complete well-being at every age. Whether tracking sleep, energy, stress, or body signals, our AI Insight Engine detects your unique physiological patterns without forcing a single reproductive default.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-300 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Today&apos;s Check-In (10s)</span>
            </button>

            <Link
              href="/companion"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 text-xs font-medium border border-stone-200 shadow-xs transition-colors"
            >
              <MessageSquareHeart className="w-4 h-4 text-brand-600" />
              <span>Talk to AI Companion</span>
            </Link>
          </div>
        </div>

        {/* Decorative badge */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-rose-100 shadow-sm text-right">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Privacy ID
          </p>
          <p className="text-sm font-mono font-bold text-stone-800 mb-2">
            {user.pseudonymousId}
          </p>
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            user.cycleTrackingEnabled
              ? 'bg-rose-100 text-rose-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {user.cycleTrackingEnabled ? 'Cycle Module: Active' : 'Universal Mode (Cycle Off)'}
          </span>
        </div>
      </div>

      {/* Latest Vitals Snapshot Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-brand-600" />
            Most Recent Biometric Signals
            <span className="text-xs font-normal text-stone-500">
              ({latestLog ? latestLog.date : 'No logs yet'})
            </span>
          </h2>
          <Link
            href="/timeline"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Full Timeline <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Sleep */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Sleep</span>
              <Moon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-extrabold text-stone-900">
              {latestLog ? `${latestLog.sleepHours} hrs` : '--'}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Quality: {latestLog ? `${latestLog.sleepQuality}/5` : '--'}
            </p>
          </div>

          {/* Energy */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Energy</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-stone-900">
              {latestLog ? `${latestLog.energy}/5` : '--'}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {latestLog ? (latestLog.energy >= 4 ? 'High stamina' : 'Moderate / Low') : 'Not logged'}
            </p>
          </div>

          {/* Mood */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Mood</span>
              <Smile className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-extrabold text-stone-900">
              {latestLog ? `${latestLog.mood}/5` : '--'}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {latestLog ? (latestLog.mood >= 4 ? 'Positive / Uplifted' : 'Balanced / Low') : 'Not logged'}
            </p>
          </div>

          {/* Stress */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Stress</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl font-extrabold text-stone-900">
              {latestLog ? `${latestLog.stressLevel}/5` : '--'}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {latestLog ? (latestLog.stressLevel <= 2 ? 'Low stress' : 'Elevated stress') : 'Not logged'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight Engine Section (Hero Feature) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              AI Insight Engine — Detected Patterns
            </h2>
            <p className="text-xs text-stone-500">
              Correlations derived from {user.name}&apos;s logs without assuming a menstrual cycle
            </p>
          </div>

          <span className="hidden sm:inline-flex text-xs px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-100">
            {insights.length} Patterns Active
          </span>
        </div>

        {insights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
            <p className="text-xs text-stone-500">
              Computing correlations... Log 3 or more days to generate deeper multi-factor insights.
            </p>
          </div>
        )}
      </div>

      {/* Longitudinal Trend Visualizer */}
      <TrendChart logs={logs} />

      {/* Quick Action Hub */}
      <div className="grid sm:grid-cols-3 gap-4 pt-2">
        <Link
          href="/companion"
          className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Conversational AI Companion
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Always-accessible chat grounded in your data, with plain-language Explain-My-Body mode and red-flag escalation.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-3">
            Open Companion <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/doctor-prep"
          className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Doctor-Visit Prep Generator
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Auto-summarize symptom frequency, vitals averages, and suggested questions into a printable one-page clinical brief.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-3">
            Generate Report <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/privacy"
          className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 mb-1">
            Privacy Control Center
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Pseudonymous architecture, default-off AI data sharing, instant JSON export, and single-click True Delete.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-3">
            Manage Privacy <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => loadUserData(user.id)}
      />
    </div>
  );
}
