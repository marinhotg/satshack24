import { NextResponse } from 'next/server';
import { billService } from "@/services/bill";

export async function GET() {
  try {
    const bills = await billService.listPendingBills();
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Failed to fetch pending bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending bills' },
      { status: 500 }
    );
  }
}