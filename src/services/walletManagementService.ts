export interface UserWallet {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  wallet: {
    wallet_number: string;
    wallet_provider: 'mobile_money' | 'bank_transfer' | 'crypto' | 'digital_wallet';
    wallet_verified: boolean;
    wallet_verification_date?: string;
    wallet_balance: number;
  };
}

export interface AdminWalletConfig {
  wallet_number: string;
  wallet_provider: 'mobile_money' | 'bank_transfer' | 'crypto' | 'digital_wallet';
  wallet_verified: boolean;
  wallet_balance: number;
  api_key: string;
  api_secret: string;
  webhook_url: string;
  min_transfer_amount: number;
  max_transfer_amount: number;
  transfer_enabled: boolean;
}

export interface WalletTransaction {
  id: string;
  transaction_id: string;
  sender_user_id?: string;
  recipient_user_id: string;
  amount: number;
  fees: number;
  net_amount: number;
  currency: string;
  transaction_type: 'commission_transfer' | 'manual_transfer' | 'refund' | 'bonus';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  provider: {
    wallet_provider: string;
    api_provider: string;
  };
  recipient_wallet: {
    wallet_number: string;
    wallet_provider: string;
  };
  external_transaction_id?: string;
  transaction_reference?: string;
  failure_reason?: string;
  retry_count: number;
  completed_at?: string;
  failed_at?: string;
  cancelled_at?: string;
  metadata: {
    source_transaction_id?: string;
    commission_amount?: number;
    original_commission_id?: string;
    notes?: string;
    admin_notes?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface WalletStats {
  total_transactions: number;
  total_amount: number;
  total_fees: number;
  completed_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  total_completed_amount: number;
  average_transaction_amount: number;
}

export interface UpdateUserWalletRequest {
  wallet_number?: string;
  wallet_provider?: 'mobile_money' | 'bank_transfer' | 'crypto' | 'digital_wallet';
}

export interface UpdateAdminWalletRequest {
  wallet_number?: string;
  wallet_provider?: 'mobile_money' | 'bank_transfer' | 'crypto' | 'digital_wallet';
  api_key?: string;
  api_secret?: string;
  webhook_url?: string;
  min_transfer_amount?: number;
  max_transfer_amount?: number;
  transfer_enabled?: boolean;
}

class WalletManagementService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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

  // User Wallet Management
  async updateUserWallet(userId: string, walletData: UpdateUserWalletRequest): Promise<{ success: boolean; message: string; data: any }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/user/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(walletData),
    });

    return this.handleResponse(response);
  }

  async verifyUserWallet(userId: string, verified: boolean): Promise<{ success: boolean; message: string; data: any }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/user/${userId}/verify`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ verified }),
    });

    return this.handleResponse(response);
  }

  // Admin Wallet Management
  async getAdminWalletConfig(): Promise<{
    success: boolean;
    data: {
      admin_wallet: AdminWalletConfig;
      is_ready: boolean;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/admin/config`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateAdminWalletConfig(walletData: UpdateAdminWalletRequest): Promise<{
    success: boolean;
    message: string;
    data: {
      admin_wallet: AdminWalletConfig;
      is_ready: boolean;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/admin/config`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(walletData),
    });

    return this.handleResponse(response);
  }

  async verifyAdminWallet(verified: boolean): Promise<{
    success: boolean;
    message: string;
    data: {
      admin_wallet: AdminWalletConfig;
      is_ready: boolean;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/admin/verify`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ verified }),
    });

    return this.handleResponse(response);
  }

  // Transaction Management
  async getWalletTransactions(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: {
      stats: WalletStats;
      transactions_requiring_attention: WalletTransaction[];
      pagination: {
        page: number;
        limit: number;
      };
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/wallet-management/transactions?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async retryFailedTransactions(): Promise<{
    success: boolean;
    message: string;
    data: {
      retried: number;
      successful: number;
      failed: number;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/retry-failed`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // User Management
  async getUsersWithVerifiedWallets(): Promise<{
    success: boolean;
    data: {
      users: UserWallet[];
      count: number;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/wallet-management/users/verified`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Utility Methods
  formatCurrency(amount: number, currency: string = 'AOA'): string {
    return new Intl.NumberFormat('pt-AO', {
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

  getWalletProviderDisplayName(provider: string): string {
    const providerNames = {
      mobile_money: 'Mobile Money',
      bank_transfer: 'Bank Transfer',
      crypto: 'Cryptocurrency',
      digital_wallet: 'Digital Wallet'
    };
    return providerNames[provider as keyof typeof providerNames] || provider;
  }

  getWalletProviderIcon(provider: string): string {
    const icons = {
      mobile_money: 'smartphone',
      bank_transfer: 'credit-card',
      crypto: 'globe',
      digital_wallet: 'wallet'
    };
    return icons[provider as keyof typeof icons] || 'wallet';
  }

  getTransactionStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTransactionTypeDisplayName(type: string): string {
    const typeNames = {
      commission_transfer: 'Commission Transfer',
      manual_transfer: 'Manual Transfer',
      refund: 'Refund',
      bonus: 'Bonus'
    };
    return typeNames[type as keyof typeof typeNames] || type;
  }

  validateWalletNumber(walletNumber: string, provider: string): boolean {
    const validations = {
      mobile_money: /^(\+244|244)?[0-9]{9}$/,
      bank_transfer: /^[0-9]{10,20}$/,
      crypto: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      digital_wallet: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };

    const pattern = validations[provider as keyof typeof validations];
    return pattern ? pattern.test(walletNumber) : false;
  }

  getWalletValidationMessage(provider: string): string {
    const messages = {
      mobile_money: 'Mobile money number must be 9 digits (Angola format)',
      bank_transfer: 'Bank account number must be 10-20 digits',
      crypto: 'Invalid Bitcoin address format',
      digital_wallet: 'Digital wallet must be a valid email format'
    };
    return messages[provider as keyof typeof messages] || 'Invalid wallet number format';
  }
}

export const walletManagementService = new WalletManagementService();
