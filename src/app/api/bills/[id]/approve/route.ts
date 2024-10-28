import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const billId = parseInt(params.id);

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

    // Atualizar a bill para aprovada
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