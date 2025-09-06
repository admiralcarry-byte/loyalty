import { BaseService } from './baseService';

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ActivityLogsResponse {
  success: boolean;
  data: {
    activities: ActivityLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLog;
}

class ActivityLogService extends BaseService {
  async getActivityLogs(params: {
    page?: number;
    limit?: number;
    user_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<ActivityLogsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.user_id) searchParams.append('user_id', params.user_id.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/activity-logs${queryString ? `?${queryString}` : ''}`;

    return this.request<ActivityLogsResponse>(endpoint);
  }

  async getUserActivityLogs(userId: number, params: {
    page?: number;
    limit?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<ActivityLogsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/activity-logs/user/${userId}${queryString ? `?${queryString}` : ''}`;

    return this.request<ActivityLogsResponse>(endpoint);
  }

  async getActivityLogById(id: number): Promise<ActivityLogResponse> {
    return this.request<ActivityLogResponse>(`/activity-logs/${id}`);
  }

  async createActivityLog(activityData: {
    user_id: number;
    action: string;
    description?: string;
    status?: 'success' | 'warning' | 'error' | 'info';
    ip_address?: string;
    user_agent?: string;
    metadata?: any;
  }): Promise<ActivityLogResponse> {
    return this.request<ActivityLogResponse>('/activity-logs', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async updateActivityLog(id: number, activityData: {
    action?: string;
    description?: string;
    status?: 'success' | 'warning' | 'error' | 'info';
    ip_address?: string;
    user_agent?: string;
    metadata?: any;
  }): Promise<ActivityLogResponse> {
    return this.request<ActivityLogResponse>(`/activity-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivityLog(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/activity-logs/${id}`, {
      method: 'DELETE',
    });
  }
}

export const activityLogService = new ActivityLogService();