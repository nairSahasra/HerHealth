'use client';

import React, { useState, useEffect } from 'react';
import { X, Moon, Zap, Smile, ShieldAlert, Sparkles, Check, Plus } from 'lucide-react';
import { DEMO_PROFILES } from './ProfileSwitcher';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COMMON_SYMPTOMS = [
  { name: 'Fatigue', category: 'physical' },
  { name: 'Brain Fog', category: 'cognitive' },
  { name: 'Headache', category: 'physical' },
  { name: 'Bloating', category: 'digestive' },
  { name: 'Neck/Back Tension', category: 'physical' },
  { name: 'Joint Stiffness', category: 'physical' },
  { name: 'Anxiety/Worry', category: 'mood' },
  { name: 'Insomnia/Waking', category: 'physical' },
  { name: 'Cramping', category: 'physical' },
];

export default function CheckInModal({ isOpen, onClose, onSuccess }: CheckInModalProps) {
  const [userId, setUserId] = useState('user_maya_21');
  const [userProfile, setUserProfile] = useState(DEMO_PROFILES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [flowLevel, setFlowLevel] = useState<'none' | 'spotting' | 'light' | 'medium' | 'heavy'>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('herhealth_user_id') || 'user_maya_21';
    setUserId(savedId);
    const p = DEMO_PROFILES.find((x) => x.id === savedId) || DEMO_PROFILES[0];
    setUserProfile(p);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        userId,
        date,
        mood,
        energy,
        sleepHours: Number(sleepHours),
        sleepQuality,
        stressLevel,
        flowLevel: userProfile.cycleTrackingEnabled ? flowLevel : 'none',
        notes: notes.trim() || null,
        symptoms: selectedSymptoms.map((name) => {
          const matched = COMMON_SYMPTOMS.find((s) => s.name === name);
          return {
            name,
            category: matched ? matched.category : 'physical',
            severity: 2,
          };
        }),
      };

      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to record check-in');
      }

      window.dispatchEvent(new Event('herhealth_checkin_added'));
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-rose-100 text-rose-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-stone-900">Quick Daily Check-In</h2>
          </div>
          <p className="text-xs text-stone-500">
            10-second universal logging for {userProfile.name}. Tracks how your whole body feels.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Date Picker */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Check-in Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800"
            />
          </div>

          {/* Mood 1-5 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-stone-700">Mood (Emotional Bandwidth)</label>
              <span className="text-stone-500 font-medium">
                {mood === 1 && '😔 Low / Drained'}
                {mood === 2 && '🙁 Subdued'}
                {mood === 3 && '😐 Balanced / Okay'}
                {mood === 4 && '🙂 Uplifted'}
                {mood === 5 && '✨ Radiant / Joyful'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setMood(val)}
                  className={`py-2 rounded-lg border font-semibold transition-all ${
                    mood === val
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Energy 1-5 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-stone-700">Energy & Stamina</label>
              <span className="text-stone-500 font-medium">
                {energy === 1 && 'Exhausted'}
                {energy === 2 && 'Low Vitality'}
                {energy === 3 && 'Steady'}
                {energy === 4 && 'High'}
                {energy === 5 && 'Peak Energy'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setEnergy(val)}
                  className={`py-2 rounded-lg border font-semibold transition-all ${
                    energy === val
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Hours & Quality */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Sleep Quality (1-5)</label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800 bg-white"
              >
                <option value={1}>1 - Restless / Broken</option>
                <option value={2}>2 - Light / Interrupted</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Deep / Restorative</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
          </div>

          {/* Stress Level 1-5 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-stone-700">Stress & Pressure</label>
              <span className="text-stone-500 font-medium">
                {stressLevel <= 2 ? 'Low / Calming' : stressLevel === 3 ? 'Manageable' : 'High / Overwhelmed'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setStressLevel(val)}
                  className={`py-1.5 rounded-lg border font-semibold transition-all ${
                    stressLevel === val
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Flow / Spotting (Universal: Only active if user enables cycle tracking) */}
          {userProfile.cycleTrackingEnabled && (
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <label className="block font-medium text-rose-900 mb-1.5">
                Cycle Flow (Optional Signal)
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-[11px]">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                  <button
                    type="button"
                    key={flow}
                    onClick={() => setFlowLevel(flow)}
                    className={`py-1.5 capitalize rounded-md border font-medium transition-all ${
                      flowLevel === flow
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-100/50'
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms Multi-Select */}
          <div>
            <label className="block font-medium text-stone-700 mb-1.5">
              Symptoms Experienced (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.name);
                return (
                  <button
                    type="button"
                    key={sym.name}
                    onClick={() => toggleSymptom(sym.name)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-stone-800 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {sym.name}
                  </button>
                );
              })}
            </div>

            {/* Custom symptom adder */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add other symptom (e.g. Skin sensitivity)..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSymptom();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-500 text-stone-800"
              />
              <button
                type="button"
                onClick={handleAddCustomSymptom}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Free-Text Reflection Journal Note */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Personal Note / Reflection (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context today? (e.g., worked late, walked outside, meal changes)..."
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? 'Saving Check-In...' : 'Save Daily Check-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
