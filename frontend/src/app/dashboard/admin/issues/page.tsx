"use client";

import { useEffect, useState } from "react";
import api, { type IssueRecord } from "@/lib/api";

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<IssueRecord[]>([]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open": return "d-badge-warning";
      case "in_progress": return "d-badge-info";
      case "resolved": return "d-badge-success";
      case "closed": return "d-badge-neutral";
      default: return "d-badge-neutral";
    }
  };

  const loadIssues = async () => {
    const items = await api.issues.getAll();
    setIssues(items);
  };

  useEffect(() => {
    loadIssues().catch(() => setIssues([]));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await api.issues.update(id, { status });
    await loadIssues();
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
                <tr key={issue._id}>
                  <td style={{ fontWeight: 500 }}>{issue.title}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{issue.reporterName}</td>
                  <td><span className="d-badge d-badge-neutral">{issue.type}</span></td>
                  <td>
                    <span className={`d-badge ${getStatusClass(issue.status)}`}>
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="d-btn d-btn-sm" onClick={() => handleStatusChange(issue._id, issue.status === 'open' ? 'in_progress' : 'resolved')}>Advance</button>
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
