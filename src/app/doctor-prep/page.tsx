'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  HelpCircle,
  Activity,
  Moon,
  Zap,
  Smile,
  Clock,
} from 'lucide-react';
import { DEMO_PROFILES } from '@/components/ProfileSwitcher';
import { DoctorPrepReport, UserProfile } from '@/lib/types';

export default function DoctorPrepPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [report, setReport] = useState<DoctorPrepReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async (userId: string) => {
    setLoading(true);
    try {
      const profile = DEMO_PROFILES.find((p) => p.id === userId) || DEMO_PROFILES[0];
      setUser(profile);

      const res = await fetch(`/api/doctor-prep?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to load doctor prep report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    fetchReport(savedId);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      fetchReport(newId);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    return () => window.removeEventListener('herhealth_profile_changed', handleProfileChange);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Clinical One-Pager Generator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Doctor-Visit Prep Summary
          </h1>
          <p className="text-xs text-stone-600">
            Auto-synthesizes {user.name}&apos;s recent patterns into an objective, shareable clinical brief for any upcoming appointment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-400 text-xs">
          Synthesizing biometric trends and symptom correlations...
        </div>
      ) : !report ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-xs text-stone-500">
          Unable to generate report. Please ensure at least one check-in has been logged.
        </div>
      ) : (
        /* Printable Clinical Summary Sheet */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6">
          {/* Clinical Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-brand-600" />
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                  HerHealth Patient Well-Being Summary
                </h2>
              </div>
              <p className="text-xs text-stone-500">
                Self-Reported Longitudinal Health Patterns • Generated on {report.generatedDate}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs font-mono text-stone-700 sm:text-right">
              <p className="font-semibold text-stone-900">ID: {report.patientProfile.pseudonymousId}</p>
              <p className="text-[11px] text-stone-500">
                Age: {report.patientProfile.age} • Log Adherence: {report.patientProfile.adherenceRate}% ({report.patientProfile.totalCheckIns} entries)
              </p>
            </div>
          </div>

          {/* Section 1: 30-Day Vitals & Biomarkers Average */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-brand-600" />
              1. 30-Day Baseline Biometrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Avg Sleep</span>
                <span className="text-lg font-bold text-stone-900">{report.keyVitalsAverages.avgSleepHours} hrs</span>
                <span className="text-[10px] text-stone-400 block">Quality {report.keyVitalsAverages.avgSleepQuality}/5</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Avg Energy</span>
                <span className="text-lg font-bold text-stone-900">{report.keyVitalsAverages.avgEnergy} / 5</span>
                <span className="text-[10px] text-stone-400 block">Daytime Vitality</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Avg Mood</span>
                <span className="text-lg font-bold text-stone-900">{report.keyVitalsAverages.avgMood} / 5</span>
                <span className="text-[10px] text-stone-400 block">Emotional Bandwidth</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Avg Stress</span>
                <span className="text-lg font-bold text-stone-900">{report.keyVitalsAverages.avgStress} / 5</span>
                <span className="text-[10px] text-stone-400 block">Perceived Load</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Reporting Window</span>
                <span className="text-lg font-bold text-stone-900">{report.patientProfile.reportingPeriodDays} Days</span>
                <span className="text-[10px] text-stone-400 block">Longitudinal</span>
              </div>
            </div>
          </div>

          {/* Section 2: Most Frequent Symptoms Matrix */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-brand-600" />
              2. Reported Symptoms Matrix
            </h3>

            {report.topSymptoms.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No recurring symptoms logged during this reporting window.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2">Symptom</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-center">Frequency</th>
                      <th className="pb-2 text-right">Avg Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {report.topSymptoms.map((sym, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2.5 font-semibold text-stone-900">{sym.name}</td>
                        <td className="py-2.5 text-stone-500 capitalize">{sym.category}</td>
                        <td className="py-2.5 text-center font-medium">
                          {sym.frequencyCount} of {report.patientProfile.totalCheckIns} days ({Math.round((sym.frequencyCount / report.patientProfile.totalCheckIns) * 100)}%)
                        </td>
                        <td className="py-2.5 text-right font-medium">
                          {sym.avgSeverity === 3 ? '3.0 (Severe)' : sym.avgSeverity >= 2 ? `${sym.avgSeverity} (Moderate)` : `${sym.avgSeverity} (Mild)`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: AI Correlation Highlights */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              3. Significant Correlation Highlights
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {report.notableCorrelations.map((corr, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                  <span>{corr}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Patient Notes / Context */}
          {report.patientConcerns.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-600" />
                4. Patient Diary Excerpts (Self-Reported Context)
              </h3>
              <div className="space-y-1.5 text-xs text-stone-600">
                {report.patientConcerns.map((note, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-stone-50 border border-stone-100 italic">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: High-Yield Discussion Questions for Physician */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
            <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              5. High-Yield Physician Discussion Questions
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-800">
              {report.suggestedQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-brand-600">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Disclaimer */}
          <div className="pt-3 border-t border-stone-200 text-[10px] text-stone-400 text-center leading-relaxed">
            This document is an aggregated summary of patient self-reported observations compiled by the HerHealth Companion for clinical dialogue. It does not constitute medical diagnosis, lab interpretation, or therapeutic prescription.
          </div>
        </div>
      )}
    </div>
  );
}
