import { RedFlagDetection } from './types';

interface RedFlagRule {
  patterns: RegExp[];
  severity: 'emergency' | 'urgent';
  reason: string;
  emergencyAction: string;
  hotlines: { label: string; number: string }[];
}

const RED_FLAG_RULES: RedFlagRule[] = [
  {
    patterns: [
      /\b(suicid|kill\s*myself|end\s*my\s*life|harm\s*myself|want\s*to\s*die)\b/i,
      /\b(can'?t\s*go\s*on\s*anymore|better\s*off\s*dead)\b/i,
    ],
    severity: 'emergency',
    reason: 'Immediate safety or crisis risk detected.',
    emergencyAction: 'Please reach out for immediate help right now. You are not alone and free, confidential support is available 24/7.',
    hotlines: [
      { label: 'Suicide & Crisis Lifeline (US/Canada)', number: 'Call or Text 988' },
      { label: 'Crisis Text Line', number: 'Text HOME to 741741' },
      { label: 'International Emergency Services', number: 'Call 911 / 999 / 112' },
    ],
  },
  {
    patterns: [
      /\b(chest\s*pain|crushing\s*chest|radiat(ing|es)?\s*(to\s*)?(arm|jaw)|pressure\s*in\s*chest)\b/i,
      /\b(can'?t\s*breathe|severe\s*shortness\s*of\s*breath|gasping\s*for\s*air)\b/i,
    ],
    severity: 'emergency',
    reason: 'Potential acute cardiopulmonary symptoms detected. Women often present with atypical cardiac symptoms including severe pressure, shortness of breath, and fatigue.',
    emergencyAction: 'Stop any activity immediately and seek emergency medical care (call 911 or visit the nearest emergency room).',
    hotlines: [
      { label: 'Emergency Services', number: 'Call 911 or local emergency number' },
    ],
  },
  {
    patterns: [
      /\b(thunderclap|worst\s*headache\s*(of|in)\s*my\s*life|sudden\s*severe\s*headache)\b/i,
      /\b(facial\s*droop|slurred\s*speech|sudden\s*(vision\s*loss|blindness|numbness\s*on\s*one\s*side))\b/i,
    ],
    severity: 'emergency',
    reason: 'Potential acute neurological red flag (e.g. stroke warning or sudden intracranial pressure).',
    emergencyAction: 'Emergency evaluation is critical. Call emergency services immediately without waiting for symptoms to pass.',
    hotlines: [
      { label: 'Emergency Services', number: 'Call 911 or local emergency number' },
    ],
  },
  {
    patterns: [
      /\b(soaking\s*(two|2|several)\s*pads\s*per\s*hour|large\s*clots|uncontrollable\s*bleed(ing)?)\b/i,
      /\b(fainted\s*from\s*bleeding|dizzy\s*and\s*bleeding\s*heavily)\b/i,
    ],
    severity: 'urgent',
    reason: 'Severe acute bleeding or blood loss risk.',
    emergencyAction: 'This rate of bleeding requires prompt clinical assessment. Contact your gynecologist on-call or visit urgent care / emergency department immediately.',
    hotlines: [
      { label: 'Emergency Services', number: 'Call 911 or local emergency clinic' },
    ],
  },
  {
    patterns: [
      /\b(stiff\s*neck\s*with\s*fever|high\s*fever\s*and\s*confus(ed|ion)|fever\s*over\s*104)\b/i,
      /\b(severe\s*sudden\s*abdominal\s*pain|rebound\s*tenderness|can'?t\s*walk\s*from\s*pain)\b/i,
    ],
    severity: 'urgent',
    reason: 'Acute systemic or abdominal symptom requiring prompt medical evaluation.',
    emergencyAction: 'Please visit an urgent care center or emergency department for examination, imaging, or lab tests.',
    hotlines: [
      { label: 'Urgent Medical Assistance', number: 'Call 911 or local health advice line' },
    ],
  },
];

export function detectRedFlags(input: string): RedFlagDetection {
  if (!input || typeof input !== 'string') {
    return { isRedFlag: false, severity: 'routine' };
  }

  for (const rule of RED_FLAG_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(input)) {
        return {
          isRedFlag: true,
          severity: rule.severity,
          reason: rule.reason,
          emergencyAction: rule.emergencyAction,
          hotlines: rule.hotlines,
        };
      }
    }
  }

  return {
    isRedFlag: false,
    severity: 'routine',
  };
}
