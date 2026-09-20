import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processCompanionMessage } from '@/lib/aiCompanion';
import { DailyCheckInData, UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { userId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Retrieve recent 14-day logs for grounded context
    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { userId },
      include: { symptoms: true },
      orderBy: { date: 'desc' },
      take: 14,
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
      cycleLengthDays: user.cycleLengthDays,
      periodLengthDays: user.periodLengthDays,
    };

    const response = await processCompanionMessage({
      message,
      user: userProfile,
      recentLogs: formattedLogs,
    });

    // Save interaction to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: message,
      },
    });

    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: response.reply,
        isRedFlag: response.isRedFlag,
        redFlagReason: response.redFlagDetails?.reason || null,
      },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
