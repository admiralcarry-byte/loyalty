import { BaseService } from './baseService';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    billing: 'up' | 'down';
    wallet: 'up' | 'down';
    notifications: 'up' | 'down';
  };
  uptime: number;
  version: string;
}

class HealthService extends BaseService {
  async getHealthStatus(): Promise<{ success: boolean; data: HealthStatus }> {
    return this.request<{ success: boolean; data: HealthStatus }>('/health');
  }

  async getDetailedHealthStatus(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/health/detailed');
  }

  async getDatabaseHealth(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/health/database');
  }

  async getRedisHealth(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/health/redis');
  }

  async getExternalHealth(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/health/external');
  }
}

export const healthService = new HealthService();