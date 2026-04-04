const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SystemRecord {
  id: string;
  _id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  image?: string | null;
  video?: string | null;
  demoUrl?: string | null;
  price: number;
  commissionRate: number;
  features: string[];
  category?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SystemPayload {
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  video?: string;
  demoUrl?: string;
  price: number;
  commissionRate?: number;
  features: string[];
  category?: string;
  isActive?: boolean;
}

export interface SellerRecord {
  id?: string;
  _id: string;
  sellerId: string;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  role?: string;
  commissionRate: number;
  totalSales: number;
  totalEarnings: number;
  status: string;
  createdAt?: string;
}

export interface SellerLoginResponse {
  seller: SellerRecord;
}

export interface SaleRecord {
  id?: string;
  _id: string;
  saleId: string;
  sellerId?: string;
  systemId?: string;
  systemName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  salePrice: number;
  commissionPercent: number;
  commissionAmount: number;
  companyEarnings: number;
  status: string;
  paymentImage?: string | null;
  contractImage?: string | null;
  createdAt: string;
  seller?: {
    id?: string;
    _id: string;
    name: string;
    sellerId: string;
  } | null;
}

export interface CreateSalePayload {
  sellerId: string;
  systemId: string;
  systemName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  salePrice: number;
  sellerCommissionRate?: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalEarnings: number;
  commissionRate: number;
  pendingSales: number;
}

export interface PayoutRecord {
  _id: string;
  sellerId: string;
  amount: number;
  paymentMethod: string;
  note?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
  seller?: {
    _id: string;
    name: string;
    email: string;
    sellerId: string;
  } | null;
}

export interface ContractRecord {
  _id: string;
  sellerId: string;
  systemId: string;
  systemName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  salePrice: number;
  status: 'draft' | 'used' | 'cancelled';
  createdAt: string;
}

export interface CreativeRequestRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  projectType: string;
  budget?: string;
  description: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ContactRecord {
  id?: string;
  _id: string;
  name: string;
  phone: string;
  email?: string | null;
  systemName?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
  seller?: {
    id?: string;
    _id: string;
    name: string;
    sellerId: string;
  } | null;
  system?: {
    id?: string;
    _id: string;
    title: string;
  } | null;
}

export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  systemId?: string;
  systemName?: string;
  message?: string;
  sellerId?: string;
}

export interface FeatureRequestRecord {
  id?: string;
  _id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  requestedBy: string;
  createdAt: string;
}

export interface FeatureRequestPayload {
  title: string;
  description: string;
  sellerId?: string;
  requestedBy?: string;
  votes?: number;
  status?: string;
}

export interface IssueRecord {
  id?: string;
  _id: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  reporterName: string;
  createdAt: string;
}

export interface IssuePayload {
  title: string;
  description?: string;
  type?: string;
  sellerId?: string;
  reporterName?: string;
  status?: string;
}

export interface PortfolioRecord {
  id?: string;
  _id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  video?: string | null;
  size: "small" | "medium" | "large";
  services: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PortfolioPayload {
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  video?: string;
  size: "small" | "medium" | "large";
  services: string[];
  tags: string[];
  isActive?: boolean;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Upload
  upload: {
    single: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    
    multiple: async (files: File[]): Promise<{ files: { url: string; filename: string }[] }> => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
  },

  // Systems (Products)
  systems: {
    getAll: () => fetchApi<SystemRecord[]>('/systems'),
    getById: (id: string) => fetchApi<SystemRecord>(`/systems/${id}`),
    create: (data: SystemPayload) => fetchApi<SystemRecord>('/systems', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<SystemPayload>) => fetchApi<SystemRecord>(`/systems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/systems/${id}`, { method: 'DELETE' }),
  },

  // Sellers
  sellers: {
    register: (data: { name: string; username: string; email: string; phone?: string; password: string }) => 
      fetchApi<{ message: string; seller: SellerRecord }>('/sellers/register', { method: 'POST', body: JSON.stringify(data) }),
    
    login: (identifier: string, password: string) => 
      fetchApi<SellerLoginResponse>('/sellers/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),
    
    getById: (id: string) => fetchApi<SellerRecord>(`/sellers/${id}`),
    getBySellerId: (sellerId: string) => fetchApi<SellerRecord>(`/sellers/id/${sellerId}`),
    
    getAll: () => fetchApi<SellerRecord[]>('/sellers'),
  },

  // Sales
  sales: {
    create: (data: CreateSalePayload) => fetchApi<{ message: string; sale: SaleRecord }>('/sales', { method: 'POST', body: JSON.stringify(data) }),
    
    update: (id: string, data: Partial<Pick<SaleRecord, 'buyerName' | 'buyerPhone' | 'buyerEmail' | 'systemName' | 'status' | 'paymentImage' | 'contractImage'>>) =>
      fetchApi<{ message: string; sale: SaleRecord }>(`/sales/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    getBySeller: (sellerId: string) => fetchApi<SaleRecord[]>(`/sales/seller/${sellerId}`),
    getStats: (sellerId: string) => fetchApi<SalesStats>(`/sales/stats/${sellerId}`),
    getAll: () => fetchApi<SaleRecord[]>('/sales/all'),
  },

  // Payouts
  payouts: {
    create: (data: { sellerId: string; amount: number; paymentMethod: string; note?: string }) => 
      fetchApi<{ message: string; payout: PayoutRecord }>('/payouts', { method: 'POST', body: JSON.stringify(data) }),
    
    getBySeller: (sellerId: string) => fetchApi<PayoutRecord[]>(`/payouts/seller/${sellerId}`),
    getAll: () => fetchApi<PayoutRecord[]>('/payouts/all'),
    update: (id: string, data: { status: string; processedBy?: string }) =>
      fetchApi<{ message: string; payout: PayoutRecord }>(`/payouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Seller Profile
  sellerProfile: {
    update: (sellerId: string, data: { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string; paymentMethods?: unknown }) =>
      fetchApi<{ message: string; seller: SellerRecord }>(`/sellers/profile/${sellerId}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    getPaymentMethods: (sellerId: string) => fetchApi<unknown>(`/sellers/payment/${sellerId}`),
  },

  // Contracts
  contracts: {
    create: (data: { sellerId: string; systemId: string; systemName: string; buyerName: string; buyerPhone: string; buyerEmail?: string; salePrice: number }) =>
      fetchApi<{ message: string; contract: ContractRecord }>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
    
    getBySeller: (sellerId: string) => fetchApi<ContractRecord[]>(`/contracts/seller/${sellerId}`),
    
    markAsUsed: (id: string) =>
      fetchApi<{ message: string; contract: ContractRecord }>(`/contracts/${id}/use`, { method: 'PUT' }),
    
    delete: (id: string) =>
      fetchApi<{ message: string }>(`/contracts/${id}`, { method: 'DELETE' }),
  },

  // Creative Requests
  creativeRequests: {
    create: (data: { name: string; email: string; phone: string; companyName?: string; projectType: string; budget?: string; description: string }) =>
      fetchApi<{ message: string; request: CreativeRequestRecord }>('/creative-requests', { method: 'POST', body: JSON.stringify(data) }),
    
    getAll: () => fetchApi<CreativeRequestRecord[]>('/creative-requests'),
    
    updateStatus: (id: string, status: string) =>
      fetchApi<{ message: string; request: CreativeRequestRecord }>(`/creative-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    
    delete: (id: string) =>
      fetchApi<{ message: string }>(`/creative-requests/${id}`, { method: 'DELETE' }),
  },

  // Contacts (Leads)
  contacts: {
    create: (data: ContactPayload) => fetchApi<{ message: string; contact: ContactRecord }>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
    
    getAll: () => fetchApi<ContactRecord[]>('/contacts'),
    getBySeller: (sellerId: string) => fetchApi<ContactRecord[]>(`/contacts/seller/${sellerId}`),
    update: (id: string, data: Partial<ContactRecord>) => fetchApi<ContactRecord>(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  features: {
    create: (data: FeatureRequestPayload) => fetchApi<{ message: string; feature: FeatureRequestRecord }>('/features', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => fetchApi<FeatureRequestRecord[]>('/features'),
    update: (id: string, data: Partial<FeatureRequestRecord>) => fetchApi<{ message: string; feature: FeatureRequestRecord }>(`/features/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  issues: {
    create: (data: IssuePayload) => fetchApi<{ message: string; issue: IssueRecord }>('/issues', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => fetchApi<IssueRecord[]>('/issues'),
    update: (id: string, data: Partial<IssueRecord>) => fetchApi<{ message: string; issue: IssueRecord }>(`/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Portfolio (Creative Studio)
  portfolio: {
    getAll: () => fetchApi<PortfolioRecord[]>('/portfolio'),
    getById: (id: string) => fetchApi<PortfolioRecord>(`/portfolio/${id}`),
    create: (data: PortfolioPayload) => fetchApi<PortfolioRecord>('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PortfolioPayload>) => fetchApi<PortfolioRecord>(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/portfolio/${id}`, { method: 'DELETE' }),
  },

  // Health check
  health: () => fetchApi<{ status: string; message: string }>('/health'),
};

export default api;
