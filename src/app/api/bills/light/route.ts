import { NextRequest, NextResponse } from "next/server";
import lightningService from "@/services/lightning";
import { UserService } from "@/services/user";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, memo } = await req.json();

    // 1. Busca o nodeId do usuário
    const nodeId = await userService.getNodeIdByUserId(userId);

    if (!nodeId) {
      return NextResponse.json(
        { error: "nodeId não encontrado para o usuário." },
        { status: 404 }
      );
    }

    // 2. Gera o invoice usando o nodeId
    const invoice = await lightningService.createUserInvoice(
      amount,
      memo,
      nodeId
    );

    // 3. Gera o QR Code do invoice
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
