import { BaseService } from './baseService';

export interface CashbackStats {
  total_cashback_transactions: number;
  total_cashback_amount: number;
  avg_cashback_amount: number;
  pending_cashback: number;
  approved_cashback: number;
  paid_cashback: number;
  rejected_cashback: number;
  total_paid_cashback: number;
  total_pending_cashback: number;
  total_approved_cashback: number;
  cashback_today: number;
  cashback_week: number;
  cashback_month: number;
  total_users?: number;
  avg_growth_rate?: number;
  base_cashback_rate?: number;
}

export interface CashbackTransaction {
  _id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  reference_type?: string;
  reference_id?: number;
  description?: string;
  created_at: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
}

export interface CashbackTopEarner {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  total_cashback: number;
  transaction_count: number;
}

class CashbackService extends BaseService {


  async getCashbackTransactions(params?: {
    page?: number;
    limit?: number;
    user_id?: string;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ success: boolean; data: { transactions: CashbackTransaction[]; pagination: any } }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cashback?${queryString}` : '/cashback';
    
    return this.request<{ success: boolean; data: { transactions: CashbackTransaction[]; pagination: any } }>(endpoint);
  }


  async getCashbackTransaction(id: string): Promise<{ success: boolean; data: { transaction: CashbackTransaction } }> {
    return this.request<{ success: boolean; data: { transaction: CashbackTransaction } }>(`/cashback/${id}`);
  }

  async createCashbackTransaction(data: {
    user_id: string;
    amount: number;
    type: string;
    status?: string;
    reference_type?: string;
    reference_id?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { transaction: CashbackTransaction } }> {
    return this.request<{ success: boolean; message: string; data: { transaction: CashbackTransaction } }>('/cashback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCashbackTransaction(id: string, data: {
    status?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { transaction: CashbackTransaction } }> {
    return this.request<{ success: boolean; message: string; data: { transaction: CashbackTransaction } }>(`/cashback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }



  async deleteCashbackTransaction(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/cashback/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserCashbackTransactions(userId: string, limit: number = 50): Promise<{ success: boolean; data: { transactions: CashbackTransaction[]; user: any } }> {
    return this.request<{ success: boolean; data: { transactions: CashbackTransaction[]; user: any } }>(`/cashback/user/${userId}?limit=${limit}`);
  }

  async getCashbackStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/cashback/stats/overview');
  }

  async getTopEarners(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/cashback/top-earners');
  }
}

export const cashbackService = new CashbackService();