import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: { userId },
      include: { symptoms: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(checkIns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      date,
      mood,
      energy,
      sleepHours,
      sleepQuality,
      stressLevel,
      flowLevel,
      notes,
      symptoms = [],
    } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'userId and date are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert check-in
    const existing = await prisma.dailyCheckIn.findUnique({
      where: { userId_date: { userId, date } },
    });

    if (existing) {
      // Remove old symptoms then re-insert
      await prisma.symptomLog.deleteMany({
        where: { checkInId: existing.id },
      });

      const updated = await prisma.dailyCheckIn.update({
        where: { id: existing.id },
        data: {
          mood: Number(mood),
          energy: Number(energy),
          sleepHours: Number(sleepHours),
          sleepQuality: Number(sleepQuality),
          stressLevel: Number(stressLevel),
          flowLevel: flowLevel || 'none',
          notes: notes || null,
          symptoms: {
            create: symptoms.map((s: any) => ({
              category: s.category || 'physical',
              name: s.name,
              severity: Number(s.severity) || 1,
            })),
          },
        },
        include: { symptoms: true },
      });

      return NextResponse.json(updated);
    }

    const created = await prisma.dailyCheckIn.create({
      data: {
        userId,
        date,
        mood: Number(mood),
        energy: Number(energy),
        sleepHours: Number(sleepHours),
        sleepQuality: Number(sleepQuality),
        stressLevel: Number(stressLevel),
        flowLevel: flowLevel || 'none',
        notes: notes || null,
        symptoms: {
          create: symptoms.map((s: any) => ({
            category: s.category || 'physical',
            name: s.name,
            severity: Number(s.severity) || 1,
          })),
        },
      },
      include: { symptoms: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
