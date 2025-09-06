import { BaseService } from './baseService';

export interface GeneralSettings {
  _id?: string;
  app_name: string;
  support_email: string;
  currency: string;
  app_description: string;
  timezone: string;
  language: string;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class GeneralSettingsService extends BaseService {
  private cachedSettings: GeneralSettings | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getGeneralSettings(): Promise<GeneralSettings> {
    // Check if we have valid cached data
    const now = Date.now();
    if (this.cachedSettings && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedSettings;
    }

    try {
      const response = await this.request<{ success: boolean; data: GeneralSettings }>('/general-settings');
      this.cachedSettings = response.data;
      this.cacheTimestamp = now;
      return response.data;
    } catch (error) {
      console.error('Error fetching general settings:', error);
      
      // If we have cached data, return it even if expired
      if (this.cachedSettings) {
        console.warn('Using cached settings due to API error');
        return this.cachedSettings;
      }
      
      // Return default values if no cache and API fails
      const defaultSettings = {
        app_name: 'ÁGUA TWEZAH',
        support_email: 'support@aguatwezah.com',
        currency: 'USD',
        app_description: 'Premium Water Loyalty Program',
        timezone: 'Africa/Luanda',
        language: 'Portuguese',
        is_active: true
      };
      
      this.cachedSettings = defaultSettings;
      this.cacheTimestamp = now;
      return defaultSettings;
    }
  }

  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<GeneralSettings> {
    try {
      // Filter out fields that shouldn't be sent to the API
      const { _id, is_active, createdAt, updatedAt, __v, ...filteredSettings } = settings;
      
      console.log('Sending settings to API:', filteredSettings);
      
      const response = await this.request<{ success: boolean; data: GeneralSettings; message: string }>('/general-settings', {
        method: 'PUT',
        body: JSON.stringify(filteredSettings)
      });
      
      // Clear cache after successful update
      this.cachedSettings = null;
      this.cacheTimestamp = 0;
      
      return response.data;
    } catch (error) {
      console.error('Error updating general settings:', error);
      throw error;
    }
  }
}

export const generalSettingsService = new GeneralSettingsService();