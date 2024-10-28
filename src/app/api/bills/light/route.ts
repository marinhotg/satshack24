import { NextRequest, NextResponse } from "next/server";
import lightningService from "@/services/lightning";

export async function POST(req: NextRequest) {
  try {
    const { amount, memo } = await req.json();
    const invoice = await lightningService.createInvoice(amount, memo);
    const qrCode = await lightningService.generateInvoiceQRCode(invoice);
    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error("Erro ao criar invoice no backend:", error);
    return NextResponse.json(
      { error: "Erro ao criar o invoice", details: (error as Error).message },
      { status: 500 }
    );
  }
}
