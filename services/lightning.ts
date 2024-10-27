import {
  AccountTokenAuthProvider,
  LightsparkClient,
  BitcoinNetwork
} from "@lightsparkdev/lightspark-sdk";

class LightningService {
  private client: LightsparkClient;
  private nodeId: string;
  private nodePassword: string;

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
    this.nodePassword = requireEnv("LIGHTSPARK_NODE_PASSWORD");

    this.client = new LightsparkClient(
      new AccountTokenAuthProvider(tokenId, tokenSecret)
    );

    this.initializeNode();
  }

  private async initializeNode(): Promise<void> {
    try {
      await this.client.loadNodeSigningKey(this.nodeId, { 
        password: this.nodePassword 
      });
    } catch (error) {
      console.error('Failed to initialize node:', error);
      throw new Error('Failed to initialize Lightning node');
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
      console.error('Failed to create invoice:', error);
      throw new Error('Failed to create Lightning invoice');
    }
  }

  async payInvoice(encodedInvoice: string, maxAmountMsats: number) {
    try {
      const payment = await this.client.payInvoice(
        this.nodeId,
        encodedInvoice,
        maxAmountMsats
      );

      if (!payment) {
        throw new Error("Payment failed");
      }

      return payment;
    } catch (error) {
      console.error('Failed to pay invoice:', error);
      throw new Error('Failed to complete Lightning payment');
    }
  }

  async getTransactions() {
    try {
      const account = await this.client.getCurrentAccount();
      if (!account) {
        throw new Error("Unable to fetch the account.");
      }

      const transactionsConnection = await account.getTransactions(
        this.client,
        100, // limit
        undefined,
        undefined,
        undefined,
        undefined,
        BitcoinNetwork.REGTEST
      );

      return {
        transactions: transactionsConnection.entities,
        count: transactionsConnection.count
      };
    } catch (error) {
      console.error('Failed to get transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }
}

// Create singleton instance
const lightningService = new LightningService();

export default lightningService;