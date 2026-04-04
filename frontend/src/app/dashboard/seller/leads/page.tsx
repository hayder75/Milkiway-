"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type ContactRecord, type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";

export default function SellerLeadsPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerRecord | null>(null);
  const [leads, setLeads] = useState<ContactRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", systemName: "", message: "" });

  useEffect(() => {
    const storedSeller = getStoredSeller();
    if (!storedSeller) {
      router.push('/auth/login?redirect=/dashboard/seller/leads');
      return;
    }
    setSeller(storedSeller);
    loadLeads(storedSeller.sellerId).catch(() => setLeads([]));
  }, [router]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "new": return "d-badge-neutral";
      case "contacted": return "d-badge-info";
      case "completed": return "d-badge-success";
      case "archived": return "d-badge-warning";
      default: return "d-badge-neutral";
    }
  };

  const loadLeads = async (sellerId: string) => {
    const items = await api.contacts.getBySeller(sellerId);
    setLeads(items);
  };

  const filteredLeads = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return leads.filter((lead) => {
      return lead.name.toLowerCase().includes(query)
        || (lead.email || "").toLowerCase().includes(query)
        || (lead.systemName || "").toLowerCase().includes(query);
    });
  }, [leads, searchTerm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!seller) {
      setMessage("Please sign in as a seller first");
      return;
    }

    try {
      await api.contacts.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        systemName: form.systemName,
        message: form.message,
        sellerId: seller.sellerId,
      });
      setMessage("Lead added successfully");
      setForm({ name: "", email: "", phone: "", systemName: "", message: "" });
      await loadLeads(seller.sellerId);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to add lead");
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Leads</h1>
          <p className="dashboard-page-subtitle">Manage your leads and track their status</p>
        </div>
      </div>

      {message ? <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div> : null}

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Lead</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="dashboard-search-input" placeholder="Contact name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} required />
          <input className="dashboard-search-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} required />
          <input className="dashboard-search-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} required />
          <input className="dashboard-search-input" placeholder="Interested product" value={form.systemName} onChange={(e) => setForm((current) => ({ ...current, systemName: e.target.value }))} />
          <input className="dashboard-search-input" placeholder="Notes" value={form.message} onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))} />
          <button className="d-btn d-btn-primary" type="submit">+ Add Lead</button>
        </div>
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
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
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
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td style={{ fontWeight: 500 }}>{lead.systemName || 'General inquiry'}</td>
                  <td>{lead.name}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{lead.email}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{lead.phone}</td>
                  <td>
                    <span className={`d-badge ${getStatusClass(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
