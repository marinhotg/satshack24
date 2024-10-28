import {
  AccountTokenAuthProvider,
  LightsparkClient,
  BitcoinNetwork,
} from "@lightsparkdev/lightspark-sdk";

import QRCode from "qrcode";

class LightningService {
  private client: LightsparkClient;
  private nodeId: string;

  constructor() {
    const requireEnv = (name: string): string => {
      const value = process.env[name];
      if (value === undefined) {
        throw new Error(`Environment variable ${name} is not set.`);
      }
      return value;
    };

    const tokenId = requireEnv("LIGHTSPARK_API_TOKEN_CLIENT_ID");
    const tokenSecret = requireEnv("LIGHTSPARK_API_TOKEN_CLIENT_SECRET");
    this.nodeId = requireEnv("LIGHTSPARK_NODE_ID");

    this.client = new LightsparkClient(
      new AccountTokenAuthProvider(tokenId, tokenSecret)
    );
  }

  async generateInvoiceQRCode(encodedInvoice: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(encodedInvoice);
      return qrCodeDataURL;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      throw new Error("QR code generation failed");
    }
  }

  async createInvoice(amountMsats: number, memo: string): Promise<string> {
    try {
      const invoice = await this.client.createInvoice(
        this.nodeId,
        amountMsats,
        memo
      );

      if (!invoice) {
        throw new Error("Unable to create the invoice.");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to create invoice:", error);
      throw new Error("Failed to create Lightning invoice");
    }
  }

  async createUserInvoice(
    amountMsats: number,
    memo: string,
    nodeId: string
  ): Promise<string> {
    try {
      const invoice = await this.client.createInvoice(
        nodeId,
        amountMsats,
        memo
      );

      if (!invoice) {
        throw new Error("Unable to create the invoice.");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to create invoice:", error);
      throw new Error("Failed to create Lightning invoice");
    }
  }
}

// Create singleton instance
const lightningService = new LightningService();

export default lightningService;
