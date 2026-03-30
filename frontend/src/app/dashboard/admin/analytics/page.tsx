const topSellers = [
  { name: "Sarah Johnson", sales: 22, revenue: 18750, conversion: 85 },
  { name: "John Smith", sales: 15, revenue: 12500, conversion: 72 },
  { name: "Mike Davis", sales: 8, revenue: 6200, conversion: 65 },
];

const topProducts = [
  { name: "E-Commerce Pro", sales: 45, revenue: 112455, growth: 12 },
  { name: "Hotel Management", sales: 28, revenue: 97972, growth: 8 },
  { name: "CRM Enterprise", sales: 22, revenue: 43978, growth: 15 },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Analytics</h1>
          <p className="dashboard-page-subtitle">Platform performance and insights</p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-stats-4">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value-row">
            <span className="stat-value">$156,500</span>
            <span className="stat-badge">+12%</span>
          </div>
          <div className="stat-description">from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sales</div>
          <div className="stat-value-row">
            <span className="stat-value">128</span>
            <span className="stat-badge">+18%</span>
          </div>
          <div className="stat-description">from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Sellers</div>
          <div className="stat-value-row">
            <span className="stat-value">45</span>
            <span className="stat-badge">+3</span>
          </div>
          <div className="stat-description">this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value-row">
            <span className="stat-value">24%</span>
            <span className="stat-badge stat-badge-warning">-2%</span>
          </div>
          <div className="stat-description">from last month</div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Top Sellers */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Top Sellers</div>
              <div className="dashboard-card-subtitle">Best performing sellers this month</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {topSellers.map((seller, index) => (
              <div key={seller.name} className="dashboard-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="d-avatar">{index + 1}</div>
                  <div>
                    <div className="dashboard-list-primary">{seller.name}</div>
                    <div className="dashboard-list-secondary">{seller.sales} sales · {seller.conversion}% conversion</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>${seller.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Top Products</div>
              <div className="dashboard-card-subtitle">Best selling products this month</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {topProducts.map((product, index) => (
              <div key={product.name} className="dashboard-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="d-avatar">{index + 1}</div>
                  <div>
                    <div className="dashboard-list-primary">{product.name}</div>
                    <div className="dashboard-list-secondary">{product.sales} sales</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>${product.revenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#48a87c' }}>+{product.growth}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
