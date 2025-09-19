import { BaseService } from './baseService';

export interface AdminDashboardData {
  totalUsers: number;
  totalStores: number;
  totalSales: number;
  totalCommissions: number;
  totalCampaigns: number;
  totalNotifications: number;
  recentActivity: any[];
  systemHealth: any;
}

export interface AdminResponse {
  success: boolean;
  data: any;
}

class AdminService extends BaseService {
  async getDashboardData(): Promise<{ success: boolean; data: AdminDashboardData }> {
    return this.request<{ success: boolean; data: AdminDashboardData }>('/admin/dashboard');
  }

  async getUsersData(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getStoresData(params: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    status?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.city) searchParams.append('city', params.city);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/admin/stores${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getSalesData(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);

    const queryString = searchParams.toString();
    const endpoint = `/admin/sales${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getCommissionsData(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    user_id?: string;
    store_id?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.store_id) searchParams.append('store_id', params.store_id);

    const queryString = searchParams.toString();
    const endpoint = `/admin/commissions${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getCampaignsData(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/admin/campaigns${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getNotificationsData(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/admin/notifications${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getReportsData(params: {
    type?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.type) searchParams.append('type', params.type);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/admin/reports${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }

  async getSettingsData(): Promise<AdminResponse> {
    return this.request<AdminResponse>('/admin/settings');
  }

  async updateSettingsData(settings: any): Promise<AdminResponse> {
    return this.request<AdminResponse>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getAnalyticsData(params: {
    type?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<AdminResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.type) searchParams.append('type', params.type);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/admin/analytics${queryString ? `?${queryString}` : ''}`;

    return this.request<AdminResponse>(endpoint);
  }
}

export const adminService = new AdminService();