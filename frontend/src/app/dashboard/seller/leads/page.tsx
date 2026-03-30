"use client";

import { useState } from "react";
import { leads } from "@/data/mockData";

export default function SellerLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusClass = (status: string) => {
    switch (status) {
      case "new": return "d-badge-neutral";
      case "interested": return "d-badge-info";
      case "negotiating": return "d-badge-warning";
      case "closed": return "d-badge-success";
      default: return "d-badge-neutral";
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Leads</h1>
          <p className="dashboard-page-subtitle">Manage your leads and track their status</p>
        </div>
        <button className="d-btn d-btn-primary">+ Add Lead</button>
      </div>

      <div className="dashboard-search">
        <input
          type="text"
          className="dashboard-search-input"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="dashboard-search-input" style={{ maxWidth: '160px' }}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="interested">Interested</option>
          <option value="negotiating">Negotiating</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 500 }}>{lead.company}</td>
                  <td>{lead.name}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{lead.email}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{lead.phone}</td>
                  <td>
                    <span className={`d-badge ${getStatusClass(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
