import { BaseService } from './baseService';

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
  latitude?: number;
  longitude?: number;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  createdAt: string;
  updatedAt: string;
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
  async getStores(params: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    status?: string;
  } = {}): Promise<StoresResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.city) searchParams.append('city', params.city);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/stores${queryString ? `?${queryString}` : ''}`;

    return this.request<StoresResponse>(endpoint);
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
}

export const storesService = new StoresService();