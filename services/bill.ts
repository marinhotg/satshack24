import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"

interface CreateBillInput {
  amount: number;
  dueDate: Date;
  paymentType: string;
  paymentCode?: string;
  bonusRate: number;
  currency: string;
  fileKey?: string;
  fileName?: string;
  fileType?: string;
  uploadedBy: number;
  reservedBy?: number;
  reservedUntil?: Date;
  invoiceId?: string;
  paymentHash?: string;
}

class BillService {
  async createBill(billInput: CreateBillInput) {
    const data: Prisma.BillCreateInput = {
      amount: billInput.amount,
      dueDate: billInput.dueDate,
      paymentType: billInput.paymentType,
      bonusRate: billInput.bonusRate,
      currency: billInput.currency,
      status: "PENDING",
      uploader: {
        connect: { id: billInput.uploadedBy }
      }
    };

    if (billInput.paymentCode) data.paymentCode = billInput.paymentCode;
    if (billInput.fileKey) data.fileKey = billInput.fileKey;
    if (billInput.fileName) data.fileName = billInput.fileName;
    if (billInput.fileType) data.fileType = billInput.fileType;
    if (billInput.reservedBy) {
      data.reserver = {
        connect: { id: billInput.reservedBy }
      };
    }
    if (billInput.reservedUntil) data.reservedUntil = billInput.reservedUntil;
    if (billInput.invoiceId) data.invoiceId = billInput.invoiceId;
    if (billInput.paymentHash) data.paymentHash = billInput.paymentHash;

    return prisma.bill.create({
      data,
      include: {
        uploader: true,
        reserver: true,
      }
    });
  }

  async getBill(id: number) {
    return prisma.bill.findUnique({
      where: { id },
      include: {
        uploader: true,
        reserver: true,
        rating: true,
      },
    });
  }

  async updateBillStatus(id: number, status: string) {
    return prisma.bill.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date(),
      },
    });
  }

  async reserveBill(id: number, userId: number, reservationTime: Date) {
    return prisma.bill.update({
      where: { id },
      data: {
        status: "RESERVED",
        reserver: {
          connect: { id: userId }
        },
        reservedUntil: reservationTime,
        updatedAt: new Date(),
      },
    });
  }

  async listPendingBills() {
    return prisma.bill.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        uploader: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async listUserBills(userId: number) {
    return prisma.bill.findMany({
      where: {
        OR: [
          { uploadedBy: userId },
          { reservedBy: userId },
        ],
      },
      include: {
        uploader: true,
        reserver: true,
        rating: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsPaid(id: number, invoiceId: string, paymentHash: string) {
    return prisma.bill.update({
      where: { id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        invoiceId,
        paymentHash,
        updatedAt: new Date(),
      },
    });
  }
}

export const billService = new BillService();