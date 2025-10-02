import { BaseService } from './baseService';

export interface Purchase {
  _id: string;
  sale_number?: string;
  transaction_id?: string;
  quantity: number;
  total_amount: number;
  liters_purchased?: number;
  cashback_earned: number;
  payment_method: string;
  status: string;
  order_status?: string;
  purchaser_name?: string;
  store_id?: {
    _id: string;
    name: string;
    address: string;
  };
  product_id?: {
    _id: string;
    name: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface PurchaseSummary {
  totalPurchases: number;
  totalAmount: number;
  totalLiters: number;
  totalCashback: number;
}

export interface MyPurchasesResponse {
  success: boolean;
  data: {
    purchases: Purchase[];
    summary: PurchaseSummary;
  };
}

export interface SalesListResponse {
  success: boolean;
  data: Purchase[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class SalesService extends BaseService {
  /**
   * Get current user's purchase history (Customer Portal)
   */
  async getMyPurchases(limit: number = 50): Promise<MyPurchasesResponse> {
    try {
      return await this.request<MyPurchasesResponse>(`/sales/my-purchases?limit=${limit}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  }

  /**
   * Get all sales with pagination (Admin/Manager)
   */
  async getSales(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SalesListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('start_date', params.startDate);
      if (params?.endDate) queryParams.append('end_date', params.endDate);

      const queryString = queryParams.toString();
      return await this.request<SalesListResponse>(`/sales${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  /**
   * Get purchase by ID
   */
  async getPurchaseById(id: string): Promise<{ success: boolean; data: { sale: Purchase } }> {
    try {
      return await this.request<{ success: boolean; data: { sale: Purchase } }>(`/sales/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error fetching purchase:', error);
      throw error;
    }
  }

  /**
   * Create a new sale (Admin/Manager)
   */
  async createSale(saleData: any): Promise<{ success: boolean; data: { sale: Purchase } }> {
    try {
      return await this.request<{ success: boolean; data: { sale: Purchase } }>('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  /**
   * Update a sale (Admin/Manager)
   */
  async updateSale(id: string, saleData: any): Promise<{ success: boolean; data: { sale: Purchase } }> {
    try {
      return await this.request<{ success: boolean; data: { sale: Purchase } }>(`/sales/${id}`, {
        method: 'PUT',
        body: JSON.stringify(saleData),
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }

  /**
   * Delete a sale (Admin/Manager)
   */
  async deleteSale(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request<{ success: boolean; message: string }>(`/sales/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  }
}

export const salesService = new SalesService();
