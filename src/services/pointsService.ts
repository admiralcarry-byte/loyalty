import { BaseService } from './baseService';

export interface PointsStats {
  total_points_transactions: number;
  total_points_earned: number;
  total_points_spent: number;
  avg_points_per_transaction: number;
  earned_transactions: number;
  spent_transactions: number;
  points_today: number;
  points_week: number;
  points_month: number;
}

export interface PointsTransaction {
  _id: string;
  user_id: string;
  points: number;
  transaction_type: string;
  source: string;
  reference_type?: string;
  reference_id?: number;
  description?: string;
  created_at: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
}

export interface PointsTopEarner {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  total_points: number;
  transaction_count: number;
}

class PointsService extends BaseService {
  async getPointsStats(): Promise<{ success: boolean; data: PointsStats }> {
    return this.request<{ success: boolean; data: PointsStats }>('/points/stats/overview');
  }

  async getPointsTransactions(params?: {
    page?: number;
    limit?: number;
    user_id?: string;
    transaction_type?: string;
    start_date?: string;
    end_date?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ success: boolean; data: { transactions: PointsTransaction[]; pagination: any } }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/points?${queryString}` : '/points';
    
    return this.request<{ success: boolean; data: { transactions: PointsTransaction[]; pagination: any } }>(endpoint);
  }

  async getTopPointsEarners(limit: number = 10): Promise<{ success: boolean; data: { users: PointsTopEarner[] } }> {
    return this.request<{ success: boolean; data: { users: PointsTopEarner[] } }>(`/points/top-earners?limit=${limit}`);
  }

  async getPointsTransaction(id: string): Promise<{ success: boolean; data: { transaction: PointsTransaction } }> {
    return this.request<{ success: boolean; data: { transaction: PointsTransaction } }>(`/points/${id}`);
  }

  async createPointsTransaction(data: {
    user_id: string;
    points: number;
    transaction_type: string;
    source: string;
    reference_type?: string;
    reference_id?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { transaction: PointsTransaction } }> {
    return this.request<{ success: boolean; message: string; data: { transaction: PointsTransaction } }>('/points', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePointsTransaction(id: string, data: {
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { transaction: PointsTransaction } }> {
    return this.request<{ success: boolean; message: string; data: { transaction: PointsTransaction } }>(`/points/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePointsTransaction(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/points/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserPointsTransactions(userId: string, limit: number = 50): Promise<{ success: boolean; data: { transactions: PointsTransaction[]; user: any } }> {
    return this.request<{ success: boolean; data: { transactions: PointsTransaction[]; user: any } }>(`/points/user/${userId}?limit=${limit}`);
  }

  async getPointsStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/points/stats/overview');
  }

  async getTopEarners(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/points/top-earners');
  }
}

export const pointsService = new PointsService();