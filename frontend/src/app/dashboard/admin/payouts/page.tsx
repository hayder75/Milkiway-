const payouts = [
  { id: "1", seller: "John Smith", amount: 2500, method: "Bank Transfer", status: "completed", date: "2026-03-15" },
  { id: "2", seller: "Sarah Johnson", amount: 1800, method: "PayPal", status: "completed", date: "2026-02-28" },
  { id: "3", seller: "Mike Davis", amount: 3200, method: "Bank Transfer", status: "pending", date: "2026-03-28" },
];

export default function AdminPayoutsPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Payouts</h1>
          <p className="dashboard-page-subtitle">Manage seller payouts</p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Total Paid</div>
          <div className="stat-value-row">
            <span className="stat-value">$45,000</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value-row">
            <span className="stat-value">$3,200</span>
            <span className="stat-badge stat-badge-warning">1 pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month</div>
          <div className="stat-value-row">
            <span className="stat-value">$5,700</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td style={{ fontWeight: 500 }}>{payout.seller}</td>
                  <td style={{ fontWeight: 500 }}>${payout.amount.toLocaleString()}</td>
                  <td>{payout.method}</td>
                  <td>
                    <span className={`d-badge ${payout.status === "completed" ? "d-badge-success" : "d-badge-warning"}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{payout.date}</td>
                  <td>
                    {payout.status === "pending" && (
                      <button className="d-btn d-btn-primary d-btn-sm">Process</button>
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
