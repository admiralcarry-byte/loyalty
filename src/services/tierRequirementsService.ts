import { BaseService } from './baseService';

export interface TierRequirement {
  _id?: string;
  tier: 'lead' | 'silver' | 'gold' | 'platinum';
  minimum_liters: number;
  display_name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TierRequirementsResponse {
  success: boolean;
  data: TierRequirement[];
  message?: string;
}

export interface TierForLitersResponse {
  success: boolean;
  data: {
    liters: number;
    tier: string;
  };
}

class TierRequirementsService extends BaseService {

  // Get all tier requirements
  async getTierRequirements(): Promise<TierRequirementsResponse> {
    return this.request<TierRequirementsResponse>('/tier-requirements');
  }

  // Update tier requirements
  async updateTierRequirements(requirements: TierRequirement[]): Promise<TierRequirementsResponse> {
    return this.request<TierRequirementsResponse>('/tier-requirements', {
      method: 'PUT',
      body: JSON.stringify({ requirements }),
    });
  }

  // Get tier for given liter amount
  async getTierForLiters(liters: number): Promise<TierForLitersResponse> {
    return this.request<TierForLitersResponse>(`/tier-requirements/liters/${liters}`);
  }
}

export const tierRequirementsService = new TierRequirementsService();