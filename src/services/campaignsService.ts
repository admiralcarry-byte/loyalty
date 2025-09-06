import { BaseService } from './baseService';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'loyalty' | 'referral' | 'giveaway' | 'promotional';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  targetAudience: string;
  budget: number;
  spent: number;
  participants: number;
  conversions: number;
  conversionRate: number;
  roi: number;
  shops: string[];
  rewards: {
    type: string;
    value: number;
    description: string;
  }[];
  conditions: {
    minPurchase: number;
    minLiters: number;
    loyaltyTier: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class CampaignsService extends BaseService {
  async getCampaigns(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
  } = {}): Promise<CampaignsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/campaigns${queryString ? `?${queryString}` : ''}`;

    return this.request<CampaignsResponse>(endpoint);
  }

  async getCampaignById(id: string): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>(`/campaigns/${id}`);
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async updateCampaign(id: string, campaignData: Partial<Campaign>): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async startCampaign(id: string): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>(`/campaigns/${id}/start`, {
      method: 'POST',
    });
  }

  async pauseCampaign(id: string): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>(`/campaigns/${id}/pause`, {
      method: 'POST',
    });
  }

  async stopCampaign(id: string): Promise<{ success: boolean; data: { campaign: Campaign } }> {
    return this.request<{ success: boolean; data: { campaign: Campaign } }>(`/campaigns/${id}/stop`, {
      method: 'POST',
    });
  }

  async getCampaignStats(id: string): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>(`/campaigns/${id}/stats`);
  }

  async getCampaignOverviewStats(): Promise<{
    success: boolean;
    data: {
      total_campaigns: number;
      active_campaigns: number;
      draft_campaigns: number;
      paused_campaigns: number;
      completed_campaigns: number;
      cancelled_campaigns: number;
      total_views: number;
      avg_engagement: number;
      total_participants: number;
      total_conversions: number;
      best_performing: string;
      best_performing_engagement: number;
    };
  }> {
    return this.request('/campaigns/stats/overview');
  }
}

export const campaignsService = new CampaignsService();