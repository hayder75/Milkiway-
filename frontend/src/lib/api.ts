const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  // Systems (Products)
  systems: {
    getAll: () => fetchApi<any[]>('/systems'),
    getById: (id: string) => fetchApi<any>(`/systems/${id}`),
    create: (data: any) => fetchApi<any>('/systems', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi<any>(`/systems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/systems/${id}`, { method: 'DELETE' }),
  },

  // Sellers
  sellers: {
    register: (data: { name: string; email: string; phone?: string }) => 
      fetchApi<any>('/sellers/register', { method: 'POST', body: JSON.stringify(data) }),
    
    login: (sellerId: string, email: string) => 
      fetchApi<any>('/sellers/login', { method: 'POST', body: JSON.stringify({ sellerId, email }) }),
    
    getById: (id: string) => fetchApi<any>(`/sellers/${id}`),
    getBySellerId: (sellerId: string) => fetchApi<any>(`/sellers/id/${sellerId}`),
    
    getAll: () => fetchApi<any[]>('/sellers'),
  },

  // Sales
  sales: {
    create: (data: {
      sellerId: string;
      systemId: string;
      systemName: string;
      buyerName: string;
      buyerPhone: string;
      buyerEmail: string;
      salePrice: number;
      sellerCommissionRate?: number;
    }) => fetchApi<any>('/sales', { method: 'POST', body: JSON.stringify(data) }),
    
    getBySeller: (sellerId: string) => fetchApi<any[]>(`/sales/seller/${sellerId}`),
    getStats: (sellerId: string) => fetchApi<any>(`/sales/stats/${sellerId}`),
    getAll: () => fetchApi<any[]>('/sales/all'),
  },

  // Contacts (Leads)
  contacts: {
    create: (data: {
      name: string;
      phone: string;
      email: string;
      systemId?: string;
      systemName?: string;
      message?: string;
      sellerId?: string;
    }) => fetchApi<any>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
    
    getAll: () => fetchApi<any[]>('/contacts'),
    update: (id: string, data: any) => fetchApi<any>(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Health check
  health: () => fetchApi<{ status: string; message: string }>('/health'),
};

export default api;
