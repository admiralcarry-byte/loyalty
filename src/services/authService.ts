import { ADMIN_CONFIG } from '@/config/adminConfig';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'user' | 'customer' | 'influencer';
  status: 'active' | 'inactive' | 'suspended';
  first_name: string;
  last_name?: string;
  phone?: string;
  referral_code?: string;
  referred_by?: string;
  loyalty_tier: 'lead' | 'silver' | 'gold' | 'platinum';
  points_balance: number;
  liter_balance: number;
  total_purchases: number;
  total_liters: number;
  total_points_earned: number;
  total_points_spent: number;
  last_login?: string;
  profile_image?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  verification?: {
    email_verified: boolean;
    phone_verified: boolean;
    email_verification_token?: string;
    phone_verification_code?: string;
    email_verification_expires?: string;
    phone_verification_expires?: string;
  };
  security?: {
    two_factor_enabled: boolean;
    two_factor_secret?: string;
    login_attempts: number;
    lock_until?: string;
    password_changed_at?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ADMIN_CONFIG.global.apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return response;
  }

  async getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>('/auth/me');
  }

  async refreshToken(): Promise<{ success: boolean; data: { user: User; accessToken: string } }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ success: boolean; data: { user: User; accessToken: string } }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update the access token
    if (response.success && response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setAuthData(token: string, refreshToken: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const authService = new AuthService(); 