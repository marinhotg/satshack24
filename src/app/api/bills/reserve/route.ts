import { NextRequest, NextResponse } from 'next/server';
import { billService } from "@/services/bill";

export const dynamic = 'force-dynamic';
export const runtime = 'edge'; 
export const preferredRegion = 'auto'; 

const FIXED_USER_ID = 1;

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    const { billId, reservationTime } = body;

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

    if (!bill) {
      return NextResponse.json(
        { error: 'Failed to create reservation' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: bill });
  } catch (error) {
    console.error('Failed to reserve bill:', error);
    return NextResponse.json(
      { error: 'Failed to reserve bill' },
      { status: 500 }
    );
  }
}