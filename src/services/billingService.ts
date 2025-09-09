import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loyalty-backend-production-8e32.up.railway.app/api';

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = authService.getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

interface BillingCompanyInvoice {
  id: string;
  invoiceId: string;
  userId: string;
  storeId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'partially_refunded';
  paymentMethod: string;
  date: string;
  syncedAt: string;
  pointsAwarded: number;
  cashbackAwarded: number;
  commissionGenerated: number;
}

interface ScanUpload {
  _id: string;
  userId: string;
  storeId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: 'provisional' | 'final' | 'rejected';
  filePath: string;
  ocrExtractedText: string;
  reconciliationData: {
    matchedPurchaseEntry?: string;
    matchedOnlinePurchase?: string;
    matchedAt?: string;
    confidence?: number;
  };
  pointsAwarded: number;
  cashbackAwarded: number;
  rejectionReason: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReceiptUploadResponse {
  success: boolean;
  message: string;
  data: {
    scanUploadId: string;
    extractedData: {
      invoiceNumber: string;
      storeName: string;
      amount: number;
      date: string;
      paymentMethod: string;
    };
    confidence: number;
    status: string;
  };
}

interface ReconciliationStats {
  pendingScanUploads: number;
  reconciledScanUploads: number;
  rejectedScanUploads: number;
  unreconciledBillingInvoices: number;
}

interface UnifiedBillingHistory {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  unifiedHistory: Array<{
    _id: string;
    invoiceId: string;
    amount: number;
    status: string;
    date: string;
    store: {
      _id: string;
      name: string;
      address: string;
    };
    totalPoints: number;
    totalCashback: number;
    scanUploads: ScanUpload[];
    pointsTransactions: any[];
    cashbackTransactions: any[];
  }>;
  summary: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

class BillingService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // External Invoice Management
  async getExternalInvoices(params: {
    page?: number;
    limit?: number;
    user_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.makeRequest(`/billing/external-invoices?${queryParams}`);
  }

  async getExternalInvoiceById(invoiceId: string) {
    return this.makeRequest(`/billing/external-invoices/${invoiceId}`);
  }

  // Receipt Upload & OCR Processing
  async uploadReceipt(file: File, userId: string, storeId: string, purchaseDate?: string, abortSignal?: AbortSignal) {
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('userId', userId);
    formData.append('storeId', storeId);
    if (purchaseDate) {
      formData.append('purchaseDate', purchaseDate);
    }

    const token = authService.getToken();
    
    const response = await fetch(`${API_BASE_URL}/billing/upload-receipt`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
      signal: abortSignal,
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Upload failed';
      const errorWithDetails = new Error(errorMessage);
      (errorWithDetails as any).details = error.details;
      (errorWithDetails as any).extractedData = error.extractedData;
      (errorWithDetails as any).extractedText = error.extractedText;
      (errorWithDetails as any).confidence = error.confidence;
      (errorWithDetails as any).warnings = error.warnings;
      throw errorWithDetails;
    }

    return response.json() as Promise<ReceiptUploadResponse>;
  }

  // Scan Uploads Management
  async getScanUploads(params: {
    page?: number;
    limit?: number;
    user_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.makeRequest(`/billing/scan-uploads?${queryParams}`);
  }

  async reconcileScanUpload(
    scanUploadId: string, 
    action: 'approve' | 'reject', 
    reason?: string,
    purchaseEntryId?: string,
    onlinePurchaseId?: string
  ) {
    return this.makeRequest(`/billing/scan-uploads/${scanUploadId}/reconcile`, {
      method: 'POST',
      body: JSON.stringify({
        action,
        reason,
        purchaseEntryId,
        onlinePurchaseId,
      }),
    });
  }

  // Unified Billing History
  async getUnifiedBillingHistory(
    userId: string,
    params: {
      page?: number;
      limit?: number;
      start_date?: string;
      end_date?: string;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.makeRequest(`/billing/unified-history/${userId}?${queryParams}`);
  }

  // Reconciliation Management
  async runReconciliation(type: 'scan_uploads' | 'billing_invoices' | 'all' = 'all') {
    return this.makeRequest('/billing/reconcile', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async getReconciliationStats() {
    return this.makeRequest('/billing/reconciliation-stats');
  }

  // Health Check for Billing Company API
  async checkBillingCompanyHealth() {
    return this.makeRequest('/billing/health');
  }
}

export const billingService = new BillingService();
export type { BillingCompanyInvoice, ScanUpload, ReceiptUploadResponse, ReconciliationStats, UnifiedBillingHistory };