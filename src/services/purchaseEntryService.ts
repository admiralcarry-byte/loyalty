import { BaseService } from './baseService';

export interface PurchaseEntryStats {
  total_entries: number;
  approved_entries: number;
  pending_entries: number;
  rejected_entries: number;
  total_value: number;
  total_liters: number;
  total_points: number;
  avg_entry_value: number;
  avg_liters_per_entry: number;
}

export interface PurchaseEntry {
  _id: string;
  user_id: string;
  store_id: string;
  amount: number;
  liters: number;
  points_earned: number;
  entry_date: string;
  entry_method: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  store_name?: string;
}

class PurchaseEntryService extends BaseService {
  async getPurchaseEntryStats(): Promise<{ success: boolean; data: PurchaseEntryStats }> {
    return this.request<{ success: boolean; data: PurchaseEntryStats }>('/purchases/stats/overview');
  }

  async getPurchaseEntries(params?: {
    page?: number;
    limit?: number;
    user_id?: string;
    store_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ success: boolean; data: { entries: PurchaseEntry[]; pagination: any } }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/purchases?${queryString}` : '/purchases';
    
    return this.request<{ success: boolean; data: { entries: PurchaseEntry[]; pagination: any } }>(endpoint);
  }

  async getPurchaseEntry(id: string): Promise<{ success: boolean; data: { entry: PurchaseEntry } }> {
    return this.request<{ success: boolean; data: { entry: PurchaseEntry } }>(`/purchases/${id}`);
  }

  async createPurchaseEntry(data: {
    user_id: string;
    store_id: string;
    amount: number;
    liters: number;
    points_earned: number;
    entry_date: string;
    entry_method: string;
    status?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { entry: PurchaseEntry } }> {
    return this.request<{ success: boolean; message: string; data: { entry: PurchaseEntry } }>('/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePurchaseEntry(id: string, data: {
    status?: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: { entry: PurchaseEntry } }> {
    return this.request<{ success: boolean; message: string; data: { entry: PurchaseEntry } }>(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePurchaseEntry(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/purchases/${id}`, {
      method: 'DELETE',
    });
  }

  async approvePurchaseEntry(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/purchases/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectPurchaseEntry(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/purchases/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getPurchaseStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/purchases/stats/overview');
  }

  async getPendingPurchases(): Promise<{ success: boolean; data: PurchaseEntry[] }> {
    return this.request<{ success: boolean; data: PurchaseEntry[] }>('/purchases/pending');
  }
}

export const purchaseEntryService = new PurchaseEntryService();