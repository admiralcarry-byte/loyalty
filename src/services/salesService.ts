import { BaseService } from './baseService';

export interface Sale {
  id: string;
  customer: string;
  customerPhone: string;
  liters: number;
  amount: number;
  cashback: number;
  date: string;
  time: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  location: string;
  influencer?: string;
  commission?: number;
}

export interface SalesResponse {
  success: boolean;
  data: Sale[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SalesStats {
  total_sales: number;
  completed_sales: number;
  pending_sales: number;
  cancelled_sales: number;
  refunded_sales: number;
  total_revenue: number;
  total_liters_sold: number;
  total_points_earned: number;
  total_cashback_earned: number;
  average_sale_amount: number;
  average_liters_per_sale: number;
  revenue_growth_percentage?: string;
  liters_growth_percentage?: string;
  cashback_growth_percentage?: string;
  commission_growth_percentage?: string;
}

class SalesService extends BaseService {
  async getSales(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<SalesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);

    const queryString = searchParams.toString();
    const endpoint = `/sales${queryString ? `?${queryString}` : ''}`;

    return this.request<SalesResponse>(endpoint);
  }

  async getSaleById(id: string): Promise<{ success: boolean; data: { sale: Sale } }> {
    return this.request<{ success: boolean; data: { sale: Sale } }>(`/sales/${id}`);
  }

  async createSale(saleData: Partial<Sale>): Promise<{ success: boolean; data: { sale: Sale } }> {
    return this.request<{ success: boolean; data: { sale: Sale } }>('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async updateSale(id: string, saleData: Partial<Sale>): Promise<{ success: boolean; data: { sale: Sale } }> {
    return this.request<{ success: boolean; data: { sale: Sale } }>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(saleData),
    });
  }

  async deleteSale(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  async updateSaleStatus(id: string, status: string): Promise<{ success: boolean; data: { sale: Sale } }> {
    return this.request<{ success: boolean; data: { sale: Sale } }>(`/sales/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getSalesStats(): Promise<{ success: boolean; data: SalesStats }> {
    return this.request<{ success: boolean; data: SalesStats }>('/sales/stats/overview');
  }

  async getAllSalesStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/sales/stats');
  }

  async getSalesByUser(userId: string): Promise<{ success: boolean; data: Sale[] }> {
    return this.request<{ success: boolean; data: Sale[] }>(`/sales/user/${userId}`);
  }

  async getSalesByStore(storeId: string): Promise<{ success: boolean; data: Sale[] }> {
    return this.request<{ success: boolean; data: Sale[] }>(`/sales/store/${storeId}`);
  }

  async getTopSellingProducts(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/sales/top-selling-products');
  }
}

export const salesService = new SalesService();