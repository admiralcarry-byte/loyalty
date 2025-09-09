export interface WalletProvider {
  id: number;
  name: string;
  type: 'digital_wallet' | 'mobile_money' | 'bank_wallet' | 'crypto_wallet';
  api_url?: string;
  commission_rate: number;
  supported_currencies: string[];
  status: 'active' | 'inactive' | 'error';
  transaction_count?: number;
  total_volume?: number;
  total_fees?: number;
  completed_transactions?: number;
  pending_transactions?: number;
  failed_transactions?: number;
  cancelled_transactions?: number;
  average_transaction_amount?: number;
  unique_users?: number;
  last_transaction_date?: string;
  first_transaction_date?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  user_id: number;
  provider_id: number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  fees: number;
  net_amount: number;
  reference: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  failure_reason?: string;
  // Joined data from providers
  provider_name?: string;
  provider_type?: string;
  provider_commission_rate?: number;
  provider_status?: string;
  // Joined data from users
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  username?: string;
  user_role?: string;
  user_status?: string;
  user_wallet_balance?: number;
  user_loyalty_tier?: string;
  user_points_balance?: number;
  user_liter_balance?: number;
  user_total_purchases?: number;
  user_total_liters?: number;
  // Joined data from audit logs
  audit_action?: string;
  audit_details?: any;
  audit_ip_address?: string;
  audit_user_agent?: string;
  audit_created_at?: string;
  created_at: string;
  processed_at?: string;
}

export interface WalletAuditLog {
  id: number;
  user_id?: number;
  provider_id?: number;
  transaction_id?: number;
  action: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joined data
  audit_user_username?: string;
  audit_user_first_name?: string;
  audit_user_last_name?: string;
  provider_name?: string;
  transaction_reference?: string;
}

export interface WalletStats {
  totalStats: {
    total_transactions: number;
    total_volume: number;
    total_fees: number;
    completed_transactions: number;
    pending_transactions: number;
    failed_transactions: number;
    cancelled_transactions?: number;
    unique_users?: number;
    active_providers?: number;
    average_transaction_amount?: number;
    highest_transaction_amount?: number;
    lowest_transaction_amount?: number;
    success_rate?: number;
    transactions_growth_percentage?: string;
    balance_growth_percentage?: string;
    fees_growth_percentage?: string;
    new_providers_this_month?: number;
  };
  transactionsByProvider: Array<{
    provider_id: number;
    provider_name: string;
    provider_type: string;
    provider_status: string;
    commission_rate: number;
    transaction_count: number;
    total_volume: number;
    total_fees: number;
    completed_count: number;
    pending_count: number;
    failed_count: number;
    unique_users: number;
    average_transaction_amount: number;
    last_transaction_date?: string;
    first_transaction_date?: string;
  }>;
  transactionsByType: Array<{
    transaction_type: string;
    count: number;
    total_amount: number;
    total_fees: number;
    completed_count: number;
    pending_count: number;
    failed_count: number;
    unique_users: number;
    providers_used: number;
    average_amount: number;
  }>;
  userStatsByTier?: Array<{
    loyalty_tier: string;
    user_count: number;
    transaction_count: number;
    total_volume: number;
    average_transaction_amount: number;
    completed_transactions: number;
  }>;
  currencyStats?: Array<{
    currency: string;
    transaction_count: number;
    total_volume: number;
    total_fees: number;
    completed_count: number;
    unique_users: number;
    providers_used: number;
  }>;
  dailyTrends?: Array<{
    date: string;
    transaction_count: number;
    daily_volume: number;
    completed_count: number;
    failed_count: number;
  }>;
  recentTransactions: WalletTransaction[];
}

export interface CreateProviderRequest {
  name: string;
  type: 'digital_wallet' | 'mobile_money' | 'bank_wallet' | 'crypto_wallet';
  api_url?: string;
  api_key?: string;
  webhook_secret?: string;
  commission_rate: number;
  supported_currencies: string[];
  status: 'active' | 'inactive';
}

export interface CreateTransactionRequest {
  user_id: number;
  provider_id: number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  currency: string;
  reference?: string;
  description?: string;
}

export interface ProcessTransactionRequest {
  status: 'completed' | 'failed' | 'cancelled';
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  provider_id?: string;
  user_id?: string;
  status?: string;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: string;
  max_amount?: string;
  currency?: string;
}

export interface TransactionResponse {
  transactions: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary: {
    total_transactions: number;
    total_volume: number;
    total_fees: number;
    average_amount: number;
    completed_count: number;
    pending_count: number;
    failed_count: number;
    cancelled_count: number;
  };
}

export interface UserWalletStats {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    wallet_balance: number;
    loyalty_tier: string;
    total_transactions: number;
    total_volume: number;
    total_fees: number;
    completed_transactions: number;
    pending_transactions: number;
    failed_transactions: number;
    providers_used: number;
    average_transaction_amount: number;
    last_transaction_date?: string;
    first_transaction_date?: string;
  };
  transactions: WalletTransaction[];
  userTransactionStats: Array<{
    transaction_type: string;
    count: number;
    total_amount: number;
    average_amount: number;
    total_fees: number;
  }>;
  userProviderStats: Array<{
    provider_name: string;
    provider_type: string;
    transaction_count: number;
    total_amount: number;
    average_amount: number;
  }>;
}

class WalletIntegrationService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://loyalty-backend-production-8e32.up.railway.app/api';
    this.token = localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Wallet Providers with comprehensive statistics
  async getProviders(): Promise<WalletProvider[]> {
    const response = await fetch(`${this.baseUrl}/wallets/providers`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletProvider[] }>(response);
    return result.data;
  }

  async getProviderDetails(providerId: number): Promise<{
    provider: WalletProvider;
    recentTransactions: WalletTransaction[];
    transactionStats: any[];
    userStats: any;
  }> {
    const response = await fetch(`${this.baseUrl}/wallets/providers/${providerId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: any }>(response);
    return result.data;
  }

  async createProvider(provider: CreateProviderRequest): Promise<WalletProvider> {
    const response = await fetch(`${this.baseUrl}/wallets/providers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(provider),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletProvider }>(response);
    return result.data;
  }

  async updateProvider(id: number, provider: Partial<CreateProviderRequest>): Promise<WalletProvider> {
    const response = await fetch(`${this.baseUrl}/wallets/providers/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(provider),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletProvider }>(response);
    return result.data;
  }

  async deleteProvider(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/wallets/providers/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse(response);
  }

  // Wallet Transactions with comprehensive joins
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionResponse> {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/wallets/transactions?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{
      success: boolean;
      data: TransactionResponse;
    }>(response);

    return result.data;
  }

  async getTransactionDetails(transactionId: number): Promise<{
    transaction: WalletTransaction;
    auditLogs: WalletAuditLog[];
    relatedTransactions: WalletTransaction[];
  }> {
    const response = await fetch(`${this.baseUrl}/wallets/transactions/${transactionId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: any }>(response);
    return result.data;
  }

  async createTransaction(transaction: CreateTransactionRequest): Promise<WalletTransaction> {
    const response = await fetch(`${this.baseUrl}/wallets/transactions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletTransaction }>(response);
    return result.data;
  }

  async processTransaction(id: number, processData: ProcessTransactionRequest): Promise<WalletTransaction> {
    const response = await fetch(`${this.baseUrl}/wallets/transactions/${id}/process`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(processData),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletTransaction }>(response);
    return result.data;
  }

  // Comprehensive wallet statistics
  async getStats(): Promise<WalletStats> {
    const response = await fetch(`${this.baseUrl}/wallets/stats/overview`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: WalletStats }>(response);
    return result.data;
  }

  // User wallet statistics
  async getUserWalletStats(userId: number, pagination?: { page?: number; limit?: number }): Promise<UserWalletStats> {
    const searchParams = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/wallets/users/${userId}?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: UserWalletStats }>(response);
    return result.data;
  }

  // Test Provider Connection
  async testProviderConnection(providerId: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/wallets/providers/${providerId}/test`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; message: string }>(response);
    return result;
  }

  // Sync Provider Transactions
  async syncProviderTransactions(providerId: number): Promise<{ success: boolean; message: string; synced_count: number }> {
    const response = await fetch(`${this.baseUrl}/wallets/providers/${providerId}/sync`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{
      success: boolean;
      message: string;
      synced_count: number;
    }>(response);

    return result;
  }

  // Get User Wallet Balance
  async getUserWalletBalance(userId: number): Promise<{ balance: number; currency: string }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/wallet-balance`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{ success: boolean; data: { balance: number; currency: string } }>(response);
    return result.data;
  }

  // Get User Transaction History
  async getUserTransactionHistory(userId: number, params?: {
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<TransactionResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/wallet-transactions?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<{
      success: boolean;
      data: TransactionResponse;
    }>(response);

    return result.data;
  }

  // Utility Methods
  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTransactionStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getProviderStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTransactionTypeIcon(type: string): string {
    switch (type) {
      case 'deposit':
        return 'arrow-up-right';
      case 'withdrawal':
        return 'arrow-down-right';
      case 'transfer':
        return 'arrow-left-right';
      case 'payment':
        return 'credit-card';
      default:
        return 'dollar-sign';
    }
  }

  getProviderTypeIcon(type: string): string {
    switch (type) {
      case 'digital_wallet':
        return 'smartphone';
      case 'mobile_money':
        return 'smartphone';
      case 'bank_wallet':
        return 'credit-card';
      case 'crypto_wallet':
        return 'globe';
      default:
        return 'wallet';
    }
  }

  // Helper method to get customer full name
  getCustomerName(transaction: WalletTransaction): string {
    const firstName = transaction.first_name || '';
    const lastName = transaction.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || transaction.username || `User ${transaction.user_id}`;
  }

  // Helper method to get provider display name
  getProviderDisplayName(transaction: WalletTransaction): string {
    return transaction.provider_name || `Provider ${transaction.provider_id}`;
  }

  // Helper method to get transaction summary
  getTransactionSummary(transaction: WalletTransaction): string {
    const customerName = this.getCustomerName(transaction);
    const providerName = this.getProviderDisplayName(transaction);
    const amount = this.formatCurrency(transaction.amount, transaction.currency);
    
    return `${customerName} - ${transaction.transaction_type} ${amount} via ${providerName}`;
  }
}

// Export singleton instance
export const walletIntegrationService = new WalletIntegrationService(); 