import { BaseService } from './baseService';

export interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: any;
}

class AnalyticsService extends BaseService {
  async getDashboardAnalytics(): Promise<AnalyticsResponse> {
    return this.request<AnalyticsResponse>('/analytics/dashboard');
  }

  async getUserAnalytics(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/analytics/users${queryString ? `?${queryString}` : ''}`;

    return this.request<AnalyticsResponse>(endpoint);
  }

  async getSalesAnalytics(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/analytics/sales${queryString ? `?${queryString}` : ''}`;

    return this.request<AnalyticsResponse>(endpoint);
  }

  async getRevenueAnalytics(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/analytics/revenue${queryString ? `?${queryString}` : ''}`;

    return this.request<AnalyticsResponse>(endpoint);
  }

  async getPerformanceAnalytics(params: {
    start_date?: string;
    end_date?: string;
    group_by?: 'day' | 'week' | 'month' | 'year';
  } = {}): Promise<AnalyticsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);
    if (params.group_by) searchParams.append('group_by', params.group_by);

    const queryString = searchParams.toString();
    const endpoint = `/analytics/performance${queryString ? `?${queryString}` : ''}`;

    return this.request<AnalyticsResponse>(endpoint);
  }
}

export const analyticsService = new AnalyticsService();