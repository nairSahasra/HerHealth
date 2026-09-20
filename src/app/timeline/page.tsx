'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Moon,
  Zap,
  Smile,
  Activity,
  PlusCircle,
  Filter,
  CheckCircle2,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { DEMO_PROFILES } from '@/components/ProfileSwitcher';
import CheckInModal from '@/components/CheckInModal';
import { DailyCheckInData, UserProfile } from '@/lib/types';

export default function TimelinePage() {
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [logs, setLogs] = useState<DailyCheckInData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high_stress' | 'low_sleep' | 'symptoms'>('all');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const loadLogs = async (userId: string) => {
    setLoading(true);
    try {
      const profile = DEMO_PROFILES.find((p) => p.id === userId) || DEMO_PROFILES[0];
      setUser(profile);

      const res = await fetch(`/api/check-in?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    loadLogs(savedId);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      loadLogs(newId);
    };

    const handleCheckInAdded = () => {
      const currentId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      loadLogs(currentId);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    window.addEventListener('herhealth_checkin_added', handleCheckInAdded);

    return () => {
      window.removeEventListener('herhealth_profile_changed', handleProfileChange);
      window.removeEventListener('herhealth_checkin_added', handleCheckInAdded);
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'high_stress') return log.stressLevel >= 4;
    if (filter === 'low_sleep') return log.sleepHours < 6.5;
    if (filter === 'symptoms') return log.symptoms && log.symptoms.length > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Universal Longitudinal Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Personal Health Timeline
          </h1>
          <p className="text-xs text-stone-600">
            Unified chronological record for {user.name} ({user.age} yrs). Tracks how daily patterns interact over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCheckInOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-stone-400 font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filter === 'all' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Logs ({logs.length})
          </button>
          <button
            onClick={() => setFilter('high_stress')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filter === 'high_stress' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            High Stress (4-5)
          </button>
          <button
            onClick={() => setFilter('low_sleep')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filter === 'low_sleep' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Sleep &lt; 6.5h
          </button>
          <button
            onClick={() => setFilter('symptoms')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              filter === 'symptoms' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            With Symptoms
          </button>
        </div>

        <span className="text-stone-400 text-[11px] px-2">
          Showing {filteredLogs.length} entries
        </span>
      </div>

      {/* Timeline Entries List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-400 text-xs">
          Loading longitudinal timeline...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <p className="text-xs text-stone-500 mb-3">No logs match the selected filter criteria.</p>
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const dateObj = new Date(log.date + 'T00:00:00');
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div
                key={log.id || log.date}
                className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] uppercase font-bold text-stone-500">{dayName}</span>
                      <span className="text-xs font-bold text-stone-900">{monthDay}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{log.date}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {log.flowLevel && log.flowLevel !== 'none' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 capitalize">
                            Flow: {log.flowLevel}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500">
                          Sleep {log.sleepHours} hrs • Stress {log.stressLevel}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals summary badges */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-semibold text-indigo-950">{log.sleepHours}h</span>
                      <span className="text-indigo-400 text-[10px]">Q{log.sleepQuality}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold text-amber-950">{log.energy}/5</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-1.5">
                      <Smile className="w-3.5 h-3.5 text-rose-500" />
                      <span className="font-semibold text-rose-950">{log.mood}/5</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms and Notes */}
                <div className="space-y-2 text-xs">
                  {log.symptoms && log.symptoms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-stone-400 mr-1">Symptoms:</span>
                      {log.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200"
                        >
                          {s.name} {s.severity === 3 ? '(Severe)' : s.severity === 2 ? '(Moderate)' : '(Mild)'}
                        </span>
                      ))}
                    </div>
                  )}

                  {log.notes && (
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-stone-700 text-xs italic flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>&ldquo;{log.notes}&rdquo;</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={() => loadLogs(user.id)}
      />
    </div>
  );
}
