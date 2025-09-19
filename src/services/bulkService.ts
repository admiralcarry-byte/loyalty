import { BaseService } from './baseService';

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
  data?: any;
}

class BulkService extends BaseService {
  async bulkCreateUsers(users: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/users', {
      method: 'POST',
      body: JSON.stringify({ users }),
    });
  }

  async bulkUpdateUsers(users: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/users', {
      method: 'PUT',
      body: JSON.stringify({ users }),
    });
  }

  async bulkDeleteUsers(userIds: string[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/users', {
      method: 'DELETE',
      body: JSON.stringify({ user_ids: userIds }),
    });
  }

  async bulkCreateStores(stores: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/stores', {
      method: 'POST',
      body: JSON.stringify({ stores }),
    });
  }

  async bulkUpdateStores(stores: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/stores', {
      method: 'PUT',
      body: JSON.stringify({ stores }),
    });
  }

  async bulkDeleteStores(storeIds: string[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/stores', {
      method: 'DELETE',
      body: JSON.stringify({ store_ids: storeIds }),
    });
  }

  async bulkCreateSales(sales: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/sales', {
      method: 'POST',
      body: JSON.stringify({ sales }),
    });
  }

  async bulkUpdateSales(sales: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/sales', {
      method: 'PUT',
      body: JSON.stringify({ sales }),
    });
  }

  async bulkDeleteSales(saleIds: string[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/sales', {
      method: 'DELETE',
      body: JSON.stringify({ sale_ids: saleIds }),
    });
  }

  async bulkCreateCommissions(commissions: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/commissions', {
      method: 'POST',
      body: JSON.stringify({ commissions }),
    });
  }

  async bulkUpdateCommissions(commissions: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/commissions', {
      method: 'PUT',
      body: JSON.stringify({ commissions }),
    });
  }

  async bulkDeleteCommissions(commissionIds: string[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/commissions', {
      method: 'DELETE',
      body: JSON.stringify({ commission_ids: commissionIds }),
    });
  }

  async bulkCreateNotifications(notifications: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/notifications', {
      method: 'POST',
      body: JSON.stringify({ notifications }),
    });
  }

  async bulkUpdateNotifications(notifications: any[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notifications }),
    });
  }

  async bulkDeleteNotifications(notificationIds: string[]): Promise<BulkOperationResult> {
    return this.request<BulkOperationResult>('/bulk/notifications', {
      method: 'DELETE',
      body: JSON.stringify({ notification_ids: notificationIds }),
    });
  }
}

export const bulkService = new BulkService();