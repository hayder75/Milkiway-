"use client";

import { useEffect, useMemo, useState } from "react";
import api, { type SaleRecord } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading";

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadDeals = async () => {
    const sales = await api.sales.getAll();
    setDeals(sales);
  };

  useEffect(() => {
    loadDeals()
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "d-badge-warning";
      case "confirmed": return "d-badge-success";
      case "cancelled": return "d-badge-error";
      default: return "d-badge-neutral";
    }
  };

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch = deal.systemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        deal.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deals, searchTerm, statusFilter]);

  const handleStatusChange = async (saleId: string, status: string) => {
    await api.sales.update(saleId, { status });
    await loadDeals();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Deal Management</h1>
          <p className="dashboard-page-subtitle">Review and manage all deals</p>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search deals..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Client</th>
                <th>Value</th>
                <th>Commission</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal._id}>
                  <td style={{ fontWeight: 500 }}>{deal.systemName}</td>
                  <td>
                    <div>{deal.buyerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{deal.buyerEmail}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>${deal.salePrice.toLocaleString()}</td>
                  <td style={{ color: '#48a87c', fontWeight: 500 }}>${deal.commissionAmount.toLocaleString()}</td>
                  <td>
                    <span className={`d-badge ${getStatusClass(deal.status)}`}>{deal.status}</span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{new Date(deal.createdAt).toLocaleDateString()}</td>
                  <td>
                    {deal.status === "pending" && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="d-btn d-btn-sm" onClick={() => handleStatusChange(deal._id, "cancelled")}>✕</button>
                        <button className="d-btn d-btn-primary d-btn-sm" onClick={() => handleStatusChange(deal._id, "confirmed")}>✓</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
