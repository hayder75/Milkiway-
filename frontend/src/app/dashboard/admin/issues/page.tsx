const issues = [
  { id: "1", title: "Login page not loading", reporter: "John Smith", type: "bug", status: "open", date: "2026-03-25" },
  { id: "2", title: "Payment processing delay", reporter: "Sarah Johnson", type: "complaint", status: "in_progress", date: "2026-03-20" },
];

export default function AdminIssuesPage() {
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
          <h1 className="dashboard-page-title">Issues</h1>
          <p className="dashboard-page-subtitle">Review reported issues and bugs</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Reporter</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td style={{ fontWeight: 500 }}>{issue.title}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{issue.reporter}</td>
                  <td><span className="d-badge d-badge-neutral">{issue.type}</span></td>
                  <td>
                    <span className={`d-badge ${getStatusClass(issue.status)}`}>
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{issue.date}</td>
                  <td>
                    <button className="d-btn d-btn-sm">View</button>
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
