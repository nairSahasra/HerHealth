export interface UserProfile {
  id: string;
  pseudonymousId: string;
  name: string;
  age: number;
  cycleTrackingEnabled: boolean;
  cycleLengthDays?: number | null;
  periodLengthDays?: number | null;
}

export interface SymptomItem {
  category: 'physical' | 'cognitive' | 'digestive' | 'mood';
  name: string;
  severity: 1 | 2 | 3; // 1 = mild, 2 = moderate, 3 = severe
}

export interface DailyCheckInData {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  energy: number; // 1-5
  sleepHours: number;
  sleepQuality: number; // 1-5
  stressLevel: number; // 1-5
  flowLevel?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy' | null;
  notes?: string | null;
  symptoms: SymptomItem[];
}

export interface HealthInsight {
  id: string;
  userId: string;
  title: string;
  description: string;
  factorA: string;
  factorB: string;
  correlationScore: number;
  confidence: 'High' | 'Moderate' | 'Emerging';
  category: 'Sleep & Energy' | 'Stress & Symptoms' | 'Activity & Recovery' | 'General Rhythm';
  recommendation: string;
  createdAt?: string;
}

export interface RedFlagDetection {
  isRedFlag: boolean;
  severity: 'emergency' | 'urgent' | 'routine';
  reason?: string;
  emergencyAction?: string;
  hotlines?: { label: string; number: string }[];
}

export interface DoctorPrepReport {
  generatedDate: string;
  patientProfile: {
    pseudonymousId: string;
    age: number;
    reportingPeriodDays: number;
    totalCheckIns: number;
    adherenceRate: number;
  };
  keyVitalsAverages: {
    avgSleepHours: number;
    avgSleepQuality: number;
    avgEnergy: number;
    avgMood: number;
    avgStress: number;
  };
  topSymptoms: {
    name: string;
    frequencyCount: number;
    avgSeverity: number;
    category: string;
  }[];
  notableCorrelations: string[];
  patientConcerns: string[];
  suggestedQuestions: string[];
}

export interface PrivacySettings {
  aiProcessing: boolean;
  dataSharingResearch: boolean;
  localProcessingOnly: boolean;
  dataRetentionDays: number;
}
