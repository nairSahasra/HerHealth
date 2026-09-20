import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HerHealth Universal Companion database...');

  // Clean existing data
  await prisma.symptomLog.deleteMany({});
  await prisma.dailyCheckIn.deleteMany({});
  await prisma.insight.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.privacyConsent.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Profile 1: Maya (Age 21, College Student, Cycle Tracking: OFF)
  const maya = await prisma.user.create({
    data: {
      id: 'user_maya_21',
      pseudonymousId: 'HH-USER-9482A',
      name: 'Maya',
      age: 21,
      cycleTrackingEnabled: false,
      privacyConsent: {
        create: {
          aiProcessing: true,
          dataSharingResearch: false,
          localProcessingOnly: false,
          dataRetentionDays: 365,
        },
      },
    },
  });

  // 2. Profile 2: Elena (Age 37, Working Professional, Cycle Tracking: ON)
  const elena = await prisma.user.create({
    data: {
      id: 'user_elena_37',
      pseudonymousId: 'HH-USER-4821E',
      name: 'Elena',
      age: 37,
      cycleTrackingEnabled: true,
      cycleLengthDays: 29,
      periodLengthDays: 5,
      privacyConsent: {
        create: {
          aiProcessing: true,
          dataSharingResearch: false,
          localProcessingOnly: false,
          dataRetentionDays: 365,
        },
      },
    },
  });

  // 3. Profile 3: Sarah (Age 58, Post-Menopausal Educator, Cycle Tracking: OFF)
  const sarah = await prisma.user.create({
    data: {
      id: 'user_sarah_58',
      pseudonymousId: 'HH-USER-7193S',
      name: 'Sarah',
      age: 58,
      cycleTrackingEnabled: false,
      privacyConsent: {
        create: {
          aiProcessing: true,
          dataSharingResearch: false,
          localProcessingOnly: false,
          dataRetentionDays: 365,
        },
      },
    },
  });

  console.log(`Created 3 universal demographic profiles: Maya (21), Elena (37), Sarah (58)`);

  // Helper to generate dates
  const today = new Date();
  const getDateStr = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  // Seed 14 days of realistic logs for Maya (sleep variation vs exam stress)
  for (let i = 13; i >= 0; i--) {
    const dateStr = getDateStr(i);
    const isExamDay = i % 4 === 0;
    const sleepHours = isExamDay ? 5.2 : 7.8;
    const stress = isExamDay ? 5 : 2;
    const energy = isExamDay ? 2 : 4;
    const mood = isExamDay ? 2 : 4;

    const checkIn = await prisma.dailyCheckIn.create({
      data: {
        userId: maya.id,
        date: dateStr,
        sleepHours,
        sleepQuality: isExamDay ? 2 : 4,
        stressLevel: stress,
        energy,
        mood,
        flowLevel: 'none',
        notes: isExamDay ? 'Late study session for biochemistry exams. Heavy screen time.' : 'Walked outdoors and cooked dinner. Slept well.',
        symptoms: {
          create: isExamDay
            ? [
                { category: 'cognitive', name: 'Brain Fog', severity: 3 },
                { category: 'physical', name: 'Neck Tension', severity: 2 },
              ]
            : [{ category: 'physical', name: 'Mild Fatigue', severity: 1 }],
        },
      },
    });
  }

  // Seed 14 days of realistic logs for Elena (cycle tracking enabled, migraine & luteal tracking)
  for (let i = 13; i >= 0; i--) {
    const dateStr = getDateStr(i);
    const isLuteal = i >= 3 && i <= 6;
    const isPeriod = i < 3;
    const sleepHours = isLuteal ? 6.5 : 7.5;
    const energy = isPeriod ? 2 : isLuteal ? 3 : 4;
    const mood = isLuteal ? 2 : 4;

    await prisma.dailyCheckIn.create({
      data: {
        userId: elena.id,
        date: dateStr,
        sleepHours,
        sleepQuality: isLuteal ? 2 : 4,
        stressLevel: isLuteal ? 4 : 2,
        energy,
        mood,
        flowLevel: isPeriod ? (i === 1 ? 'heavy' : 'medium') : 'none',
        notes: isLuteal ? 'Feeling sluggish and craving salty foods. Tension headache around midday.' : 'Great workout session this morning.',
        symptoms: {
          create: isLuteal
            ? [
                { category: 'physical', name: 'Headache', severity: 2 },
                { category: 'digestive', name: 'Bloating', severity: 2 },
              ]
            : isPeriod
            ? [{ category: 'physical', name: 'Cramping', severity: 2 }]
            : [],
        },
      },
    });
  }

  // Seed 14 days of realistic logs for Sarah (post-menopausal, joint stiffness, sleep quality)
  for (let i = 13; i >= 0; i--) {
    const dateStr = getDateStr(i);
    const rainyDay = i % 3 === 0;
    const sleepHours = rainyDay ? 6.0 : 7.4;
    const energy = rainyDay ? 3 : 4;
    const mood = 4;

    await prisma.dailyCheckIn.create({
      data: {
        userId: sarah.id,
        date: dateStr,
        sleepHours,
        sleepQuality: rainyDay ? 3 : 5,
        stressLevel: 2,
        energy,
        mood,
        flowLevel: 'none',
        notes: rainyDay ? 'Morning morning stiffness in hands and knees. Did 20 minutes of gentle aquatic stretches.' : 'Read in the garden, high stamina today.',
        symptoms: {
          create: rainyDay
            ? [
                { category: 'physical', name: 'Joint Stiffness', severity: 2 },
                { category: 'physical', name: 'Dry Eyes', severity: 1 },
              ]
            : [],
        },
      },
    });
  }

  console.log('✅ Successfully seeded realistic 14-day logs for all demographic cohorts.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
