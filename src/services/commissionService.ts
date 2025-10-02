import { BaseService } from './baseService';

export interface Commission {
  id: string;
  user_id: string;
  store_id?: string;
  amount: number;
  commission_rate: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  description?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  approved_by?: string;
  approved_at?: string;
}

export interface CommissionStats {
  total_commissions: number;
  total_commission_amount: number;
  avg_commission_amount: number;
  pending_commissions: number;
  approved_commissions: number;
  rejected_commissions: number;
  paid_commissions: number;
  total_paid_commissions: number;
  total_pending_commissions: number;
  total_approved_commissions: number;
  commissions_today: number;
  commissions_week: number;
  commissions_month: number;
  commission_growth_percentage?: string;
  payout_growth_percentage?: string;
}

export interface CommissionSettings {
  base_commission_rate: number;
  cashback_rate: number;
  tier_multipliers: {
    lead: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  minimum_active_users: number;
  payout_threshold: number;
  payout_frequency: string;
  auto_approval: boolean;
  commission_cap: number;
}

export interface CommissionsResponse {
  success: boolean;
  data: Commission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class CommissionService extends BaseService {
  async getCommissions(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    user_id?: string;
    store_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<CommissionsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.store_id) searchParams.append('store_id', params.store_id);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/commissions${queryString ? `?${queryString}` : ''}`;

    return this.request<CommissionsResponse>(endpoint);
  }

  async getCommissionById(id: string): Promise<{ success: boolean; data: { commission: Commission } }> {
    return this.request<{ success: boolean; data: { commission: Commission } }>(`/commissions/${id}`);
  }

  async createCommission(commissionData: Partial<Commission>): Promise<{ success: boolean; data: { commission: Commission } }> {
    return this.request<{ success: boolean; data: { commission: Commission } }>('/commissions', {
      method: 'POST',
      body: JSON.stringify(commissionData),
    });
  }

  async updateCommission(id: string, commissionData: Partial<Commission>): Promise<{ success: boolean; data: { commission: Commission } }> {
    return this.request<{ success: boolean; data: { commission: Commission } }>(`/commissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commissionData),
    });
  }

  async deleteCommission(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/commissions/${id}`, {
      method: 'DELETE',
    });
  }

  async updateCommissionStatus(id: string, status: string): Promise<{ success: boolean; data: { commission: Commission } }> {
    return this.request<{ success: boolean; data: { commission: Commission } }>(`/commissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getCommissionStats(): Promise<{ success: boolean; data: CommissionStats }> {
    return this.request<{ success: boolean; data: CommissionStats }>('/commissions/stats/overview');
  }

  async getCommissionsByUser(userId: string, limit: number = 10): Promise<{ success: boolean; data: Commission[] }> {
    return this.request<{ success: boolean; data: Commission[] }>(`/commissions/user/${userId}?limit=${limit}`);
  }

  async getCommissionsByStore(storeId: string, limit: number = 10): Promise<{ success: boolean; data: Commission[] }> {
    return this.request<{ success: boolean; data: Commission[] }>(`/commissions/store/${storeId}?limit=${limit}`);
  }

  async calculateCommission(saleId: string, commissionRate: number): Promise<{ success: boolean; data: Commission }> {
    return this.request<{ success: boolean; data: Commission }>('/commissions/calculate', {
      method: 'POST',
      body: JSON.stringify({ sale_id: saleId, commission_rate: commissionRate }),
    });
  }

  async bulkApproveCommissions(commissionIds: string[]): Promise<{ success: boolean; message: string; data: any }> {
    return this.request<{ success: boolean; message: string; data: any }>('/commissions/bulk-approve', {
      method: 'POST',
      body: JSON.stringify({ commission_ids: commissionIds }),
    });
  }

  async getPendingCommissionsTotal(): Promise<{ success: boolean; data: { total: number } }> {
    return this.request<{ success: boolean; data: { total: number } }>('/commissions/pending/total');
  }

  async getInfluencerPerformance(): Promise<{ success: boolean; data: any[] }> {
    // Use the dedicated influencer performance endpoint
    return this.request<{ success: boolean; data: any[] }>('/users/influencer-performance');
  }

  async getCommissionSettings(): Promise<{ success: boolean; data: CommissionSettings }> {
    return this.request<{ success: boolean; data: CommissionSettings }>('/commission-settings');
  }

  async saveCommissionSettings(settings: Partial<CommissionSettings>): Promise<{ success: boolean; data: CommissionSettings; message: string }> {
    return this.request<{ success: boolean; data: CommissionSettings; message: string }>('/commission-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getCommissionSettingsHistory(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data: CommissionSettings[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/commission-settings/history${queryString ? `?${queryString}` : ''}`;

    return this.request<{ success: boolean; data: CommissionSettings[]; pagination: any }>(endpoint);
  }

  async calculateCommissionWithSettings(tier: string, salesAmount: number): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/commission-settings/calculate', {
      method: 'POST',
      body: JSON.stringify({ tier, sales_amount: salesAmount }),
    });
  }

  // Commission Rules methods
  async getCommissionRules(): Promise<{ success: boolean; data: any[] }> {
    return this.request<{ success: boolean; data: any[] }>('/commission-rules');
  }

  async createCommissionRule(ruleData: any): Promise<{ success: boolean; data: any; message: string }> {
    return this.request<{ success: boolean; data: any; message: string }>('/commission-rules', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  async updateCommissionRule(id: string, ruleData: any): Promise<{ success: boolean; data: any; message: string }> {
    return this.request<{ success: boolean; data: any; message: string }>(`/commission-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData),
    });
  }

  async deleteCommissionRule(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/commission-rules/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleCommissionRuleStatus(id: string, isActive: boolean): Promise<{ success: boolean; data: any; message: string }> {
    return this.request<{ success: boolean; data: any; message: string }>(`/commission-rules/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async calculateCommissionWithRules(conditions: {
    salesAmount: number;
    userTier?: string;
    networkSize?: number;
    growthRate?: number;
  }): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/commission-rules/calculate', {
      method: 'POST',
      body: JSON.stringify(conditions),
    });
  }
}

export const commissionService = new CommissionService();