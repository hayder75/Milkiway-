import { featureRequests } from "@/data/mockData";

export default function SellerFeaturesPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "d-badge-neutral";
      case "approved": return "d-badge-info";
      case "in_progress": return "d-badge-warning";
      case "completed": return "d-badge-success";
      default: return "d-badge-neutral";
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Feature Requests</h1>
          <p className="dashboard-page-subtitle">Suggest new features and vote on others</p>
        </div>
        <button className="d-btn d-btn-primary">+ Suggest Feature</button>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Votes</th>
                <th>Requested By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {featureRequests.map((feature) => (
                <tr key={feature.id}>
                  <td>
                    <div className="dashboard-list-primary">{feature.title}</div>
                    <div className="dashboard-list-secondary">{feature.description}</div>
                  </td>
                  <td>
                    <span className={`d-badge ${getStatusClass(feature.status)}`}>
                      {feature.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{feature.votes}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{feature.requestedBy}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{feature.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body-padded">
          <div className="dashboard-list-primary" style={{ marginBottom: '0.35rem' }}>Earn Rewards for Suggestions</div>
          <div className="dashboard-list-secondary">
            When your suggested feature is built and released, you&apos;ll receive a bonus commission as a thank you for helping improve our products.
          </div>
        </div>
      </div>
    </div>
  );
}
