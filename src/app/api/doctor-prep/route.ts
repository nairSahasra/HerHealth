import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDoctorPrepReport } from '@/lib/doctorPrep';
import { DailyCheckInData, UserProfile } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { userId },
      include: { symptoms: true },
      orderBy: { date: 'asc' },
    });

    const formattedLogs: DailyCheckInData[] = checkIns.map((c) => ({
      id: c.id,
      userId: c.userId,
      date: c.date,
      mood: c.mood,
      energy: c.energy,
      sleepHours: c.sleepHours,
      sleepQuality: c.sleepQuality,
      stressLevel: c.stressLevel,
      flowLevel: c.flowLevel as any,
      notes: c.notes,
      symptoms: c.symptoms.map((s) => ({
        category: s.category as any,
        name: s.name,
        severity: s.severity as any,
      })),
    }));

    const userProfile: UserProfile = {
      id: user.id,
      pseudonymousId: user.pseudonymousId,
      name: user.name,
      age: user.age,
      cycleTrackingEnabled: user.cycleTrackingEnabled,
    };

    const report = generateDoctorPrepReport(userProfile, formattedLogs);

    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
