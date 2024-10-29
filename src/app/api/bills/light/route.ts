import { NextRequest, NextResponse } from "next/server";
import lightningService from "@/services/lightning";
import { UserService } from "@/services/user";
import { billService } from "@/services/bill";

const userService = new UserService();

/**
 * Validates and converts the input amount to BTC
 * Expects amount in sats, converts to BTC
 */
function validateAndConvertToBTC(amount: number): number {
  // If the amount is greater than 1, assume it's in sats
  // If it's already a small number (< 1), assume it's in BTC
  if (amount > 1) {
    return amount / 100_000_000; // Convert sats to BTC
  }
  return amount;
}

/**
 * Validates if the amount is within acceptable ranges
 */
function validateAmount(btcAmount: number): { 
  isValid: boolean; 
  error?: string;
  sats?: number;
  msats?: number;
} {
  // Maximum allowed is 0.1 BTC
  const MAX_BTC = 0.1;
  // Minimum allowed is 1 sat
  const MIN_SATS = 1;
  
  const sats = btcAmount * 100_000_000;
  
  if (btcAmount > MAX_BTC) {
    return { 
      isValid: false, 
      error: `Valor muito alto. Máximo permitido é ${MAX_BTC} BTC`
    };
  }
  
  if (sats < MIN_SATS) {
    return { 
      isValid: false, 
      error: "Valor muito baixo. Mínimo permitido é 1 sat"
    };
  }

  return { 
    isValid: true,
    sats: Math.round(sats),
    msats: Math.round(sats * 1000)
  };
}

export async function POST(req: NextRequest) {
  try {
    const { billId, amount, memo } = await req.json();
    console.log("Received original amount:", amount);

    if (!billId) {
      return NextResponse.json(
        { error: "billId é obrigatório." },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "amount deve ser um número positivo válido." },
        { status: 400 }
      );
    }

    // Convert to BTC if needed
    const btcAmount = validateAndConvertToBTC(amount);
    console.log("Converted to BTC:", btcAmount);

    // Validate the amount
    const validation = validateAmount(btcAmount);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: validation.error,
          details: {
            providedAmount: amount,
            convertedBTC: btcAmount
          }
        },
        { status: 400 }
      );
    }

    const billIdInt = parseInt(billId, 10);
    if (isNaN(billIdInt)) {
      return NextResponse.json(
        { error: "ID inválido: deve ser um número." },
        { status: 400 }
      );
    }

    const bill = await billService.getBill(billIdInt);
    if (!bill || !bill.reservedBy) {
      return NextResponse.json(
        { error: "Conta não encontrada ou não reservada." },
        { status: 404 }
      );
    }

    const nodeId = await userService.getNodeIdByUserId(bill.reservedBy);
    if (!nodeId) {
      return NextResponse.json(
        { error: "nodeId não encontrado para o usuário reservado." },
        { status: 404 }
      );
    }

    const safeMemo = memo || `Pagamento da conta #${billId}`;

    console.log("Creating invoice with:", {
      amountMsats: validation.msats,
      nodeId,
      memo: safeMemo,
      debug: {
        originalAmount: amount,
        convertedBTC: btcAmount,
        sats: validation.sats
      }
    });

    const invoice = await lightningService.createUserInvoice(
      validation.msats!,
      safeMemo,
    );

    const qrCode = await lightningService.generateInvoiceQRCode(invoice);

    return NextResponse.json({ 
      success: true,
      qrCode,
      invoice,
      debug: {
        originalAmount: amount,
        btcAmount,
        sats: validation.sats,
        msats: validation.msats
      }
    });

  } catch (error) {
    console.error("Erro ao criar invoice no backend:", error);
    
    if (error instanceof Error) {
      // Handle Lightspark specific errors
      if (error.message.includes('LightsparkException')) {
        const errorDetails = error.message.includes('NotFoundException') 
          ? 'Node não encontrado. Verifique as configurações do node.'
          : error.message;
          
        return NextResponse.json(
          { 
            error: "Erro ao criar invoice na Lightning Network",
            details: errorDetails
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Erro ao criar o invoice", 
        details: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
}