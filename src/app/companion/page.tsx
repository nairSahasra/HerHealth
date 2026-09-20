'use client';

import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { Sparkles, ShieldCheck, Heart, Stethoscope, BookOpen, AlertCircle } from 'lucide-react';
import { DEMO_PROFILES } from '@/components/ProfileSwitcher';
import { UserProfile } from '@/lib/types';

export default function CompanionPage() {
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[0]);

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    const profile = DEMO_PROFILES.find((p) => p.id === savedId) || DEMO_PROFILES[0];
    setUser(profile);

    const handleProfileChange = () => {
      const newId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
      const p = DEMO_PROFILES.find((x) => x.id === newId) || DEMO_PROFILES[0];
      setUser(p);
    };

    window.addEventListener('herhealth_profile_changed', handleProfileChange);
    return () => window.removeEventListener('herhealth_profile_changed', handleProfileChange);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Always Accessible • Context-Aware</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Conversational AI Companion
          </h1>
          <p className="text-xs text-stone-600">
            Grounded in {user.name}&apos;s logged sleep, energy, and symptoms. Ready to translate body signals and explain health concepts in plain language.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-stone-700">Non-Diagnostic Safety Protocol Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <ChatInterface />
        </div>

        {/* Sidebar: Explain-My-Body mode & Safety Principles */}
        <div className="space-y-4">
          {/* Explain-My-Body Mode Info Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-stone-900">Explain-My-Body Mode</h3>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
              Ask your companion to translate complex medical terms, lab results, or bodily signals into plain, reassuring language.
            </p>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] text-stone-700">
              <span className="font-semibold block text-stone-900 mb-1">Try asking:</span>
              <ul className="list-disc pl-3.5 space-y-1 text-stone-600">
                <li>&ldquo;What does elevated TSH mean for energy?&rdquo;</li>
                <li>&ldquo;Explain sleep latency vs sleep debt&rdquo;</li>
                <li>&ldquo;Why do I feel anxious when sleep is broken?&rdquo;</li>
              </ul>
            </div>
          </div>

          {/* Safety & Clinical Guardrails */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-stone-900">Non-Negotiable Principles</h3>
            </div>
            <ul className="space-y-2 text-[11px] text-stone-600">
              <li className="flex items-start gap-1.5">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Never Diagnoses:</strong> Contextualizes signals and identifies patterns, never assigns disease labels.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Universal Grounding:</strong> Equal relevance for teenagers, adults, and post-menopausal women.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Red-Flag Escalation:</strong> Detects acute emergencies (cardiac, neurological, mental crisis) and instantly redirects to 911 / 988.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand-600 font-bold">•</span>
                <span><strong>Privacy-First:</strong> AI processing does not retain private identifiers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
