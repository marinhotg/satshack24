import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").slice(-2, -1)[0];
    console.log("ID AQUI: ", id);
    if (!id) {
      return NextResponse.json(
        { error: "Bill ID is missing" },
        { status: 400 }
      );
    }

    const billId = parseInt(id);

    const existingBill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        uploader: true
      }
    });

    if (!existingBill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    if (existingBill.status !== 'PROCESSING') {
      return NextResponse.json(
        { error: "Bill cannot be approved in its current status" },
        { status: 400 }
      );
    }

    if (!existingBill.receiptUrl) {
      return NextResponse.json(
        { error: "Cannot approve bill without receipt" },
        { status: 400 }
      );
    }

    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        status: 'APPROVED',
      },
      include: {
        uploader: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(updatedBill);
  } catch (error) {
    console.error("Failed to approve bill:", error);
    return NextResponse.json(
      { error: "Failed to approve bill" },
      { status: 500 }
    );
  }
}
