"use client";

import { useState } from "react";
import { deals, products } from "@/data/mockData";
import Link from "next/link";

export default function SellerDealsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
          <h1 className="dashboard-page-title">Deals</h1>
          <p className="dashboard-page-subtitle">Submit and track your deals</p>
        </div>
        <button className="d-btn d-btn-primary">+ Submit Deal</button>
      </div>

      <div className="dashboard-search">
        <input
          type="text"
          className="dashboard-search-input"
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td>
                    <span style={{ fontWeight: 500 }}>{deal.productName}</span>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
