import { lightsparkClient } from "@/lib/lightspark/client";
import { CurrencyAmount } from "@lightsparkdev/lightspark-sdk";

interface CreateInvoiceParams {
  amountSats: number;
  memo: string;
  expiresIn: number;
}

export class LightningService {
  async createPaymentInvoice({ amountSats, memo, expiresIn }: CreateInvoiceParams) {
    try {
      const invoice = await lightsparkClient.createInvoice({
        amountMsats: amountSats * 1000, 
        memo,
        expirySecs: expiresIn
      });
      
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async checkPaymentStatus(invoiceId: string) {
    try {
      const invoice = await lightsparkClient.getInvoice(invoiceId);
      return invoice.status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  async sendPayment(invoiceCode: string) {
    try {
      const payment = await lightsparkClient.payInvoice({
        encodedInvoice: invoiceCode,
        maximumFeesBase: CurrencyAmount.zero(),
        timeoutSecs: 60
      });
      
      return payment;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw error;
    }
  }

  async getWalletBalance() {
    try {
      const wallet = await lightsparkClient.getCurrentWallet();
      return wallet.balances?.availableToSendBalance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }
}
