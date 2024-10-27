import { NextResponse } from 'next/server';
import { billService } from "@/services/bill";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bill = await billService.getBill(Number(params.id));
    
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Failed to fetch bill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill details' },
      { status: 500 }
    );
  }
}