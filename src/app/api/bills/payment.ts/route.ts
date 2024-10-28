import { NextRequest, NextResponse } from "next/server";
import { billService } from "@/services/bill"; 

export async function POST(req: NextRequest) {
  try {
    const { id, qrCode } = await req.json();

    if (!id || !qrCode) {
      return NextResponse.json({ error: "ID e QR Code são obrigatórios" }, { status: 400 });
    }

    const updatedBill = await billService.updateQrCode(id, qrCode);

    return NextResponse.json({
      message: "QR Code atualizado com sucesso",
      bill: updatedBill,
    });
  } catch (error) {
    console.error("Erro ao atualizar o QR code:", error);
    return NextResponse.json({ error: "Erro ao atualizar o QR code" }, { status: 500 });
  }
}
