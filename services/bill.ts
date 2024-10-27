import { PrismaClient } from "@prisma/client";
import { Bill } from "../types/bill";

const prisma = new PrismaClient();

export class BillService {
  // create a new bill for payment
  async createBill(billData: Omit<Bill, "id" | "status">) {
    return prisma.bill.create({
      data: {
        ...billData,
        status: "PENDING",
      },
    });
  }

  async reserveBill(billId: number, userId: number, reservedUntil: Date) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        reservedBy: userId,
        status: "RESERVED",
        reservedUntil,
      },
    });
  }

  // Função para atualizar o código de pagamento (`paymentCode`) de uma bill
  async updatePaymentCode(billId: number, paymentCode: string) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        paymentCode,
      },
    });
  }

  async uptadeBillStatus(
    billId: number,
    status: "PAID" | "EXPIRED" | "CANCELLED"
  ) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        status,
      },
    });
  }

  // list available bills
  async getAvailableBillsForReserve() {
    return prisma.bill.findMany({
      where: {
        status: "PENDING",
      },
    });
  }

  async updateInvoiceId(billId: number, invoiceId: string) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        invoiceId,
      },
    });
  }

  async updatePaymentHash(billId: number, paymentHash: string) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        paymentHash,
      },
    });
  }

  async updatePaidAt(billId: number, paidAt: Date) {
    return prisma.bill.update({
      where: { id: billId },
      data: {
        paidAt,
      },
    });
  }
}
