import { BaseService } from './baseService';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface WalletTransactionsResponse {
  success: boolean;
  data: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class WalletService extends BaseService {
  async getWallet(userId: string): Promise<{ success: boolean; data: { wallet: Wallet } }> {
    return this.request<{ success: boolean; data: { wallet: Wallet } }>(`/wallets/${userId}`);
  }

  async getWalletTransactions(userId: string, params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  } = {}): Promise<WalletTransactionsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/wallets/${userId}/transactions${queryString ? `?${queryString}` : ''}`;

    return this.request<WalletTransactionsResponse>(endpoint);
  }

  async getWalletBalance(userId: string): Promise<{ success: boolean; data: { balance: number; currency: string } }> {
    return this.request<{ success: boolean; data: { balance: number; currency: string } }>(`/wallets/${userId}/balance`);
  }
}

export const walletService = new WalletService();