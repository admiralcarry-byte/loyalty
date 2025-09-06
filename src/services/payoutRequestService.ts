import { BaseService } from './baseService';

export interface PayoutRequest {
  _id: string;
  request_number: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  bank_details: {
    account_name: string;
    account_number: string;
    bank_name: string;
    branch_code?: string;
    bic?: string;
  };
  commission_breakdown: {
    total_commission_earned: number;
    previously_paid: number;
    pending_payout: number;
  };
  approval: {
    requested_by?: string;
    requested_date: string;
    approved_by?: string;
    approved_date?: string;
    rejected_by?: string;
    rejected_date?: string;
    rejection_reason?: string;
    notes?: string;
  };
  payment?: {
    payment_method: string;
    payment_reference?: string;
    payment_date?: string;
    transaction_id?: string;
    processed_by?: string;
  };
  related_commissions?: string[];
  metadata: {
    source: string;
    period_start?: string;
    period_end?: string;
    commission_type: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  formatted_amount?: string;
  days_pending?: number;
}

export interface PayoutRequestStats {
  total_requests: number;
  total_amount: number;
  pending_requests: number;
  approved_requests: number;
  paid_requests: number;
  rejected_requests: number;
  pending_amount: number;
  approved_amount: number;
  paid_amount: number;
  rejected_amount: number;
  average_amount: number;
  requests_today: number;
  requests_week: number;
  requests_month: number;
  amount_today: number;
  amount_week: number;
  amount_month: number;
}

export interface PayoutRequestsResponse {
  success: boolean;
  data: PayoutRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class PayoutRequestService extends BaseService {
  async getPayoutRequests(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    user_id?: string;
    start_date?: string;
    end_date?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<PayoutRequestsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = `/payout-requests${queryString ? `?${queryString}` : ''}`;

    return this.request<PayoutRequestsResponse>(endpoint);
  }

  async getPayoutRequestById(id: string): Promise<{ success: boolean; data: { payoutRequest: PayoutRequest } }> {
    return this.request<{ success: boolean; data: { payoutRequest: PayoutRequest } }>(`/payout-requests/${id}`);
  }

  async createPayoutRequest(payoutRequestData: Partial<PayoutRequest>): Promise<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }> {
    return this.request<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }>('/payout-requests', {
      method: 'POST',
      body: JSON.stringify(payoutRequestData),
    });
  }

  async approvePayoutRequest(id: string, notes?: string): Promise<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }> {
    return this.request<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }>(`/payout-requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectPayoutRequest(id: string, reason?: string): Promise<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }> {
    return this.request<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }>(`/payout-requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async markAsPaid(id: string, paymentDetails: {
    payment_method: string;
    payment_reference?: string;
    transaction_id?: string;
  }): Promise<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }> {
    return this.request<{ success: boolean; data: { payoutRequest: PayoutRequest }; message: string }>(`/payout-requests/${id}/mark-paid`, {
      method: 'PUT',
      body: JSON.stringify({ payment_details: paymentDetails }),
    });
  }

  async getPayoutStats(): Promise<{ success: boolean; data: PayoutRequestStats }> {
    return this.request<{ success: boolean; data: PayoutRequestStats }>('/payout-requests/stats/overview');
  }

  async getPendingPayoutRequests(): Promise<{ success: boolean; data: PayoutRequest[] }> {
    return this.request<{ success: boolean; data: PayoutRequest[] }>('/payout-requests/pending/list');
  }

  async getPayoutRequestsByUser(userId: string, limit: number = 10): Promise<{ success: boolean; data: PayoutRequest[] }> {
    return this.request<{ success: boolean; data: PayoutRequest[] }>(`/payout-requests/user/${userId}?limit=${limit}`);
  }
}

export const payoutRequestService = new PayoutRequestService();