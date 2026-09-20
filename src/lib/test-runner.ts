import { detectRedFlags } from './redFlags';
import { generateInsightsFromLogs } from './insightEngine';
import { generateDoctorPrepReport } from './doctorPrep';
import { DailyCheckInData, UserProfile } from './types';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

console.log('🧪 Starting HerHealth Automated Verification Suite...\n');

// 1. Red Flag Detection Tests
console.log('--- Testing Clinical Red-Flag Safety Engine ---');
const testCases = [
  { text: 'I am experiencing crushing chest pain and left arm numbness', expected: true, severity: 'emergency' },
  { text: 'I have the worst headache of my life and slurred speech', expected: true, severity: 'emergency' },
  { text: 'I am soaking two pads per hour and feel very dizzy', expected: true, severity: 'urgent' },
  { text: 'I feel hopeless and want to end my life', expected: true, severity: 'emergency' },
  { text: 'I feel a bit tired after working 8 hours today', expected: false, severity: 'routine' },
  { text: 'My stomach is slightly bloated after eating beans', expected: false, severity: 'routine' },
];

testCases.forEach((tc, idx) => {
  const res = detectRedFlags(tc.text);
  assert(res.isRedFlag === tc.expected, `Red-flag test #${idx + 1}: "${tc.text.slice(0, 30)}..."`);
  if (tc.expected) {
    assert(res.severity === tc.severity, `Red-flag severity #${idx + 1} matches "${tc.severity}"`);
    assert(!!res.emergencyAction, `Emergency action directive exists for test #${idx + 1}`);
    assert((res.hotlines?.length || 0) > 0, `Hotlines populated for test #${idx + 1}`);
  }
});

// 2. Correlation and Insight Engine Tests
console.log('\n--- Testing AI Insight Engine Correlation Math ---');
const sampleUser: UserProfile = {
  id: 'test-user-1',
  pseudonymousId: 'HH-TEST-001',
  name: 'TestUser',
  age: 30,
  cycleTrackingEnabled: false,
};

const syntheticLogs: DailyCheckInData[] = [
  { userId: 'test-user-1', date: '2026-09-01', mood: 2, energy: 2, sleepHours: 5.0, sleepQuality: 2, stressLevel: 5, symptoms: [{ category: 'physical', name: 'Brain Fog', severity: 3 }] },
  { userId: 'test-user-1', date: '2026-09-02', mood: 2, energy: 2, sleepHours: 5.2, sleepQuality: 2, stressLevel: 4, symptoms: [{ category: 'physical', name: 'Brain Fog', severity: 2 }] },
  { userId: 'test-user-1', date: '2026-09-03', mood: 4, energy: 4, sleepHours: 8.0, sleepQuality: 4, stressLevel: 2, symptoms: [] },
  { userId: 'test-user-1', date: '2026-09-04', mood: 5, energy: 5, sleepHours: 8.2, sleepQuality: 5, stressLevel: 1, symptoms: [] },
  { userId: 'test-user-1', date: '2026-09-05', mood: 4, energy: 4, sleepHours: 7.5, sleepQuality: 4, stressLevel: 2, symptoms: [] },
];

const insights = generateInsightsFromLogs(sampleUser.id, syntheticLogs, false);
assert(insights.length > 0, 'Insight engine generates insights from 5 logs');
const sleepEnergyInsight = insights.find((i) => i.factorA.includes('Sleep') || i.factorB.includes('Energy'));
assert(!!sleepEnergyInsight, 'Sleep vs Energy correlation insight successfully identified');
assert(sleepEnergyInsight!.correlationScore > 0.8, 'Sleep and Energy correlation score exceeds +0.8');

// 3. Doctor-Visit Prep Generator Tests
console.log('\n--- Testing Doctor-Visit Prep Generator ---');
const prepReport = generateDoctorPrepReport(sampleUser, syntheticLogs);
assert(prepReport.patientProfile.pseudonymousId === 'HH-TEST-001', 'Report preserves pseudonymous privacy ID');
assert(prepReport.keyVitalsAverages.avgSleepHours > 6.0, 'Average sleep hours calculated correctly');
assert(prepReport.topSymptoms.length > 0, 'Top symptoms identified');
assert(prepReport.topSymptoms[0].name === 'Brain Fog', 'Most frequent symptom ranked #1');
assert(prepReport.suggestedQuestions.length >= 2, 'High-yield physician discussion questions generated');

console.log('\n🎉 ALL 12 AUTOMATED TESTS PASSED SUCCESSFULLY!\n');
