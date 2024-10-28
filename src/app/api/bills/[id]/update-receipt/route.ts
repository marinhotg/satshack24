import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const billId = parseInt(params.id);
    const { receiptUrl, receiptPathname } = await request.json();

    // Verificar se a bill existe e pode ser atualizada
    const existingBill = await prisma.bill.findUnique({
      where: { id: billId },
    });

    if (!existingBill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    if (existingBill.status !== 'RESERVED') {
      return NextResponse.json(
        { error: "Bill cannot be updated in its current status" },
        { status: 400 }
      );
    }

    // Atualizar a bill
    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        receiptUrl,
        receiptPathname,
        receiptUploadedAt: new Date(),
        status: 'PROCESSING', // Status definido diretamente aqui
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
    console.error("Failed to update bill receipt:", error);
    return NextResponse.json(
      { error: "Failed to update bill receipt" },
      { status: 500 }
    );
  }
}