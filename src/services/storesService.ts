import { BaseService } from './baseService';

export interface Store {
  _id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  address: {
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
  };
  manager: {
    name?: string;
    phone?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface StoresResponse {
  success: boolean;
  data: Store[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class StoresService extends BaseService {
  private cachedStores: StoresResponse | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  async getStores(params: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    status?: string;
  } = {}): Promise<StoresResponse> {
    // Only cache if no search/filter parameters
    const hasFilters = params.search || params.city || params.status || params.page || params.limit;
    
    if (!hasFilters) {
      // Check if we have valid cached data
      const now = Date.now();
      if (this.cachedStores && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        return this.cachedStores;
      }
    }

    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.city) searchParams.append('city', params.city);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/stores${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await this.request<StoresResponse>(endpoint);
      
      // Cache only if no filters
      if (!hasFilters) {
        this.cachedStores = response;
        this.cacheTimestamp = now;
      }
      
      return response;
    } catch (error) {
      // If we have cached data and no filters, return it
      if (!hasFilters && this.cachedStores) {
        return this.cachedStores;
      }
      throw error;
    }
  }

  async getStoreById(id: string): Promise<{ success: boolean; data: { store: Store } }> {
    return this.request<{ success: boolean; data: { store: Store } }>(`/stores/${id}`);
  }

  async createStore(storeData: Partial<Store>): Promise<{ success: boolean; data: { store: Store } }> {
    return this.request<{ success: boolean; data: { store: Store } }>('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async updateStore(id: string, storeData: Partial<Store>): Promise<{ success: boolean; data: { store: Store } }> {
    return this.request<{ success: boolean; data: { store: Store } }>(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  }

  async deleteStore(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/stores/${id}`, {
      method: 'DELETE',
    });
  }

  async getStoreStats(id: string): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>(`/stores/${id}/stats`);
  }

  async getStoresOverviewStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/stores/stats/overview');
  }

  async updateStoreStatus(id: string, status: string): Promise<{ success: boolean; data: { store: Store } }> {
    return this.request<{ success: boolean; data: { store: Store } }>(`/stores/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getNearbyStores(latitude: number, longitude: number, radius: number = 10): Promise<{ success: boolean; data: Store[] }> {
    return this.request<{ success: boolean; data: Store[] }>(`/stores/location/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
  }

  async searchStores(term: string): Promise<{ success: boolean; data: Store[] }> {
    return this.request<{ success: boolean; data: Store[] }>(`/stores/search/${encodeURIComponent(term)}`);
  }

  async getStoresByCity(city: string): Promise<{ success: boolean; data: Store[] }> {
    return this.request<{ success: boolean; data: Store[] }>(`/stores/city/${encodeURIComponent(city)}`);
  }

  async getStoresByCountry(country: string): Promise<{ success: boolean; data: Store[] }> {
    return this.request<{ success: boolean; data: Store[] }>(`/stores/country/${encodeURIComponent(country)}`);
  }

  // Clear cache when stores are modified
  clearCache(): void {
    this.cachedStores = null;
    this.cacheTimestamp = 0;
  }
}

export const storesService = new StoresService();