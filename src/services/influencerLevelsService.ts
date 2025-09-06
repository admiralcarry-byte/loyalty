import { BaseService } from './baseService';

export interface InfluencerLevel {
  id: string;
  name: string;
  level_order: number;
  required_referrals: number;
  required_active_clients: number;
  commission_rate: number;
  auto_promotion: boolean;
  benefits: string[];
  requirements: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export interface InfluencerStats {
  total_influencers: number;
  total_networks: number;
  total_active_clients: number;
  total_monthly_sales: number;
  avg_commission: number;
  promotions_this_month: number;
  influencer_growth_percentage?: string;
  network_growth_percentage?: string;
  commission_growth_percentage?: string;
}

export interface PromotionCandidate {
  user_id: string;
  user_name: string;
  current_level: string;
  next_level: string;
  referrals: number;
  active_clients: number;
  monthly_sales: number;
  progress: number;
}

export interface InfluencerLevelsResponse {
  success: boolean;
  data: InfluencerLevel[];
}

export interface InfluencerStatsResponse {
  success: boolean;
  data: InfluencerStats;
}

export interface PromotionCandidatesResponse {
  success: boolean;
  data: PromotionCandidate[];
}

class InfluencerLevelsService extends BaseService {
  async getInfluencerLevels(): Promise<InfluencerLevelsResponse> {
    return this.request<InfluencerLevelsResponse>('/influencer-levels');
  }

  async getInfluencerLevelsWithStats(): Promise<InfluencerLevelsResponse> {
    return this.request<InfluencerLevelsResponse>('/influencer-levels/stats');
  }

  async getInfluencerStats(): Promise<InfluencerStatsResponse> {
    return this.request<InfluencerStatsResponse>('/influencer-levels/influencer-stats');
  }

  async getPromotionCandidates(): Promise<PromotionCandidatesResponse> {
    return this.request<PromotionCandidatesResponse>('/influencer-levels/promotion-candidates');
  }

  async getInfluencerLevelById(id: string): Promise<{ success: boolean; data: InfluencerLevel }> {
    return this.request<{ success: boolean; data: InfluencerLevel }>(`/influencer-levels/${id}`);
  }

  async createInfluencerLevel(levelData: Partial<InfluencerLevel>): Promise<{ success: boolean; data: InfluencerLevel }> {
    return this.request<{ success: boolean; data: InfluencerLevel }>('/influencer-levels', {
      method: 'POST',
      body: JSON.stringify(levelData),
    });
  }

  async updateInfluencerLevel(id: string, levelData: Partial<InfluencerLevel>): Promise<{ success: boolean; data: InfluencerLevel }> {
    return this.request<{ success: boolean; data: InfluencerLevel }>(`/influencer-levels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(levelData),
    });
  }

  async deactivateInfluencerLevel(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/influencer-levels/${id}`, {
      method: 'DELETE',
    });
  }
}

export const influencerLevelsService = new InfluencerLevelsService();