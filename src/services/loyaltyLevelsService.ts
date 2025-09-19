import { BaseService } from './baseService';

export interface LoyaltyLevel {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  level_number: number;
  requirements: {
    minimum_liters?: number;
    minimum_points?: number;
    minimum_purchases?: number;
    minimum_spent?: number;
    months_as_customer?: number;
  };
  benefits: {
    cashback_rate?: number;
    commission_rate?: number;
    discount_percentage?: number;
    free_shipping?: boolean;
    priority_support?: boolean;
    exclusive_offers?: boolean;
    birthday_bonus?: number;
    referral_bonus?: number;
  };
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoyaltyLevelsResponse {
  success: boolean;
  data: LoyaltyLevel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoyaltyLevelStats {
  total_levels: number;
  active_levels: number;
  inactive_levels: number;
  total_users: number;
  level_distribution: Array<{
    level_name: string;
    user_count: number;
    percentage: number;
  }>;
  average_upgrade_rate: number;
  top_level: string;
}

class LoyaltyLevelsService extends BaseService {
  private cachedLevels: LoyaltyLevelsResponse | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  async getLoyaltyLevels(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}): Promise<LoyaltyLevelsResponse> {
    // Only cache if no search/filter parameters
    const hasFilters = params.search || params.status || params.page || params.limit;
    
    if (!hasFilters) {
      // Check if we have valid cached data
      const now = Date.now();
      if (this.cachedLevels && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
        return this.cachedLevels;
      }
    }

    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/loyalty-levels${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await this.request<LoyaltyLevelsResponse>(endpoint);
      
      // Cache only if no filters
      if (!hasFilters) {
        this.cachedLevels = response;
        this.cacheTimestamp = now;
      }
      
      return response;
    } catch (error) {
      // If we have cached data and no filters, return it
      if (!hasFilters && this.cachedLevels) {
        return this.cachedLevels;
      }
      throw error;
    }
  }

  async getLoyaltyLevelById(id: string): Promise<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }> {
    return this.request<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }>(`/loyalty-levels/${id}`);
  }

  async createLoyaltyLevel(levelData: Partial<LoyaltyLevel>): Promise<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }> {
    const response = await this.request<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }>('/loyalty-levels', {
      method: 'POST',
      body: JSON.stringify(levelData),
    });
    
    // Clear cache after creating
    this.clearCache();
    
    return response;
  }

  async updateLoyaltyLevel(id: string, levelData: Partial<LoyaltyLevel>): Promise<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }> {
    const response = await this.request<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }>(`/loyalty-levels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(levelData),
    });
    
    // Clear cache after updating
    this.clearCache();
    
    return response;
  }

  async deleteLoyaltyLevel(id: string): Promise<{ success: boolean; message: string }> {
    const response = await this.request<{ success: boolean; message: string }>(`/loyalty-levels/${id}`, {
      method: 'DELETE',
    });
    
    // Clear cache after deleting
    this.clearCache();
    
    return response;
  }

  async getLoyaltyLevelStats(): Promise<{ success: boolean; data: LoyaltyLevelStats }> {
    return this.request<{ success: boolean; data: LoyaltyLevelStats }>('/loyalty-levels/stats/overview');
  }

  async getLoyaltyLevelByTier(tier: string): Promise<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }> {
    return this.request<{ success: boolean; data: { loyaltyLevel: LoyaltyLevel } }>(`/loyalty-levels/tier/${tier}`);
  }

  // Clear cache when levels are modified
  clearCache(): void {
    this.cachedLevels = null;
    this.cacheTimestamp = 0;
  }
}

export const loyaltyLevelsService = new LoyaltyLevelsService();