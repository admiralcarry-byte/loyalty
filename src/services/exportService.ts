import { BaseService } from './baseService';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  type: 'reports' | 'users' | 'sales' | 'products' | 'points-transactions';
  filters?: {
    start_date?: string;
    end_date?: string;
    status?: string;
    role?: string;
    loyalty_tier?: string;
    [key: string]: any;
  };
}

class ExportService extends BaseService {
  async exportData(options: ExportOptions): Promise<void> {
    try {
      const { format, type, filters = {} } = options;
      console.log('Export options:', options);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('format', format);
      
      // Add filters as query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const endpoint = `/export/${type}?${params.toString()}`;
      const fullUrl = `${this.baseUrl}${endpoint}`;
      console.log('Export URL:', fullUrl);
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      // Use BaseService request method for proper authentication and error handling
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  async exportReportsExcel(): Promise<void> {
    // Export sales data as CSV (Excel can open CSV files)
    // In the future, this could be enhanced to create a proper Excel file
    await this.exportData({
      format: 'csv',
      type: 'sales',
      filters: {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      }
    });
  }

  async exportReportsPDF(): Promise<void> {
    // Export users data as CSV (can be converted to PDF by user)
    // In the future, this could be enhanced to create a proper PDF
    await this.exportData({
      format: 'csv',
      type: 'users',
    });
  }

  async exportUsers(options: { format: 'csv' | 'excel' | 'pdf'; filters?: any }): Promise<void> {
    await this.exportData({
      format: options.format,
      type: 'users',
      filters: options.filters,
    });
  }

  async exportSales(options: { format: 'csv' | 'excel' | 'pdf'; filters?: any }): Promise<void> {
    await this.exportData({
      format: options.format,
      type: 'sales',
      filters: options.filters,
    });
  }

  async exportProducts(options: { format: 'csv' | 'excel' | 'pdf'; filters?: any }): Promise<void> {
    await this.exportData({
      format: options.format,
      type: 'products',
      filters: options.filters,
    });
  }

  async exportPointsTransactions(options: { format: 'csv' | 'excel' | 'pdf'; filters?: any }): Promise<void> {
    await this.exportData({
      format: options.format,
      type: 'points-transactions',
      filters: options.filters,
    });
  }
}

export const exportService = new ExportService();