import { ADMIN_CONFIG } from '@/config/adminConfig';

export class BaseService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = ADMIN_CONFIG.global.apiBaseUrl;
    console.log('BaseService constructor - Base URL:', this.baseUrl);
    console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Only add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        // Handle rate limiting with retry logic
        if (response.status === 429 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        // Handle specific error cases
        if (response.status === 401 && token) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        }
        
        if (response.status === 404) {
          throw new Error('The requested resource was not found.');
        }
        
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        
        // Add more context to error messages
        if (errorData.details) {
          throw new Error(`${errorMessage}. Details: ${JSON.stringify(errorData.details)}`);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  }
}