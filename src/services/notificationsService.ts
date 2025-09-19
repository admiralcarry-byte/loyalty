import { BaseService } from './baseService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  audience: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class NotificationsService extends BaseService {
  async getNotifications(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<NotificationsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;

    return this.request<NotificationsResponse>(endpoint);
  }

  async getNotificationById(id: string): Promise<{ success: boolean; data: { notification: Notification } }> {
    return this.request<{ success: boolean; data: { notification: Notification } }>(`/notifications/${id}`);
  }

  async createNotification(notificationData: Partial<Notification>): Promise<{ success: boolean; data: { notification: Notification } }> {
    return this.request<{ success: boolean; data: { notification: Notification } }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async updateNotification(id: string, notificationData: Partial<Notification>): Promise<{ success: boolean; data: { notification: Notification } }> {
    return this.request<{ success: boolean; data: { notification: Notification } }>(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notificationData),
    });
  }

  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async sendNotification(id: string): Promise<{ success: boolean; data: { notification: Notification } }> {
    return this.request<{ success: boolean; data: { notification: Notification } }>(`/notifications/${id}/send`, {
      method: 'POST',
    });
  }

  async scheduleNotification(id: string, scheduledAt: string): Promise<{ success: boolean; data: { notification: Notification } }> {
    return this.request<{ success: boolean; data: { notification: Notification } }>(`/notifications/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ scheduledAt }),
    });
  }

  async getOldNotifications(): Promise<{ success: boolean; data: Notification[] }> {
    return this.request<{ success: boolean; data: Notification[] }>('/notifications/old');
  }

  async getNotificationsStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/notifications/stats/overview');
  }

  async getNotificationsByUser(userId: string): Promise<{ success: boolean; data: Notification[] }> {
    return this.request<{ success: boolean; data: Notification[] }>(`/notifications/user/${userId}`);
  }
}

export const notificationsService = new NotificationsService();