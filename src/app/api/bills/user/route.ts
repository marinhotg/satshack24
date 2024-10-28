import { NextResponse } from 'next/server';
import { billService } from "@/services/bill";

const FIXED_USER_ID = 1; // fixed user 

export async function GET(): Promise<NextResponse> {
  try {
    const bills = await billService.listUserBills(FIXED_USER_ID);
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Failed to fetch user bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user bills' },
      { status: 500 }
    );
  }
}