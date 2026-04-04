"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type FeatureRequestRecord, type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";

export default function SellerFeaturesPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerRecord | null>(null);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequestRecord[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const storedSeller = getStoredSeller();
    if (!storedSeller) {
      router.push('/auth/login?redirect=/dashboard/seller/features');
      return;
    }
    setSeller(storedSeller);
    loadFeatures().catch(() => setFeatureRequests([]));
  }, [router]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await api.features.create({
      title: form.title,
      description: form.description,
      sellerId: seller?.sellerId,
      requestedBy: seller?.name,
    });

    setForm({ title: "", description: "" });
    await loadFeatures();
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Feature Requests</h1>
          <p className="dashboard-page-subtitle">Suggest new features and vote on others</p>
        </div>
      </div>

      <form className="dashboard-card" style={{ marginBottom: '1rem' }} onSubmit={handleSubmit}>
        <div className="dashboard-card-body" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 3fr auto' }}>
          <input className="dashboard-search-input" placeholder="Feature title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <input className="dashboard-search-input" placeholder="Describe the feature" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
          <button className="d-btn d-btn-primary" type="submit">+ Suggest Feature</button>
        </div>
      </form>

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
