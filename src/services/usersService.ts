import { ADMIN_CONFIG } from '@/config/adminConfig';
import { User } from './authService';

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByTier: {
    lead: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

class UsersService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ADMIN_CONFIG.global.apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Access token required. Please log in again.');
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 401) {
          // Try to refresh token first
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                if (refreshData.success && refreshData.data.accessToken) {
                  localStorage.setItem('token', refreshData.data.accessToken);
                  // Retry the original request with new token
                  const retryConfig: RequestInit = {
                    ...config,
                    headers: {
                      ...config.headers,
                      'Authorization': `Bearer ${refreshData.data.accessToken}`,
                    },
                  };
                  
                  const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, retryConfig);
                  if (retryResponse.ok) {
                    return retryResponse.json();
                  }
                }
              }
            }
          } catch (refreshError) {
            console.warn('Token refresh failed:', refreshError);
          }

          // Clear invalid tokens and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        
        const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
        (error as any).details = errorData.details;
        (error as any).errorCode = errorData.error;
        throw error;
      }

      return response.json();
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    loyalty_tier?: string;
  } = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.status) searchParams.append('status', params.status);
    if (params.loyalty_tier) searchParams.append('loyalty_tier', params.loyalty_tier);

    const queryString = searchParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;

    return this.request<UsersResponse>(endpoint);
  }

  async getUserById(id: string): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats(): Promise<{ success: boolean; data: UserStats }> {
    return this.request<{ success: boolean; data: UserStats }>('/users/stats/overview');
  }

  async resetUserPassword(id: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  async getAllUserStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/users/stats');
  }

  async getInfluencerPerformance(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/users/influencer-performance');
  }
}

export const usersService = new UsersService(); 