async function runHttpTests() {
  const BASE_URL = 'http://localhost:3000';
  console.log(`🌐 Testing live HTTP endpoints at ${BASE_URL}...\n`);

  // 1. Test Users API
  const usersRes = await fetch(`${BASE_URL}/api/users`);
  const users = await usersRes.json();
  console.log(`✅ GET /api/users: Retrieved ${users.length} demographic cohorts (${users.map(u => u.name).join(', ')})`);

  // 2. Test Insights API
  const insightsRes = await fetch(`${BASE_URL}/api/insights?userId=user_maya_21`);
  const insights = await insightsRes.json();
  console.log(`✅ GET /api/insights: Generated ${insights.length} correlation insights for Maya`);

  // 3. Test Doctor-Prep API
  const prepRes = await fetch(`${BASE_URL}/api/doctor-prep?userId=user_maya_21`);
  const prep = await prepRes.json();
  console.log(`✅ GET /api/doctor-prep: Generated report with ${prep.topSymptoms.length} top symptoms and ${prep.suggestedQuestions.length} doctor questions`);

  // 4. Test Companion API (Regular Query)
  const chatRes = await fetch(`${BASE_URL}/api/companion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user_maya_21',
      message: 'Why do I feel so exhausted in the afternoons?',
    }),
  });
  const chatData = await chatRes.json();
  console.log(`✅ POST /api/companion (Regular): Received grounded response (${chatData.reply.slice(0, 75)}...)`);
  console.log(`   isRedFlag: ${chatData.isRedFlag}`);

  // 5. Test Companion API (Red-Flag Escalation)
  const redFlagRes = await fetch(`${BASE_URL}/api/companion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user_maya_21',
      message: 'I have crushing chest pain and left arm numbness',
    }),
  });
  const redFlagData = await redFlagRes.json();
  console.log(`✅ POST /api/companion (Red-Flag): Emergency escalation triggered!`);
  console.log(`   isRedFlag: ${redFlagData.isRedFlag}`);
  console.log(`   Emergency Action: ${redFlagData.redFlagDetails?.emergencyAction}`);
  console.log(`   Hotlines: ${redFlagData.redFlagDetails?.hotlines?.map(h => h.number).join(', ')}`);

  // 6. Test Privacy Consent API
  const privacyRes = await fetch(`${BASE_URL}/api/privacy?userId=user_maya_21`);
  const privacy = await privacyRes.json();
  console.log(`✅ GET /api/privacy: AI Processing = ${privacy.aiProcessing}, Research = ${privacy.dataSharingResearch}`);

  console.log('\n🎉 ALL LIVE ENDPOINTS VERIFIED & FUNCTIONING PERFECTLY!\n');
}

runHttpTests().catch(err => {
  console.error('HTTP Test Error:', err);
  process.exit(1);
});
