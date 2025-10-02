import { BaseService } from './baseService';

export interface BuyerData {
  name: string;
  phone: string;
  liters: number;
  amount: number;
  commission: number;
  date: string;
}

export interface ChartData {
  unitsSold: number;
  totalAmount: number;
  totalPurchases: number;
  numberOfPurchases: number;
}

export interface SellerDashboardStats {
  totalSales: number;
  totalCommissions: number;
  totalLiters: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  seller: {
    name: string;
    store_number: string;
    email: string;
  };
  growth: {
    revenue_growth: string;
    liters_growth: string;
  };
  buyers: BuyerData[];
  chartData: ChartData;
}

export interface SellerDashboardResponse {
  success: boolean;
  data: SellerDashboardStats;
}

class SellerDashboardService extends BaseService {
  async getDashboardData(): Promise<SellerDashboardResponse> {
    // Get seller token instead of admin token
    const sellerToken = localStorage.getItem('sellerToken');
    if (!sellerToken) {
      throw new Error('Seller authentication required');
    }

    const response = await fetch(`${this.baseUrl}/sellers/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sellerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const sellerDashboardService = new SellerDashboardService();