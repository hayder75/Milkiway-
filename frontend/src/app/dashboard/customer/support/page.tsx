"use client";

import { useState } from "react";

const tickets = [
  { id: "1", subject: "Need help with API integration", status: "open", date: "2026-03-25" },
];

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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
          <h1 className="dashboard-page-title">Support</h1>
          <p className="dashboard-page-subtitle">Get help with your products</p>
        </div>
      </div>

      {/* New Ticket */}
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">Submit a Ticket</div>
        </div>
        <div className="dashboard-card-body-padded">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--foreground)' }}>
                Subject
              </label>
              <input
                type="text"
                className="dashboard-search-input"
                style={{ maxWidth: '100%' }}
                placeholder="Brief description of your issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.35rem', color: 'var(--foreground)' }}>
                Message
              </label>
              <textarea
                className="dashboard-search-input"
                style={{ maxWidth: '100%', minHeight: '100px', resize: 'vertical' }}
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div>
              <button className="d-btn d-btn-primary">Submit Ticket</button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Tickets */}
      <h3 className="dashboard-section-title">Your Tickets</h3>
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="dashboard-card-body">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} className="dashboard-list-item">
                <div>
                  <div className="dashboard-list-primary">{ticket.subject}</div>
                  <div className="dashboard-list-secondary">Created on {ticket.date}</div>
                </div>
                <span className={`d-badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem' }}>
              No support tickets yet
            </div>
          )}
        </div>
      </div>

      {/* Contact Options */}
      <h3 className="dashboard-section-title">Other Ways to Reach Us</h3>
      <div className="dashboard-card">
        <div className="dashboard-card-body-padded">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <div className="dashboard-list-primary">Live Chat</div>
              <div className="dashboard-list-secondary">Available 24/7</div>
            </div>
            <div>
              <div className="dashboard-list-primary">Email</div>
              <div className="dashboard-list-secondary">support@milkyway.com</div>
            </div>
            <div>
              <div className="dashboard-list-primary">Phone</div>
              <div className="dashboard-list-secondary">+1 234 567 8900</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
