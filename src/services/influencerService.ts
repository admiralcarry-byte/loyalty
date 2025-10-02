import { BaseService } from './baseService';

export interface InfluencerStats {
  totalReferrals: number;
  totalUnitsPurchased: number;
  currentRewards: number;
  totalEarnings: number;
}

export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalLiters: number;
  registrationDate: string;
  lastUpdate: string;
}

export interface InfluencerDashboardData {
  influencer: {
    name: string;
    email: string;
    phone: string;
  };
  stats: InfluencerStats;
  referredUsers: ReferredUser[];
}

export interface BuyerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalTransactions: number;
  totalAmount: number;
  totalLiters: number;
  loyalty_tier?: string;
  status: string;
  registrationDate: string;
  lastTransaction: string | null;
}

export interface InfluencerBuyersData {
  influencer: {
    name: string;
    phone: string;
    email: string;
  };
  stats: {
    totalBuyers: number;
    totalUnits: number;
    totalAmount: number;
    totalTransactions: number;
  };
  buyers: BuyerData[];
}

export interface Influencer {
  _id: string;
  first_name: string;
  email: string;
  phone: string;
  createdAt: string;
}

class InfluencerService extends BaseService {
  async getInfluencerDashboard(influencerId: string): Promise<{ success: boolean; data: InfluencerDashboardData }> {
    return this.request<{ success: boolean; data: InfluencerDashboardData }>(`/users/influencer-dashboard/${influencerId}`);
  }

  async getTestInfluencerData(): Promise<{ success: boolean; data: { influencers: Influencer[]; usersWithReferrals: any[]; totalInfluencers: number; totalUsersWithReferrals: number } }> {
    return this.request<{ success: boolean; data: { influencers: Influencer[]; usersWithReferrals: any[]; totalInfluencers: number; totalUsersWithReferrals: number } }>('/users/test-influencer-data');
  }

  async getInfluencerPerformance(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/users/influencer-performance');
  }

  async getInfluencerBuyers(): Promise<{ success: boolean; data: InfluencerBuyersData }> {
    return this.request<{ success: boolean; data: InfluencerBuyersData }>('/users/influencer-buyers');
  }
}

export const influencerService = new InfluencerService();