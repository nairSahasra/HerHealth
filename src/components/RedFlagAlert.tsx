'use client';

import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';
import { RedFlagDetection } from '@/lib/types';

interface RedFlagAlertProps {
  detection: RedFlagDetection;
  onDismiss?: () => void;
}

export default function RedFlagAlert({ detection, onDismiss }: RedFlagAlertProps) {
  if (!detection.isRedFlag) return null;

  return (
    <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-5 shadow-lg my-4 text-red-900 relative animate-pulse">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-red-400 hover:text-red-700 hover:bg-red-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-sm">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-200 text-red-800">
              Immediate Clinical Escalation
            </span>
            <span className="text-xs font-semibold text-red-700">
              {detection.severity === 'emergency' ? 'Urgent / Emergency Care Required' : 'Clinical Consultation Advised'}
            </span>
          </div>

          <p className="text-sm font-bold text-red-950 mb-1">
            {detection.reason}
          </p>

          <p className="text-xs text-red-800 mb-4 leading-relaxed">
            {detection.emergencyAction}
          </p>

          {/* Emergency Hotlines / Actions */}
          {detection.hotlines && detection.hotlines.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-red-200">
              <p className="text-xs font-bold text-red-950 mb-2 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-red-600" />
                Emergency & Crisis Contacts:
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                {detection.hotlines.map((h, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-red-100/60 border border-red-200 font-medium">
                    <span className="text-red-900 block font-semibold">{h.label}</span>
                    <span className="text-red-700 font-bold">{h.number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
