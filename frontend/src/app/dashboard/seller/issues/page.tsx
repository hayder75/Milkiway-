const reportedIssues = [
  { id: "1", title: "Login page not loading", type: "bug", status: "open", createdAt: "2026-03-25" },
];

export default function SellerIssuesPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "open": return "d-badge-warning";
      case "in_progress": return "d-badge-info";
      case "resolved": return "d-badge-success";
      case "closed": return "d-badge-neutral";
      default: return "d-badge-neutral";
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Report Issues</h1>
          <p className="dashboard-page-subtitle">Report bugs and issues you&apos;ve encountered</p>
        </div>
        <button className="d-btn d-btn-primary">+ Report Issue</button>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card-body">
          {reportedIssues.length > 0 ? (
            reportedIssues.map((issue) => (
              <div key={issue.id} className="dashboard-list-item">
                <div>
                  <div className="dashboard-list-primary">{issue.title}</div>
                  <div className="dashboard-list-secondary">
                    {issue.type} — Reported on {issue.createdAt}
                  </div>
                </div>
                <span className={`d-badge ${getStatusClass(issue.status)}`}>{issue.status}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="dashboard-list-primary" style={{ marginBottom: '0.5rem' }}>No issues reported</div>
              <div className="dashboard-list-secondary">If you&apos;ve encountered any issues, please let us know.</div>
            </div>
          )}
        </div>
      </div>

      <h3 className="dashboard-section-title">Need More Help?</h3>
      <div className="dashboard-card">
        <div className="dashboard-card-body-padded">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <div className="dashboard-list-primary">Live Chat</div>
              <div className="dashboard-list-secondary">Available 24/7</div>
            </div>
            <div>
              <div className="dashboard-list-primary">Email Support</div>
              <div className="dashboard-list-secondary">support@milkyway.com</div>
            </div>
            <div>
              <div className="dashboard-list-primary">Phone Support</div>
              <div className="dashboard-list-secondary">+1 234 567 8900</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
