import { BaseService } from './baseService';

export interface Store {
  _id?: string;
  id?: string;
  name: string;
  code?: string;
  type: 'retail' | 'wholesale' | 'distributor' | 'online';
  status: 'active' | 'inactive' | 'suspended';
  address: {
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  manager: {
    name?: string;
    phone?: string;
    email?: string;
  };
  operating_hours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  services: string[];
  payment_methods?: string[];
  commission_rate?: number;
  minimum_order?: number;
  delivery_radius?: number;
  delivery_fee?: number;
  inventory?: {
    total_bottles: number;
    available_bottles: number;
    reserved_bottles: number;
  };
  performance?: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    customer_count: number;
  };
  notes?: string;
  tags?: string[];
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