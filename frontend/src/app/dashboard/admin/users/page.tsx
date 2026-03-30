import { sellers } from "@/data/mockData";

export default function AdminUsersPage() {
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
            <span className="stat-value">45</span>
            <span className="stat-badge">42 active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Applications</div>
          <div className="stat-value-row">
            <span className="stat-value">5</span>
            <span className="stat-badge stat-badge-warning">3 new</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value-row">
            <span className="stat-value">128</span>
            <span className="stat-badge">+12</span>
          </div>
          <div className="stat-description">this month</div>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search users..." />
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }}>
          <option value="all">All Roles</option>
          <option value="seller">Sellers</option>
          <option value="customer">Customers</option>
        </select>
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }}>
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
                <tr key={seller.id}>
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
                  <td style={{ fontWeight: 500 }}>${seller.commissionEarned.toLocaleString()}</td>
                  <td>
                    <span className={`d-badge ${seller.status === "active" ? "d-badge-success" : "d-badge-warning"}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>Jan 15, 2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
