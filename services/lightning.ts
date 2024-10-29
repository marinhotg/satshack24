import {
  AccountTokenAuthProvider,
  LightsparkClient,
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

  /**
   * Creates a Lightning invoice for the configured node
   */
  async createInvoice(amountMsats: number, memo: string): Promise<string> {
    try {
      console.log("Creating invoice with node ID:", this.nodeId);
      
      const invoice = await this.client.createInvoice(
        this.nodeId,
        amountMsats,
        memo
      );

      if (!invoice) {
        throw new Error("Invoice creation returned null or undefined");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to create invoice:", error);
      
      // Check if it's a Lightspark error by looking at the error properties and message
      if (error instanceof Error && 
          (error.message.includes('LightsparkException') || 
           error.message.includes('Request CreateInvoice failed'))) {
        throw new Error(`Lightning error: ${error.message}`);
      }
      
      throw new Error("Failed to create Lightning invoice: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * Creates a Lightning invoice
   * Note: This always uses the configured node ID, not a user-provided one
   */
  async createUserInvoice(
    amountMsats: number,
    memo: string,
  ): Promise<string> {
    try {
      // Always use the configured node ID
      console.log("Creating user invoice with configured node ID:", this.nodeId);
      
      const invoice = await this.client.createInvoice(
        this.nodeId,
        amountMsats,
        memo
      );

      if (!invoice) {
        throw new Error("Invoice creation returned null or undefined");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to create user invoice:", error);
      
      // Check if it's a Lightspark error by looking at the error message
      if (error instanceof Error && 
          (error.message.includes('LightsparkException') || 
           error.message.includes('Request CreateInvoice failed'))) {
        // Extract useful information from the error message
        const errorMessage = error.message
          .replace('LightsparkException [Error]: Request CreateInvoice failed. ', '')
          .replace('[{"message":"', '')
          .replace('"}]', '');
        throw new Error(`Lightning error: ${errorMessage}`);
      }
      
      throw new Error("Failed to create Lightning invoice: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * Gets the configured node ID
   */
  getNodeId(): string {
    return this.nodeId;
  }
}

// Create singleton instance
const lightningService = new LightningService();

export default lightningService;