'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Download,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Key,
  Database,
  RefreshCw,
} from 'lucide-react';
import { DEMO_PROFILES } from '@/components/ProfileSwitcher';
import { UserProfile, PrivacySettings } from '@/lib/types';

export default function PrivacyPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [settings, setSettings] = useState<PrivacySettings>({
    aiProcessing: true,
    dataSharingResearch: false,
    localProcessingOnly: false,
    dataRetentionDays: 365,
  });
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPrivacySettings = async (userId: string) => {
    setLoading(true);
    try {
      const profile = DEMO_PROFILES.find((p) => p.id === userId) || DEMO_PROFILES[0];
      setUser(profile);

      const res = await fetch(`/api/privacy?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.userId) {
          setSettings({
            aiProcessing: data.aiProcessing ?? true,
            dataSharingResearch: data.dataSharingResearch ?? false,
            localProcessingOnly: data.localProcessingOnly ?? false,
            dataRetentionDays: data.dataRetentionDays ?? 365,
          });
        }
      }
    } catch (err) {
      console.error('Error loading privacy settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    fetchPrivacySettings(savedId);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      fetchPrivacySettings(newId);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    return () => window.removeEventListener('herhealth_profile_changed', handleProfileChange);
  }, []);

  const handleToggle = async (key: keyof PrivacySettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated);

    try {
      const res = await fetch('/api/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...updated,
        }),
      });

      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Privacy preferences updated successfully.' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to update privacy preferences.' });
    }
  };

  const handleExportData = () => {
    window.open(`/api/privacy?userId=${user.id}&export=true`, '_blank');
  };

  const handleTrueDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently erase all health logs, symptoms, insights, and chat history for ${user.name} (${user.pseudonymousId})? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/privacy?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: 'True Delete complete: All health records and chats were permanently wiped.',
        });
        window.dispatchEvent(new Event('herhealth_checkin_added'));
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error executing data deletion.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-2">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Architectural Privacy By Design</span>
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Privacy & Security Control Center
        </h1>
        <p className="text-xs text-stone-600">
          Your personal well-being data belongs exclusively to you. Configure granular permissions, export your complete records, or initiate permanent data erasure.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Architectural Security Card */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <h2 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-600" />
          Architectural Separation of Identity
        </h2>

        <div className="grid sm:grid-cols-3 gap-3 text-xs mb-4">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              Active User
            </span>
            <span className="font-bold text-stone-800 text-sm">{user.name}</span>
            <span className="text-stone-500 text-[11px] block mt-0.5">Age {user.age}</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              Internal Pseudonymous ID
            </span>
            <span className="font-mono font-bold text-stone-800 text-sm">
              {user.pseudonymousId}
            </span>
            <span className="text-stone-500 text-[11px] block mt-0.5">Isolated from Health DB</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 uppercase font-semibold block mb-1">
              Data Encryption
            </span>
            <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> AES-256 At Rest
            </span>
            <span className="text-stone-500 text-[11px] block mt-0.5">TLS 1.3 in Transit</span>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          HerHealth stores biometric logs and companion chats linked only to rotated pseudonymous IDs. No identity credentials, emails, or geolocation coordinates are ever saved alongside cycle or symptom telemetry.
        </p>
      </div>

      {/* Granular Consents */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Eye className="w-4 h-4 text-brand-600" />
          Granular Permission & Processing Controls
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          {/* AI Processing */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-stone-900">AI Pattern Recognition & Insight Engine</p>
              <p className="text-stone-500 text-[11px]">
                Allows local statistical correlation and companion synthesis of your sleep, energy, and symptoms.
              </p>
            </div>
            <button
              onClick={() => handleToggle('aiProcessing')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.aiProcessing ? 'bg-brand-600' : 'bg-stone-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.aiProcessing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Research Sharing (Default OFF) */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-stone-900">Anonymized Women&apos;s Health Research</p>
                <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 text-[10px] font-semibold">
                  Default: OFF
                </span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Contribute strictly de-identified symptom telemetry to academic female health research. Zero commercial sale.
              </p>
            </div>
            <button
              onClick={() => handleToggle('dataSharingResearch')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.dataSharingResearch ? 'bg-brand-600' : 'bg-stone-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.dataSharingResearch ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Local Processing Only */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-stone-900">Strict Local Device Processing Only</p>
              <p className="text-stone-500 text-[11px]">
                Bypass cloud AI models and rely solely on on-device heuristic correlation engines.
              </p>
            </div>
            <button
              onClick={() => handleToggle('localProcessingOnly')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.localProcessingOnly ? 'bg-brand-600' : 'bg-stone-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.localProcessingOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Export & True Delete Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Data Export */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-stone-900">
              <FileJson className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold">One-Click Data Export</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Download your complete longitudinal telemetry (daily check-ins, symptom logs, insights, and chats) in standard portable JSON format.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download My Data (JSON)</span>
          </button>
        </div>

        {/* True Delete */}
        <div className="p-6 rounded-2xl bg-white border border-red-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-900">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-bold">True Delete (Permanent Purge)</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Immediately and permanently wipe all biometric entries, symptom history, AI insights, and companion chat messages from the database.
            </p>
          </div>

          <button
            onClick={handleTrueDelete}
            disabled={isDeleting}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Erasing...' : 'Execute True Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
