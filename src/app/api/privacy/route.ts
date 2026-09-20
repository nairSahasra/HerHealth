import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const exportMode = searchParams.get('export') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (exportMode) {
      // Full portable JSON export
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          privacyConsent: true,
          checkIns: {
            include: { symptoms: true },
          },
          insights: true,
          chatMessages: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return new NextResponse(JSON.stringify(user, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="herhealth-export-${user.pseudonymousId}.json"`,
        },
      });
    }

    const consent = await prisma.privacyConsent.findUnique({
      where: { userId },
    });

    return NextResponse.json(consent || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, aiProcessing, dataSharingResearch, localProcessingOnly } =
      await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updated = await prisma.privacyConsent.upsert({
      where: { userId },
      update: {
        aiProcessing: Boolean(aiProcessing),
        dataSharingResearch: Boolean(dataSharingResearch),
        localProcessingOnly: Boolean(localProcessingOnly),
      },
      create: {
        userId,
        aiProcessing: Boolean(aiProcessing),
        dataSharingResearch: Boolean(dataSharingResearch),
        localProcessingOnly: Boolean(localProcessingOnly),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // True Delete: purge check-ins, symptoms, insights, and chat logs
    await prisma.symptomLog.deleteMany({
      where: { checkIn: { userId } },
    });
    await prisma.dailyCheckIn.deleteMany({
      where: { userId },
    });
    await prisma.insight.deleteMany({
      where: { userId },
    });
    await prisma.chatMessage.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: 'All health logs, biometric entries, and companion chats have been permanently erased.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
