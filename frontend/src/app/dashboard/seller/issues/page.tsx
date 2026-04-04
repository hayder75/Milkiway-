"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type IssueRecord, type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";

export default function SellerIssuesPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerRecord | null>(null);
  const [reportedIssues, setReportedIssues] = useState<IssueRecord[]>([]);
  const [form, setForm] = useState({ title: "", description: "", type: "bug" });

  useEffect(() => {
    const storedSeller = getStoredSeller();
    if (!storedSeller) {
      router.push('/auth/login?redirect=/dashboard/seller/issues');
      return;
    }
    setSeller(storedSeller);
    loadIssues().catch(() => setReportedIssues([]));
  }, [router]);

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
    setReportedIssues(items);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await api.issues.create({
      title: form.title,
      description: form.description,
      type: form.type,
      sellerId: seller?.sellerId,
      reporterName: seller?.name,
    });

    setForm({ title: "", description: "", type: "bug" });
    await loadIssues();
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Report Issues</h1>
          <p className="dashboard-page-subtitle">Report bugs and issues you&apos;ve encountered</p>
        </div>
      </div>

      <form className="dashboard-card" style={{ marginBottom: '1rem' }} onSubmit={handleSubmit}>
        <div className="dashboard-card-body" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr 3fr auto' }}>
          <input className="dashboard-search-input" placeholder="Issue title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <select className="dashboard-search-input" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
            <option value="bug">Bug</option>
            <option value="complaint">Complaint</option>
            <option value="request">Request</option>
          </select>
          <input className="dashboard-search-input" placeholder="Describe the issue" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <button className="d-btn d-btn-primary" type="submit">+ Report Issue</button>
        </div>
      </form>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card-body">
          {reportedIssues.length > 0 ? (
            reportedIssues.map((issue) => (
              <div key={issue._id} className="dashboard-list-item">
                <div>
                  <div className="dashboard-list-primary">{issue.title}</div>
                  <div className="dashboard-list-secondary">
                    {issue.type} — Reported on {new Date(issue.createdAt).toLocaleDateString()}
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
