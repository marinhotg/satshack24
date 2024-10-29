import { NextRequest, NextResponse } from "next/server";
import lightningService from "@/services/lightning";
import { UserService } from "@/services/user";
import { billService } from "@/services/bill";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const { billId, amount, memo } = await req.json();

    // 1. Busca o ID do usuário (reservedBy) que reservou a conta usando o billId
    const bill = await billService.getBill(billId);
    if (!bill || !bill.reservedBy) {
      return NextResponse.json(
        { error: "Conta não encontrada ou não reservada." },
        { status: 404 }
      );
    }

    // 2. Encontra o nodeId do usuário (reservedBy)
    const nodeId = await userService.getNodeIdByUserId(bill.reservedBy);
    if (!nodeId) {
      return NextResponse.json(
        { error: "nodeId não encontrado para o usuário reservado." },
        { status: 404 }
      );
    }

    // 3. Gera o invoice usando o nodeId e os dados fornecidos
    const invoice = await lightningService.createUserInvoice(
      amount,
      memo,
      nodeId
    );

    // 4. Gera o QR Code para o invoice
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
