import { BaseService } from './baseService';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: 'fuel' | 'water' | 'bottles' | 'accessories' | 'equipment' | 'subscription';
  type: 'premium_fuel' | 'regular_fuel' | 'diesel' | 'bottled_water' | 'dispenser' | 'filter' | 'bottle' | 'subscription_plan';
  description?: string;
  short_description?: string;
  price: {
    current: number;
    original?: number;
    wholesale?: number;
    bulk?: number;
  };
  cost: number;
  currency: string;
  inventory: {
    quantity: number;
    reserved: number;
    minimum_stock: number;
    reorder_point: number;
    max_stock?: number;
  };
  specifications?: {
    volume?: number;
    unit?: 'ml' | 'l' | 'liter' | 'g' | 'kg' | 'piece';
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    material?: string;
    color?: string;
    brand?: string;
  };
  water_properties?: {
    ph_level?: number;
    tds?: number;
    source?: string;
    purification_method?: string;
    mineral_content?: {
      calcium?: number;
      magnesium?: number;
      sodium?: number;
      potassium?: number;
    };
  };
  images?: Array<{
    url: string;
    alt_text?: string;
    is_primary?: boolean;
    order?: number;
  }>;
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  availability: {
    in_stores: boolean;
    online: boolean;
    delivery: boolean;
    pickup: boolean;
  };
  points: {
    earn_rate: number;
    redemption_value: number;
  };
  tags?: string[];
  related_products?: string[];
  reviews?: Array<{
    user: string;
    rating: number;
    comment?: string;
    created_at: string;
  }>;
  average_rating: number;
  review_count: number;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    url_slug?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductsService extends BaseService {
  async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return this.request<ProductsResponse>(endpoint);
  }

  async getProductById(id: string): Promise<{ success: boolean; data: { product: Product } }> {
    return this.request<{ success: boolean; data: { product: Product } }>(`/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<{ success: boolean; data: { product: Product } }> {
    return this.request<{ success: boolean; data: { product: Product } }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; data: { product: Product } }> {
    return this.request<{ success: boolean; data: { product: Product } }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getProductsStats(): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/products/stats/overview');
  }

  async searchProducts(term: string): Promise<{ success: boolean; data: Product[] }> {
    return this.request<{ success: boolean; data: Product[] }>(`/products/search/${encodeURIComponent(term)}`);
  }

  async getProductsByCategory(category: string): Promise<{ success: boolean; data: Product[] }> {
    return this.request<{ success: boolean; data: Product[] }>(`/products/category/${encodeURIComponent(category)}`);
  }

  async getLowStockProducts(): Promise<{ success: boolean; data: Product[] }> {
    return this.request<{ success: boolean; data: Product[] }>('/products/low-stock');
  }
}

export const productsService = new ProductsService();