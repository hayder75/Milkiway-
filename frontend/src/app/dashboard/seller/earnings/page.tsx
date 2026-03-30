const earningsData = [
  { month: "March 2026", amount: 3500, deals: 5 },
  { month: "February 2026", amount: 2800, deals: 4 },
  { month: "January 2026", amount: 4200, deals: 6 },
  { month: "December 2025", amount: 2100, deals: 3 },
];

const payoutHistory = [
  { id: "1", amount: 2500, method: "Bank Transfer", status: "completed", date: "2026-03-15" },
  { id: "2", amount: 1800, method: "PayPal", status: "completed", date: "2026-02-28" },
  { id: "3", amount: 3200, method: "Bank Transfer", status: "completed", date: "2026-02-15" },
];

export default function SellerEarningsPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Earnings</h1>
          <p className="dashboard-page-subtitle">Track your earnings and commissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value-row">
            <span className="stat-value">$12,600</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-value-row">
            <span className="stat-value">$4,500</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month</div>
          <div className="stat-value-row">
            <span className="stat-value">$3,500</span>
            <span className="stat-badge">+12%</span>
          </div>
          <div className="stat-description">from last month</div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Monthly Earnings */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Monthly Earnings</div>
              <div className="dashboard-card-subtitle">Your earnings breakdown by month</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {earningsData.map((month) => (
              <div key={month.month} className="dashboard-list-item">
                <div>
                  <div className="dashboard-list-primary">{month.month}</div>
                  <div className="dashboard-list-secondary">{month.deals} deals</div>
                </div>
                <div style={{ fontWeight: 600, color: '#48a87c' }}>
                  +${month.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Payout History</div>
              <div className="dashboard-card-subtitle">Your recent payouts</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="dashboard-list-item">
                <div>
                  <div className="dashboard-list-primary">${payout.amount.toLocaleString()}</div>
                  <div className="dashboard-list-secondary">{payout.method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="d-badge d-badge-success">Completed</span>
                  <div className="dashboard-list-secondary" style={{ marginTop: '0.25rem' }}>{payout.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
