"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredSeller } from "@/lib/session";

export default function CustomerSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'customer') {
      router.push('/auth/login?redirect=/dashboard/customer/support');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    // Simulate submission - in production, would call API
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                Subject
              </label>
              <input
                type="text"
                className="dashboard-search-input"
                style={{ maxWidth: '100%' }}
                placeholder="Brief description of your issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                Message
              </label>
              <textarea
                className="dashboard-search-input"
                style={{ maxWidth: '100%', minHeight: '100px', resize: 'vertical' }}
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="d-btn d-btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
              {success && (
                <span style={{ marginLeft: '1rem', color: 'green', fontSize: '0.9rem' }}>
                  Ticket submitted successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Existing Tickets */}
      <h3 className="dashboard-section-title">Your Tickets</h3>
      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="dashboard-card-body">
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            No support tickets yet - submit one above
          </div>
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
