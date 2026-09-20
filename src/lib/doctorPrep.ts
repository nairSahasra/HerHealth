import { DailyCheckInData, DoctorPrepReport, UserProfile } from './types';
import { generateInsightsFromLogs } from './insightEngine';

export function generateDoctorPrepReport(
  user: UserProfile,
  logs: DailyCheckInData[]
): DoctorPrepReport {
  const totalLogs = logs.length;
  const reportingPeriodDays = 30;
  const adherenceRate = Math.min(100, Math.round((totalLogs / reportingPeriodDays) * 100));

  // Compute vitals averages
  const avgSleepHours = totalLogs
    ? Math.round((logs.reduce((sum, l) => sum + l.sleepHours, 0) / totalLogs) * 10) / 10
    : 7.0;
  const avgSleepQuality = totalLogs
    ? Math.round((logs.reduce((sum, l) => sum + l.sleepQuality, 0) / totalLogs) * 10) / 10
    : 3.0;
  const avgEnergy = totalLogs
    ? Math.round((logs.reduce((sum, l) => sum + l.energy, 0) / totalLogs) * 10) / 10
    : 3.0;
  const avgMood = totalLogs
    ? Math.round((logs.reduce((sum, l) => sum + l.mood, 0) / totalLogs) * 10) / 10
    : 3.0;
  const avgStress = totalLogs
    ? Math.round((logs.reduce((sum, l) => sum + l.stressLevel, 0) / totalLogs) * 10) / 10
    : 3.0;

  // Symptom aggregation
  const symptomMap = new Map<
    string,
    { count: number; totalSeverity: number; category: string }
  >();

  logs.forEach((log) => {
    log.symptoms.forEach((s) => {
      const existing = symptomMap.get(s.name) || {
        count: 0,
        totalSeverity: 0,
        category: s.category,
      };
      existing.count += 1;
      existing.totalSeverity += s.severity;
      symptomMap.set(s.name, existing);
    });
  });

  const topSymptoms = Array.from(symptomMap.entries())
    .map(([name, data]) => ({
      name,
      frequencyCount: data.count,
      avgSeverity: Math.round((data.totalSeverity / data.count) * 10) / 10,
      category: data.category,
    }))
    .sort((a, b) => b.frequencyCount - a.frequencyCount)
    .slice(0, 5);

  // Correlations from engine
  const insights = generateInsightsFromLogs(user.id, logs, user.cycleTrackingEnabled);
  const notableCorrelations = insights.map((i) => `${i.title}: ${i.description}`);

  // Free-text notes extraction
  const patientConcerns = logs
    .filter((l) => l.notes && l.notes.trim().length > 5)
    .map((l) => `[${l.date}] ${l.notes}`)
    .slice(-4);

  // Targeted physician discussion questions
  const suggestedQuestions: string[] = [];
  if (topSymptoms.some((s) => s.name.toLowerCase().includes('fatigue'))) {
    suggestedQuestions.push(
      'Given my persistent fatigue despite averaging 7+ hours of sleep, should we check a full iron panel (ferritin, saturation), vitamin D, and TSH?'
    );
  }
  if (topSymptoms.some((s) => s.name.toLowerCase().includes('fog') || s.name.toLowerCase().includes('headache'))) {
    suggestedQuestions.push(
      'Are my recurring headaches and cognitive fog consistent with tension, migraine variants, or could they reflect cervical spine or ergonomic strain?'
    );
  }
  if (topSymptoms.some((s) => s.name.toLowerCase().includes('bloat') || s.category === 'digestive')) {
    suggestedQuestions.push(
      'Would you recommend an elimination protocol or testing for gut microbiome dysbiosis, celiac disease, or SIBO for these digestive symptoms?'
    );
  }
  if (suggestedQuestions.length < 3) {
    suggestedQuestions.push(
      'What lifestyle or preventive screenings are most appropriate for my age and health history at this stage?'
    );
    suggestedQuestions.push(
      'Could any of my current supplements or daily routines be interacting with my sleep architecture or daytime recovery?'
    );
  }

  return {
    generatedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    patientProfile: {
      pseudonymousId: user.pseudonymousId,
      age: user.age,
      reportingPeriodDays,
      totalCheckIns: totalLogs,
      adherenceRate,
    },
    keyVitalsAverages: {
      avgSleepHours,
      avgSleepQuality,
      avgEnergy,
      avgMood,
      avgStress,
    },
    topSymptoms,
    notableCorrelations,
    patientConcerns,
    suggestedQuestions,
  };
}
