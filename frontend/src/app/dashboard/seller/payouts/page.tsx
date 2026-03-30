const payoutRequests = [
  { id: "1", amount: 1500, status: "pending", requestDate: "2026-03-28", method: "Bank Transfer" },
];

const payoutHistory = [
  { id: "1", amount: 2500, method: "Bank Transfer", status: "completed", date: "2026-03-15" },
  { id: "2", amount: 1800, method: "PayPal", status: "completed", date: "2026-02-28" },
  { id: "3", amount: 3200, method: "Bank Transfer", status: "completed", date: "2026-02-15" },
  { id: "4", amount: 1500, method: "PayPal", status: "completed", date: "2026-01-30" },
];

export default function SellerPayoutsPage() {
  const availableBalance = 4500;

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Payouts</h1>
          <p className="dashboard-page-subtitle">Request and track your payouts</p>
        </div>
        <button className="d-btn d-btn-primary">Request Payout</button>
      </div>

      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-value-row">
            <span className="stat-value">${availableBalance.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value-row">
            <span className="stat-value">$1,500</span>
            <span className="stat-badge stat-badge-warning">pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Paid</div>
          <div className="stat-value-row">
            <span className="stat-value">$9,000</span>
          </div>
        </div>
      </div>

      {payoutRequests.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="dashboard-section-title">Pending Payouts</h3>
          <div className="dashboard-card">
            <div className="dashboard-card-body">
              {payoutRequests.map((payout) => (
                <div key={payout.id} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-primary">${payout.amount.toLocaleString()}</div>
                    <div className="dashboard-list-secondary">{payout.method} — Requested {payout.requestDate}</div>
                  </div>
                  <span className="d-badge d-badge-warning">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <h3 className="dashboard-section-title">Payout History</h3>
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id}>
                  <td style={{ fontWeight: 500 }}>${payout.amount.toLocaleString()}</td>
                  <td>{payout.method}</td>
                  <td><span className="d-badge d-badge-success">Completed</span></td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{payout.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
