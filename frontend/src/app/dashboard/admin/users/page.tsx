"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

export default function AdminUsersPage() {
  const [sellers, setSellers] = useState<SellerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'admin') {
      router.push('/auth/login?redirect=/dashboard/admin/users');
      return;
    }

    api.sellers.getAll()
      .then(setSellers)
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  }, [router]);

  const activeSellers = useMemo(() => sellers.filter((seller) => seller.status === "active").length, [sellers]);
  const pendingSellers = useMemo(() => sellers.filter((seller) => seller.status === "pending").length, [sellers]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || seller.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sellers, searchTerm, statusFilter]);

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
          <h1 className="dashboard-page-title">User Management</h1>
          <p className="dashboard-page-subtitle">Manage sellers and customers</p>
        </div>
        <button className="d-btn d-btn-primary">+ Add User</button>
      </div>

      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Total Sellers</div>
          <div className="stat-value-row">
            <span className="stat-value">{sellers.length}</span>
            <span className="stat-badge">{activeSellers} active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Applications</div>
          <div className="stat-value-row">
            <span className="stat-value">{pendingSellers}</span>
            <span className="stat-badge stat-badge-warning">awaiting review</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value-row">
            <span className="stat-value">-</span>
            <span className="stat-badge">coming soon</span>
          </div>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="seller">Sellers</option>
        </select>
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Total Sales</th>
                <th>Earnings</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="d-avatar">{seller.name.charAt(0)}</div>
                      <div>
                        <div className="dashboard-list-primary">{seller.name}</div>
                        <div className="dashboard-list-secondary">{seller.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="d-badge d-badge-neutral">Seller</span></td>
                  <td>{seller.totalSales}</td>
                  <td style={{ fontWeight: 500 }}>${seller.totalEarnings.toLocaleString()}</td>
                  <td>
                    <span className={`d-badge ${seller.status === "active" ? "d-badge-success" : "d-badge-warning"}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
