import { NextRequest, NextResponse } from 'next/server';
import { billService } from "@/services/bill";

export const dynamic = 'force-dynamic';

const FIXED_USER_ID = 1;

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { billId, reservationTime } = await request.json();

    if (!billId || !reservationTime) {
      return NextResponse.json(
        { error: 'billId and reservationTime are required' },
        { status: 400 }
      );
    }

    const bill = await billService.reserveBill(
      Number(billId),
      FIXED_USER_ID,
      new Date(reservationTime)
    );

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Failed to reserve bill:', error);
    return NextResponse.json(
      { error: 'Failed to reserve bill' },
      { status: 500 }
    );
  }
}