import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        uploader: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error('Failed to fetch pending bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending bills' },
      { status: 500 }
    );
  }
}