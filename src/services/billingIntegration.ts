export interface BillingTransaction {
  invoiceNumber: string;
  saleDateTime: string;
  customerId: string;
  purchaseAmount: number;
  products: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    sku?: string;
  }>;
  customerPhone?: string;
  customerEmail?: string;
}

export interface IntegrationConfig {
  apiUrl: string;
  apiKey: string;
  webhookUrl: string;
  webhookSecret: string;
  syncFrequency: number;
  autoSync: boolean;
  customerIdField: string;
  amountField: string;
  productField: string;
  invoiceField: string;
  dateField: string;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  pointsAwarded: number;
  errors: string[];
  timestamp: string;
}

export interface BillingSystem {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'both';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  syncFrequency: number;
}

export class BillingIntegrationService {
  private config: IntegrationConfig;
  private isRunning: boolean = false;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Fetch transactions from billing system
  async fetchTransactions(since?: string): Promise<BillingTransaction[]> {
    try {
      const params = since ? `?since=${since}` : '';
      const response = await fetch(`${this.config.apiUrl}/transactions${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.mapBillingData(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  // Process webhook data
  async processWebhook(payload: any, signature: string): Promise<SyncResult> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const transaction = this.mapWebhookData(payload);
      const result = await this.processTransaction(transaction);

      return {
        success: true,
        recordsProcessed: 1,
        pointsAwarded: result.pointsAwarded,
        errors: [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return {
        success: false,
        recordsProcessed: 0,
        pointsAwarded: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Process individual transaction
  private async processTransaction(transaction: BillingTransaction): Promise<{ pointsAwarded: number }> {
    // Calculate points based on purchase amount
    const pointsAwarded = Math.floor(transaction.purchaseAmount * 10); // 10 points per currency unit

    // Here you would integrate with your loyalty system
    // await this.awardLoyaltyPoints(transaction.customerId, pointsAwarded, transaction.invoiceNumber);

    return { pointsAwarded };
  }

  // Map billing system data to internal format
  private mapBillingData(data: any[]): BillingTransaction[] {
    return data.map(item => ({
      invoiceNumber: item[this.config.invoiceField] || item.invoice_number,
      saleDateTime: item[this.config.dateField] || item.sale_date,
      customerId: item[this.config.customerIdField] || item.customer_id,
      purchaseAmount: parseFloat(item[this.config.amountField] || item.total_amount),
      products: Array.isArray(item[this.config.productField]) 
        ? item[this.config.productField].map((p: any) => ({
            name: p.name || p.product_name,
            quantity: parseInt(p.quantity || p.qty),
            unitPrice: parseFloat(p.unit_price || p.price),
            sku: p.sku || p.product_code
          }))
        : [],
      customerPhone: item.customer_phone,
      customerEmail: item.customer_email
    }));
  }

  // Map webhook data to internal format
  private mapWebhookData(payload: any): BillingTransaction {
    return {
      invoiceNumber: payload[this.config.invoiceField] || payload.invoice_number,
      saleDateTime: payload[this.config.dateField] || payload.sale_date,
      customerId: payload[this.config.customerIdField] || payload.customer_id,
      purchaseAmount: parseFloat(payload[this.config.amountField] || payload.total_amount),
      products: Array.isArray(payload[this.config.productField]) 
        ? payload[this.config.productField].map((p: any) => ({
            name: p.name || p.product_name,
            quantity: parseInt(p.quantity || p.qty),
            unitPrice: parseFloat(p.unit_price || p.price),
            sku: p.sku || p.product_code
          }))
        : [],
      customerPhone: payload.customer_phone,
      customerEmail: payload.customer_email
    };
  }

  // Verify webhook signature
  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Implement signature verification logic here
    // This is a simplified example - you should use proper crypto verification
    const expectedSignature = this.generateSignature(payload);
    return signature === expectedSignature;
  }

  // Generate signature for webhook verification
  private generateSignature(payload: any): string {
    const data = JSON.stringify(payload) + this.config.webhookSecret;
    // In production, use proper crypto hashing
    return btoa(data).slice(0, 32);
  }

  // Start automatic synchronization
  async startAutoSync(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.runSyncLoop();
  }

  // Stop automatic synchronization
  stopAutoSync(): void {
    this.isRunning = false;
  }

  // Main sync loop
  private async runSyncLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.performSync();
        await this.sleep(this.config.syncFrequency * 60 * 1000); // Convert minutes to milliseconds
      } catch (error) {
        console.error('Auto-sync error:', error);
        await this.sleep(5 * 60 * 1000); // Wait 5 minutes on error
      }
    }
  }

  // Perform synchronization
  private async performSync(): Promise<SyncResult> {
    try {
      const transactions = await this.fetchTransactions();
      let totalPoints = 0;
      const errors: string[] = [];

      for (const transaction of transactions) {
        try {
          const result = await this.processTransaction(transaction);
          totalPoints += result.pointsAwarded;
        } catch (error) {
          errors.push(`Transaction ${transaction.invoiceNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return {
        success: errors.length === 0,
        recordsProcessed: transactions.length,
        pointsAwarded: totalPoints,
        errors,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        recordsProcessed: 0,
        pointsAwarded: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Utility function for sleep
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Update configuration
  updateConfig(newConfig: Partial<IntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): IntegrationConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const billingIntegrationService = new BillingIntegrationService({
  apiUrl: '',
  apiKey: '',
  webhookUrl: '',
  webhookSecret: '',
  syncFrequency: 5,
  autoSync: true,
  customerIdField: 'customer_phone',
  amountField: 'total_amount',
  productField: 'products',
  invoiceField: 'invoice_number',
  dateField: 'sale_date'
});
