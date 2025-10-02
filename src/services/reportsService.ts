import { BaseService } from './baseService';

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface MonthlyStats {
  month: string;
  users: number;
  sales: number;
  revenue: number;
  cashback: number;
}

export interface TierDistribution {
  tier: string;
  count: number;
  percentage: number;
}

export interface TopInfluencer {
  name: string;
  referrals: number;
  commission: number;
  tier: string;
}

export interface ReportsResponse {
  success: boolean;
  data: any;
}

class ReportsService extends BaseService {
  async getSalesReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
    store_id?: string;
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);
    if (params.store_id) searchParams.append('store_id', params.store_id);

    const queryString = searchParams.toString();
    const endpoint = `/reports/sales${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getUserReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/users${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getRevenueReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/revenue${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getLoyaltyReport(params: {
    start_date?: string;
    end_date?: string;
    _t?: number;
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params._t) searchParams.append('_t', params._t.toString());

    const queryString = searchParams.toString();
    const endpoint = `/reports/loyalty${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getInfluencerReport(params: {
    start_date?: string;
    end_date?: string;
    _t?: number;
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params._t) searchParams.append('_t', params._t.toString());

    const queryString = searchParams.toString();
    const endpoint = `/reports/influencers${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getOverviewReport(params: { _t?: number } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    if (params._t) searchParams.append('_t', params._t.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/reports/overview${queryString ? `?${queryString}` : ''}`;
    return this.request<ReportsResponse>(endpoint);
  }

  async getProductsReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/products${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getStoresReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/stores${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getCampaignsReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/campaigns${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getAuditReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/audit${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async getComprehensiveReport(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<ReportsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/reports/comprehensive${queryString ? `?${queryString}` : ''}`;

    return this.request<ReportsResponse>(endpoint);
  }

  async exportReport(type: string, format: 'pdf' | 'excel' | 'csv', params: any = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append('format', format);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    const queryString = searchParams.toString();
    const endpoint = `/reports/${type}/export${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
}

export const reportsService = new ReportsService();