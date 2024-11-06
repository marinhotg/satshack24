import {
  AccountTokenAuthProvider,
  LightsparkClient,
  TransactionStatus,
} from "@lightsparkdev/lightspark-sdk";

import QRCode from "qrcode";

class LightningService {
  private client: LightsparkClient;
  private nodeId: string;
  private subscription: any;

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

  async createUserInvoice(
    nodeId: string,
    amountMsats: number,
    memo: string
  ): Promise<string> {
    try {
      const invoice = await this.client.createInvoice(
        nodeId,
        amountMsats,
        memo
      );

      if (!invoice) {
        throw new Error("Invoice creation returned null or undefined");
      }

      return invoice;
    } catch (error) {
      console.error("Failed to create user invoice:", error);
      throw new Error(
        "Failed to create Lightning invoice: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  startListeningForTransaction(nodeId: string) {
    if (this.subscription) {
      console.log("Already listening for transactions.");
      return;
    }

    console.log("Starting to listen for transactions...");

    this.subscription = this.client.listenToTransactions([nodeId]).subscribe({
      next: (transaction) => {
        if (transaction) {
          console.log(`Transaction updated! ${JSON.stringify(transaction)}`);
          if (transaction.status === TransactionStatus.SUCCESS) {
            console.log("Transaction confirmed!");
            this.stopListening();
          } else if (transaction.status === TransactionStatus.CANCELLED) {
            console.log("Transaction cancelled.");
            this.stopListening();
          } else if (transaction.status === TransactionStatus.PENDING) {
            console.log("Transaction pending.");
          }
        }
      },
      error: (error) => {
        console.error("Error listening for transactions:", error);
      },
    });
  }

  stopListening() {
    if (this.subscription) {
      console.log("Stopping listening for transactions...");
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  getNodeId(): string {
    return this.nodeId;
  }
}

// Singleton instance
const lightningService = new LightningService();

export default lightningService;
