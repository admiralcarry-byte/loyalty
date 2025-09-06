import { BaseService } from './baseService';

export interface BankDetails {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  masked_account_number: string;
  account_type: string;
  bank_code: string;
  branch_code: string;
  account_holder_name: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_date?: string;
  verified_by?: string;
  rejection_reason?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export interface BankDetailsStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
}

export interface BankDetailsResponse {
  success: boolean;
  data: BankDetails[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BankDetailsStatsResponse {
  success: boolean;
  data: BankDetailsStats;
}

class BankDetailsService extends BaseService {
  async getBankDetails(params: {
    page?: number;
    limit?: number;
    search?: string;
    bankFilter?: string;
    statusFilter?: string;
  } = {}): Promise<BankDetailsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.bankFilter) queryParams.append('bankFilter', params.bankFilter);
    if (params.statusFilter) queryParams.append('statusFilter', params.statusFilter);

    return this.request<BankDetailsResponse>(`/bank-details?${queryParams.toString()}`);
  }

  async getBankDetailsStats(): Promise<BankDetailsStatsResponse> {
    return this.request<BankDetailsStatsResponse>('/bank-details/stats');
  }

  async getBankDetailsById(id: string): Promise<{ success: boolean; data: BankDetails }> {
    return this.request<{ success: boolean; data: BankDetails }>(`/bank-details/${id}`);
  }

  async createBankDetails(bankData: Partial<BankDetails>): Promise<{ success: boolean; data: BankDetails }> {
    return this.request<{ success: boolean; data: BankDetails }>('/bank-details', {
      method: 'POST',
      body: JSON.stringify(bankData),
    });
  }

  async updateBankDetails(id: string, bankData: Partial<BankDetails>): Promise<{ success: boolean; data: BankDetails }> {
    return this.request<{ success: boolean; data: BankDetails }>(`/bank-details/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bankData),
    });
  }

  async verifyBankDetails(id: string, status: 'verified' | 'rejected', rejectionReason?: string): Promise<{ success: boolean; data: BankDetails }> {
    return this.request<{ success: boolean; data: BankDetails }>(`/bank-details/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status, rejection_reason: rejectionReason }),
    });
  }

  async deactivateBankDetails(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/bank-details/${id}`, {
      method: 'DELETE',
    });
  }
}

export const bankDetailsService = new BankDetailsService();