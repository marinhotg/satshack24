import { NextRequest, NextResponse } from 'next/server';
import { billService } from "@/services/bill";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  const id = request.url.split('/').pop();
  
  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Bill ID is required' },
        { status: 400 }
      );
    }

    const bill = await billService.getBill(Number(id));
    
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