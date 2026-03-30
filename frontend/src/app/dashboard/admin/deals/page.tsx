import { deals } from "@/data/mockData";

export default function AdminDealsPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "d-badge-warning";
      case "approved": return "d-badge-info";
      case "rejected": return "d-badge-error";
      case "closed": return "d-badge-success";
      default: return "d-badge-neutral";
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Deal Management</h1>
          <p className="dashboard-page-subtitle">Review and manage all deals</p>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search deals..." />
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
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
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td style={{ fontWeight: 500 }}>{deal.productName}</td>
                  <td>
                    <div>{deal.clientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{deal.clientEmail}</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>${deal.value.toLocaleString()}</td>
                  <td style={{ color: '#48a87c', fontWeight: 500 }}>${deal.commission.toLocaleString()}</td>
                  <td>
                    <span className={`d-badge ${getStatusClass(deal.status)}`}>{deal.status}</span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{deal.createdAt}</td>
                  <td>
                    {deal.status === "pending" && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="d-btn d-btn-sm">✕</button>
                        <button className="d-btn d-btn-primary d-btn-sm">✓</button>
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
