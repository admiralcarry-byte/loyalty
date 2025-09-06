import { BaseService } from './baseService';

export interface DashboardStats {
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsers: number;
    userGrowthPercentage: string;
    loyaltyDistribution: {
      lead: number;
      silver: number;
      gold: number;
      platinum: number;
    };
  };
  storeStats: {
    totalStores: number;
    activeStores: number;
    totalSales: number;
    averageSalesPerStore: number;
  };
  salesStats: {
    totalLiters: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesGrowth: string;
    revenueGrowth: string;
    currentMonthSales: number;
    previousMonthSales: number;
    currentMonthRevenue: number;
    previousMonthRevenue: number;
  };
  commissionStats: {
    totalCommissions: number;
    paidCommissions: number;
    pendingCommissions: number;
    topInfluencers: Array<{
      name: string;
      network: number;
      commission: number;
      tier: string;
    }>;
  };
  campaignStats: {
    activeCampaigns: number;
    totalCampaigns: number;
    campaignPerformance: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export interface SalesChartData {
  month: string;
  liters: number;
  revenue: number;
}

export interface UserRegistrationData {
  date: string;
  registrations: number;
}

class DashboardService extends BaseService {
  async getDashboardData(): Promise<{ success: boolean; data: DashboardStats }> {
    return this.request<{ success: boolean; data: DashboardStats }>('/dashboard');
  }

  async getSalesChartData(period: string = '30'): Promise<{ success: boolean; data: SalesChartData[] }> {
    return this.request<{ success: boolean; data: SalesChartData[] }>(`/dashboard/sales-chart?period=${period}`);
  }

  async getUserRegistrationData(period: string = '30'): Promise<{ success: boolean; data: UserRegistrationData[] }> {
    return this.request<{ success: boolean; data: UserRegistrationData[] }>(`/dashboard/user-registrations?period=${period}`);
  }

  async getLoyaltyDistribution(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/dashboard/loyalty-distribution');
  }

  async getTopInfluencers(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/dashboard/top-influencers');
  }

  async getRecentUsers(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/dashboard/recent-users');
  }
}

export const dashboardService = new DashboardService();