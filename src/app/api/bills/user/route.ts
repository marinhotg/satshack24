import { NextRequest, NextResponse } from "next/server";
import { billService } from "@/services/bill";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log('Fetching bills for userId:', userId);
    const bills = await billService.listUserBills(Number(userId));
    console.log('Found bills:', bills);
    
    return NextResponse.json(bills);
  } catch (error) {
    console.error("Failed to fetch user bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch user bills" },
      { status: 500 }
    );
  }
}