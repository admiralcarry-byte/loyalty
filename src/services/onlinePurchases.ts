export interface OnlineOrder {
  id: number;
  order_id: string;
  user_id: number;
  customer_name: string;
  phone: string;
  email: string;
  total_amount: number;
  liters_purchased: number;
  points_earned: number;
  delivery_method: 'home_delivery' | 'store_pickup';
  delivery_address?: string;
  payment_method: 'credit_card' | 'pix' | 'bank_transfer';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OnlineOrderItem[];
}

export interface OnlineOrderItem {
  id: number;
  order_id: number;
  product_id?: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  liters_per_unit: number;
  points_per_liter: number;
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  delivery_method: 'home_delivery' | 'store_pickup';
  delivery_address?: string;
  payment_method: 'credit_card' | 'pix' | 'bank_transfer';
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: OnlineOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  data: OnlineOrder;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: string;
    total_amount: number;
    liters_purchased: number;
    points_earned: number;
  };
}

class OnlinePurchasesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://loyalty-backend-production-8e32.up.railway.app/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle rate limiting with retry
      if (response.status === 429) {
        console.warn('Rate limited, retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Retry once
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, config);
        if (!retryResponse.ok) {
          throw new Error(errorData.error || `HTTP error! status: ${retryResponse.status}`);
        }
        return retryResponse.json();
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all online orders with filters
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    payment_method?: string;
    delivery_method?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<OrdersResponse>(`/online-purchases?${searchParams.toString()}`);
  }

  // Get specific order details
  async getOrder(id: number): Promise<OrderResponse> {
    return this.request<OrderResponse>(`/online-purchases/${id}`);
  }

  // Create new online order
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>('/online-purchases', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Update order status
  async updateOrderStatus(
    id: number,
    statusData: UpdateOrderStatusRequest
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/online-purchases/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Cancel order
  async cancelOrder(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/online-purchases/${id}`, {
      method: 'DELETE',
    });
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    success: boolean;
    data: {
      total_orders: number;
      total_revenue: number;
      avg_order_value: number;
      conversion_rate: number;
      pending_orders: number;
      completed_orders: number;
      processing_orders: number;
      shipped_orders: number;
      cancelled_orders: number;
      total_liters: number;
      total_points: number;
    };
  }> {
    return this.request('/online-purchases/stats/overview');
  }

  // Export orders data
  async exportOrders(params: {
    format?: 'csv' | 'excel';
    start_date?: string;
    end_date?: string;
    status?: string;
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/online-purchases/export?${searchParams.toString()}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }
}

// Create and export a singleton instance
export const onlinePurchasesService = new OnlinePurchasesService(); 