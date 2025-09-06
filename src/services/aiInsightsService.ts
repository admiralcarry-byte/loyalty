import { BaseService } from './baseService';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'Customer Retention' | 'Revenue Optimization' | 'User Experience' | 'Marketing' | 'Conversion' | 'Operations';
  priority: 'high' | 'medium' | 'low';
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  implementation_date?: string;
  completion_date?: string;
  estimated_effort: 'Low' | 'Medium' | 'High';
  estimated_impact: number;
  tags: string[];
  ai_confidence: number;
  generated_by: 'ai_analytics' | 'ai_content' | 'manual';
  related_metrics: {
    user_engagement: number;
    conversion_rate: number;
    revenue_impact: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIInsightsStats {
  total_recommendations: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  completed: number;
  in_progress: number;
  pending: number;
  implementation_rate: number;
  avg_confidence: number;
  avg_user_engagement: number;
  avg_conversion_rate: number;
  recommendations_growth_percentage?: string;
  engagement_growth_percentage?: string;
  conversion_growth_percentage?: string;
}

export interface AIInsightsResponse {
  success: boolean;
  data: AIInsight[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AIInsightsStatsResponse {
  success: boolean;
  data: AIInsightsStats;
}

class AIInsightsService extends BaseService {
  async getAIInsights(params: {
    page?: number;
    limit?: number;
    priority?: string;
    category?: string;
    status?: string;
  } = {}): Promise<AIInsightsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);

    return this.request<AIInsightsResponse>(`/ai-insights?${queryParams.toString()}`);
  }

  async getTopRecommendations(limit: number = 5): Promise<{ success: boolean; data: AIInsight[] }> {
    return this.request<{ success: boolean; data: AIInsight[] }>(`/ai-insights/top-recommendations?limit=${limit}`);
  }

  async getAIInsightsStats(): Promise<AIInsightsStatsResponse> {
    return this.request<AIInsightsStatsResponse>('/ai-insights/stats');
  }

  async getAIInsightById(id: string): Promise<{ success: boolean; data: AIInsight }> {
    return this.request<{ success: boolean; data: AIInsight }>(`/ai-insights/${id}`);
  }

  async createAIInsight(insightData: Partial<AIInsight>): Promise<{ success: boolean; data: AIInsight }> {
    return this.request<{ success: boolean; data: AIInsight }>('/ai-insights', {
      method: 'POST',
      body: JSON.stringify(insightData),
    });
  }

  async updateAIInsight(id: string, insightData: Partial<AIInsight>): Promise<{ success: boolean; data: AIInsight }> {
    return this.request<{ success: boolean; data: AIInsight }>(`/ai-insights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(insightData),
    });
  }

  async updateInsightStatus(id: string, status: string, implementationDate?: string): Promise<{ success: boolean; data: AIInsight }> {
    return this.request<{ success: boolean; data: AIInsight }>(`/ai-insights/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, implementation_date: implementationDate }),
    });
  }

  async generateAIInsights(): Promise<{ success: boolean; data: AIInsight[] }> {
    return this.request<{ success: boolean; data: AIInsight[] }>('/ai-insights/generate', {
      method: 'POST',
    });
  }

  async deactivateAIInsight(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/ai-insights/${id}`, {
      method: 'DELETE',
    });
  }
}

export const aiInsightsService = new AIInsightsService();