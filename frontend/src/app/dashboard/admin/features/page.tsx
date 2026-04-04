"use client";

import { useEffect, useState } from "react";
import api, { type FeatureRequestRecord } from "@/lib/api";

export default function AdminFeaturesPage() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequestRecord[]>([]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "d-badge-neutral";
      case "approved": return "d-badge-info";
      case "in_progress": return "d-badge-warning";
      case "completed": return "d-badge-success";
      default: return "d-badge-neutral";
    }
  };

  const loadFeatures = async () => {
    const features = await api.features.getAll();
    setFeatureRequests(features);
  };

  useEffect(() => {
    loadFeatures().catch(() => setFeatureRequests([]));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await api.features.update(id, { status });
    await loadFeatures();
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Feature Requests</h1>
          <p className="dashboard-page-subtitle">Review and manage feature requests from sellers</p>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Status</th>
                <th>Votes</th>
                <th>Requested By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {featureRequests.map((feature) => (
                <tr key={feature._id}>
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
                  <td style={{ color: 'var(--muted-foreground)' }}>{new Date(feature.createdAt).toLocaleDateString()}</td>
                  <td>
                    {feature.status === "pending" && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="d-btn d-btn-sm" onClick={() => handleStatusChange(feature._id, "completed")}>Complete</button>
                        <button className="d-btn d-btn-primary d-btn-sm" onClick={() => handleStatusChange(feature._id, "approved")}>Approve</button>
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
