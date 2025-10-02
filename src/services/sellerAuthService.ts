import { ADMIN_CONFIG } from '@/config/adminConfig';

export interface SellerLoginCredentials {
  email: string;
  password: string;
  storeNumber: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  store_number: string;
  status: string;
  total_sales: number;
  total_purchases: number;
  total_liters: number;
  total_customers: number;
}

export interface SellerAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    seller: Seller;
  };
}

class SellerAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ADMIN_CONFIG.global.apiBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async login(credentials: SellerLoginCredentials): Promise<SellerAuthResponse> {
    return this.request<SellerAuthResponse>('/sellers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    // For now, just clear local storage
    // In a real app, you might want to call a logout endpoint
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerRefreshToken');
    localStorage.removeItem('seller');
    
    return { success: true, message: 'Logged out successfully' };
  }

  async refreshToken(): Promise<SellerAuthResponse> {
    const refreshToken = localStorage.getItem('sellerRefreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.request<SellerAuthResponse>('/sellers/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('sellerToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('sellerToken');
  }

  getSeller(): Seller | null {
    const sellerStr = localStorage.getItem('seller');
    return sellerStr ? JSON.parse(sellerStr) : null;
  }

  setAuthData(token: string, refreshToken: string, seller: Seller): void {
    localStorage.setItem('sellerToken', token);
    localStorage.setItem('sellerRefreshToken', refreshToken);
    localStorage.setItem('seller', JSON.stringify(seller));
  }

  clearAuthData(): void {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerRefreshToken');
    localStorage.removeItem('seller');
  }
}

export const sellerAuthService = new SellerAuthService();