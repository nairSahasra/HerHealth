'use client';

import React, { useEffect, useState } from 'react';
import { User, Users, ChevronDown, Check } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface ProfileSwitcherProps {
  onProfileChange?: (user: UserProfile) => void;
}

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user_maya_21',
    pseudonymousId: 'HH-USER-9482A',
    name: 'Maya',
    age: 21,
    cycleTrackingEnabled: false,
  },
  {
    id: 'user_elena_37',
    pseudonymousId: 'HH-USER-4821E',
    name: 'Elena',
    age: 37,
    cycleTrackingEnabled: true,
    cycleLengthDays: 29,
    periodLengthDays: 5,
  },
  {
    id: 'user_sarah_58',
    pseudonymousId: 'HH-USER-7193S',
    name: 'Sarah',
    age: 58,
    cycleTrackingEnabled: false,
  },
];

export default function ProfileSwitcher({ onProfileChange }: ProfileSwitcherProps) {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id');
    if (savedId) {
      const found = DEMO_PROFILES.find((p) => p.id === savedId);
      if (found) {
        setSelectedUser(found);
      }
    }
  }, []);

  const handleSelect = (profile: UserProfile) => {
    setSelectedUser(profile);
    localStorage.setItem('herhealth_user_id', profile.id);
    setIsOpen(false);
    if (onProfileChange) {
      onProfileChange(profile);
    }
    // Dispatch storage event so all components react
    window.dispatchEvent(new Event('herhealth_profile_changed'));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors border border-stone-200"
        title="Switch universal demographic cohort"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold">{selectedUser.name}</span>
        <span className="text-stone-500">
          Age {selectedUser.age} • {selectedUser.cycleTrackingEnabled ? 'Cycle On' : 'Universal (Cycle Off)'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 z-50 p-2 py-2">
            <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Universal Demographic Cohort
              </p>
              <p className="text-xs text-stone-600">
                Switch profiles to see how the app naturally works for all life stages.
              </p>
            </div>

            {DEMO_PROFILES.map((profile) => {
              const isSelected = profile.id === selectedUser.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => handleSelect(profile)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-rose-50 text-rose-900 font-semibold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-stone-900">{profile.name}</span>
                      <span className="text-[11px] text-stone-400">({profile.age} yrs)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {profile.id === 'user_maya_21' && 'Student • Exam stress & irregular sleep'}
                      {profile.id === 'user_elena_37' && 'Professional • Cycle awareness & migraine'}
                      {profile.id === 'user_sarah_58' && 'Educator • Post-menopause & joint comfort'}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
