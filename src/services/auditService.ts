import { BaseService } from './baseService';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuditStats {
  total_logs: number;
  logs_today: number;
  logs_this_week: number;
  logs_this_month: number;
  top_actions: Array<{
    action: string;
    count: number;
  }>;
  top_users: Array<{
    user_id: string;
    user_name: string;
    count: number;
  }>;
}

class AuditService extends BaseService {
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    user_id?: string;
    action?: string;
    resource?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<AuditLogsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.action) searchParams.append('action', params.action);
    if (params.resource) searchParams.append('resource', params.resource);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/audit/logs${queryString ? `?${queryString}` : ''}`;

    return this.request<AuditLogsResponse>(endpoint);
  }

  async getAuditLogById(id: string): Promise<{ success: boolean; data: { log: AuditLog } }> {
    return this.request<{ success: boolean; data: { log: AuditLog } }>(`/audit/logs/${id}`);
  }

  async getAuditLogsByUser(userId: string, params: {
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<AuditLogsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/audit/user/${userId}${queryString ? `?${queryString}` : ''}`;

    return this.request<AuditLogsResponse>(endpoint);
  }

  async getAuditStats(): Promise<{ success: boolean; data: AuditStats }> {
    return this.request<{ success: boolean; data: AuditStats }>('/audit/stats/overview');
  }
}

export const auditService = new AuditService();