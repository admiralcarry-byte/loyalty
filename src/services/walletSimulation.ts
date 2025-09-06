import { WalletProvider, WalletTransaction, WalletStats } from './walletIntegration';

// Simulated wallet providers data
const SIMULATED_PROVIDERS: WalletProvider[] = [
  {
    id: 1,
    name: 'PIX Wallet',
    type: 'digital_wallet',
    api_url: 'https://api.pixwallet.com/v1',
    commission_rate: 2.5,
    supported_currencies: ['BRL', 'USD'],
    status: 'active',
    transaction_count: 1247,
    total_volume: 45600.50,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 2,
    name: 'Mobile Money',
    type: 'mobile_money',
    api_url: 'https://api.mobilemoney.com/v1',
    commission_rate: 3.0,
    supported_currencies: ['AOA', 'USD'],
    status: 'active',
    transaction_count: 892,
    total_volume: 23400.75,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    name: 'Bank Wallet',
    type: 'bank_wallet',
    api_url: 'https://api.bankwallet.com/v1',
    commission_rate: 1.8,
    supported_currencies: ['AOA', 'USD', 'EUR'],
    status: 'inactive',
    transaction_count: 445,
    total_volume: 15600.25,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 4,
    name: 'Crypto Wallet',
    type: 'crypto_wallet',
    api_url: 'https://api.cryptowallet.com/v1',
    commission_rate: 4.5,
    supported_currencies: ['BTC', 'ETH', 'USDT'],
    status: 'error',
    transaction_count: 156,
    total_volume: 8900.00,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  }
];

// Simulated transactions data
const SIMULATED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 1,
    user_id: 1,
    provider_id: 1,
    transaction_type: 'payment',
    amount: 150.00,
    currency: 'BRL',
    fees: 3.75,
    net_amount: 146.25,
    reference: 'PIX-2024-001',
    description: 'Water delivery payment',
    status: 'completed',
    provider_name: 'PIX Wallet',
    provider_type: 'digital_wallet',
    first_name: 'João',
    last_name: 'Silva',
    phone: '+244 923 456 789',
    email: 'joao.silva@email.com',
    created_at: '2024-01-20T14:30:00Z',
    processed_at: '2024-01-20T14:32:00Z'
  },
  {
    id: 2,
    user_id: 2,
    provider_id: 2,
    transaction_type: 'deposit',
    amount: 200.00,
    currency: 'AOA',
    fees: 6.00,
    net_amount: 194.00,
    reference: 'MM-2024-002',
    description: 'Wallet top-up',
    status: 'pending',
    provider_name: 'Mobile Money',
    provider_type: 'mobile_money',
    first_name: 'Maria',
    last_name: 'Santos',
    phone: '+244 934 567 890',
    email: 'maria.santos@email.com',
    created_at: '2024-01-20T14:25:00Z'
  },
  {
    id: 3,
    user_id: 3,
    provider_id: 3,
    transaction_type: 'withdrawal',
    amount: 75.50,
    currency: 'USD',
    fees: 1.36,
    net_amount: 74.14,
    reference: 'BW-2024-003',
    description: 'Commission withdrawal',
    status: 'completed',
    provider_name: 'Bank Wallet',
    provider_type: 'bank_wallet',
    first_name: 'Pedro',
    last_name: 'Costa',
    phone: '+244 945 678 901',
    email: 'pedro.costa@email.com',
    created_at: '2024-01-20T14:20:00Z',
    processed_at: '2024-01-20T14:22:00Z'
  },
  {
    id: 4,
    user_id: 4,
    provider_id: 1,
    transaction_type: 'transfer',
    amount: 300.00,
    currency: 'BRL',
    fees: 7.50,
    net_amount: 292.50,
    reference: 'PIX-2024-004',
    description: 'P2P transfer',
    status: 'failed',
    failure_reason: 'Insufficient funds',
    provider_name: 'PIX Wallet',
    provider_type: 'digital_wallet',
    first_name: 'Ana',
    last_name: 'Ferreira',
    phone: '+244 956 789 012',
    email: 'ana.ferreira@email.com',
    created_at: '2024-01-20T14:15:00Z'
  },
  {
    id: 5,
    user_id: 5,
    provider_id: 2,
    transaction_type: 'payment',
    amount: 85.25,
    currency: 'AOA',
    fees: 2.56,
    net_amount: 82.69,
    reference: 'MM-2024-005',
    description: 'Water bottle purchase',
    status: 'completed',
    provider_name: 'Mobile Money',
    provider_type: 'mobile_money',
    first_name: 'Carlos',
    last_name: 'Oliveira',
    phone: '+244 967 890 123',
    email: 'carlos.oliveira@email.com',
    created_at: '2024-01-20T14:10:00Z',
    processed_at: '2024-01-20T14:11:00Z'
  }
];

// Simulated statistics
const SIMULATED_STATS: WalletStats = {
  totalStats: {
    total_transactions: 2740,
    total_volume: 93500.75,
    total_fees: 2340.25,
    completed_transactions: 2450,
    pending_transactions: 200,
    failed_transactions: 90
  },
  transactionsByProvider: [
    {
      provider_name: 'PIX Wallet',
      provider_type: 'digital_wallet',
      transaction_count: 1247,
      total_volume: 45600.50,
      completed_count: 1150
    },
    {
      provider_name: 'Mobile Money',
      provider_type: 'mobile_money',
      transaction_count: 892,
      total_volume: 23400.75,
      completed_count: 820
    },
    {
      provider_name: 'Bank Wallet',
      provider_type: 'bank_wallet',
      transaction_count: 445,
      total_volume: 15600.25,
      completed_count: 380
    },
    {
      provider_name: 'Crypto Wallet',
      provider_type: 'crypto_wallet',
      transaction_count: 156,
      total_volume: 8900.00,
      completed_count: 100
    }
  ],
  transactionsByType: [
    {
      transaction_type: 'payment',
      count: 1500,
      total_amount: 45000.00
    },
    {
      transaction_type: 'deposit',
      count: 800,
      total_amount: 32000.00
    },
    {
      transaction_type: 'withdrawal',
      count: 300,
      total_amount: 12000.00
    },
    {
      transaction_type: 'transfer',
      count: 140,
      total_amount: 4500.75
    }
  ],
  recentTransactions: SIMULATED_TRANSACTIONS.slice(0, 10)
};

class WalletSimulationService {
  private providers: WalletProvider[] = [...SIMULATED_PROVIDERS];
  private transactions: WalletTransaction[] = [...SIMULATED_TRANSACTIONS];
  private stats: WalletStats = { ...SIMULATED_STATS };

  // Simulate API delay
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate random errors (5% chance)
  private async simulateRandomError(): Promise<void> {
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }
  }

  // Get all providers
  async getProviders(): Promise<WalletProvider[]> {
    await this.simulateDelay();
    await this.simulateRandomError();
    return this.providers;
  }

  // Get transactions with pagination and filtering
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    provider_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    transactions: WalletTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    await this.simulateDelay();
    await this.simulateRandomError();

    let filteredTransactions = [...this.transactions];

    // Apply filters
    if (params?.provider_id) {
      filteredTransactions = filteredTransactions.filter(t => t.provider_id === params.provider_id);
    }

    if (params?.status && params.status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === params.status);
    }

    if (params?.start_date) {
      const startDate = new Date(params.start_date);
      filteredTransactions = filteredTransactions.filter(t => new Date(t.created_at) >= startDate);
    }

    if (params?.end_date) {
      const endDate = new Date(params.end_date);
      filteredTransactions = filteredTransactions.filter(t => new Date(t.created_at) <= endDate);
    }

    // Sort by created_at descending
    filteredTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

    return {
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        pages: Math.ceil(filteredTransactions.length / limit)
      }
    };
  }

  // Get statistics
  async getStats(): Promise<WalletStats> {
    await this.simulateDelay();
    await this.simulateRandomError();
    return this.stats;
  }

  // Create a new transaction
  async createTransaction(transaction: {
    user_id: number;
    provider_id: number;
    transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
    amount: number;
    currency: string;
    reference?: string;
    description?: string;
  }): Promise<WalletTransaction> {
    await this.simulateDelay(1000); // Longer delay for transaction creation
    await this.simulateRandomError();

    const provider = this.providers.find(p => p.id === transaction.provider_id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const fees = (transaction.amount * provider.commission_rate) / 100;
    const netAmount = transaction.amount - fees;

    const newTransaction: WalletTransaction = {
      id: this.transactions.length + 1,
      user_id: transaction.user_id,
      provider_id: transaction.provider_id,
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      currency: transaction.currency,
      fees,
      net_amount: netAmount,
      reference: transaction.reference || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: transaction.description || '',
      status: 'pending',
      provider_name: provider.name,
      provider_type: provider.type,
      first_name: `User ${transaction.user_id}`,
      last_name: '',
      phone: `+244 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: `user${transaction.user_id}@email.com`,
      created_at: new Date().toISOString()
    };

    this.transactions.unshift(newTransaction);
    this.updateStats();

    return newTransaction;
  }

  // Process a transaction
  async processTransaction(id: number, status: 'completed' | 'failed' | 'cancelled'): Promise<WalletTransaction> {
    await this.simulateDelay(800);
    await this.simulateRandomError();

    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction is not pending');
    }

    transaction.status = status;
    transaction.processed_at = status === 'completed' ? new Date().toISOString() : undefined;

    if (status === 'failed') {
      transaction.failure_reason = 'Simulated failure';
    }

    this.updateStats();
    return transaction;
  }

  // Update provider status
  async updateProviderStatus(id: number, status: 'active' | 'inactive' | 'error'): Promise<WalletProvider> {
    await this.simulateDelay();
    await this.simulateRandomError();

    const provider = this.providers.find(p => p.id === id);
    if (!provider) {
      throw new Error('Provider not found');
    }

    provider.status = status;
    provider.updated_at = new Date().toISOString();

    return provider;
  }

  // Test provider connection
  async testProviderConnection(providerId: number): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay(2000); // Longer delay for connection test
    await this.simulateRandomError();

    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    // Simulate connection test
    const isConnected = Math.random() > 0.1; // 90% success rate

    if (isConnected) {
      return {
        success: true,
        message: `Successfully connected to ${provider.name}`
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to ${provider.name}. Please check your API credentials.`
      };
    }
  }

  // Sync provider transactions
  async syncProviderTransactions(providerId: number): Promise<{ success: boolean; message: string; synced_count: number }> {
    await this.simulateDelay(3000); // Longer delay for sync
    await this.simulateRandomError();

    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    // Simulate syncing transactions
    const syncedCount = Math.floor(Math.random() * 50) + 10; // 10-60 transactions

    return {
      success: true,
      message: `Successfully synced ${syncedCount} transactions from ${provider.name}`,
      synced_count: syncedCount
    };
  }

  // Update statistics
  private updateStats(): void {
    const totalTransactions = this.transactions.length;
    const totalVolume = this.transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = this.transactions.reduce((sum, t) => sum + t.fees, 0);
    const completedTransactions = this.transactions.filter(t => t.status === 'completed').length;
    const pendingTransactions = this.transactions.filter(t => t.status === 'pending').length;
    const failedTransactions = this.transactions.filter(t => t.status === 'failed').length;

    this.stats.totalStats = {
      total_transactions,
      total_volume,
      total_fees,
      completed_transactions: completedTransactions,
      pending_transactions: pendingTransactions,
      failed_transactions: failedTransactions
    };

    // Update provider stats
    this.stats.transactionsByProvider = this.providers.map(provider => {
      const providerTransactions = this.transactions.filter(t => t.provider_id === provider.id);
      return {
        provider_name: provider.name,
        provider_type: provider.type,
        transaction_count: providerTransactions.length,
        total_volume: providerTransactions.reduce((sum, t) => sum + t.amount, 0),
        completed_count: providerTransactions.filter(t => t.status === 'completed').length
      };
    });

    // Update transaction type stats
    const transactionTypes = ['payment', 'deposit', 'withdrawal', 'transfer'] as const;
    this.stats.transactionsByType = transactionTypes.map(type => {
      const typeTransactions = this.transactions.filter(t => t.transaction_type === type);
      return {
        transaction_type: type,
        count: typeTransactions.length,
        total_amount: typeTransactions.reduce((sum, t) => sum + t.amount, 0)
      };
    });

    this.stats.recentTransactions = this.transactions.slice(0, 10);
  }
}

// Export singleton instance
export const walletSimulationService = new WalletSimulationService();

// Re-export types for convenience
export type { WalletProvider, WalletTransaction, WalletStats } from './walletIntegration'; 