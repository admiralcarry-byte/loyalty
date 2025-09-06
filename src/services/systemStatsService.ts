import { BaseService } from './baseService';

export interface SystemStats {
  active_settings: number;
  saved_changes: number;
  system_status: number;
  system_growth_percentage: number;
  performance_growth_percentage: number;
  last_updated: string;
}

class SystemStatsService extends BaseService {
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await this.request<{ success: boolean; data: SystemStats }>('/system-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Return default values if API fails
      return {
        active_settings: 12,
        saved_changes: 8,
        system_status: 98,
        system_growth_percentage: 15.2,
        performance_growth_percentage: 8.7,
        last_updated: new Date().toISOString()
      };
    }
  }

  async updateSystemStats(): Promise<SystemStats> {
    try {
      const response = await this.request<{ success: boolean; data: SystemStats }>('/system-stats/update', {
        method: 'POST'
      });
      return response.data;
    } catch (error) {
      console.error('Error updating system stats:', error);
      throw error;
    }
  }
}

export const systemStatsService = new SystemStatsService();