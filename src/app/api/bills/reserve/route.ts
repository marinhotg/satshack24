import { NextResponse } from 'next/server';
import { billService } from "@/services/bill";

const FIXED_USER_ID = 1; 

export async function POST(req: Request) {
  try {
    const { billId, reservationTime } = await req.json();

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