import { PrismaClient } from '@prisma/client';
import { LightningService } from './lightning';

const prisma = new PrismaClient();
const lightningService = new LightningService();

export class BillService {
  // create a new bill for payment
  async createBill(billData: Omit<Bill, 'id' | 'status'>) {
    return prisma.bill.create({
      data: {
        ...billData,
        status: 'PENDING'
      }
    });
  }

  async confirmPayment(billId: string) {
    // retrieve the bill with information about the reserver
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: {
        reserver: true // assuming there is a relationship with the user
      }
    });

    if (!bill) {
      throw new Error('bill not found');
    }

    if (bill.status !== 'RESERVED') {
      throw new Error('bill is not reserved');
    }

    if (!bill.reservedBy) {
      throw new Error('bill has no reserver');
    }

    if (bill.reservedUntil && bill.reservedUntil < new Date()) {
      throw new Error('bill reservation has expired');
    }

    // calculate total amount in sats (including bonus)
    const baseAmount = bill.amount;
    const bonusAmount = baseAmount * bill.bonusRate;
    const totalAmount = baseAmount + bonusAmount;
    
    // create invoice for payment
    const invoice = await lightningService.createPaymentInvoice({
      amountSats: totalAmount,
      memo: `payment for bill ${billId} - base: ${baseAmount} + bonus: ${bonusAmount}`,
      expiresIn: 3600 // 1 hour to pay
    });

    // update bill status
    await prisma.bill.update({
      where: { id: billId },
      data: { 
        status: 'PAID',
        // we can add more fields here if necessary:
        // paidAt: new Date(),
        // invoiceId: invoice.id,
        // paymentStatus: 'PENDING_CONFIRMATION'
      }
    });

    return {
      invoice,
      paymentDetails: {
        baseAmount,
        bonusAmount,
        totalAmount,
        billId
      }
    };
  }

  // list available bills
  async getAvailableBills() {
    return prisma.bill.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          {
            status: 'RESERVED',
            reservedUntil: {
              lt: new Date()
            }
          }
        ]
      }
    });
  }
}
