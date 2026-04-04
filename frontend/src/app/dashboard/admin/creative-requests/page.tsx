"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type CreativeRequestRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";
import { Phone, Mail, Building, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminCreativeRequestsPage() {
  const [requests, setRequests] = useState<CreativeRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'admin') {
      router.push('/auth/login?redirect=/dashboard/admin/creative-requests');
      return;
    }

    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    try {
      const data = await api.creativeRequests.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.creativeRequests.updateStatus(id, status);
      await loadRequests();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await api.creativeRequests.delete(id);
      await loadRequests();
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="d-badge d-badge-warning">New</span>;
      case 'contacted':
        return <span className="d-badge d-badge-info">Contacted</span>;
      case 'completed':
        return <span className="d-badge d-badge-success">Completed</span>;
      case 'cancelled':
        return <span className="d-badge d-badge-neutral">Cancelled</span>;
      default:
        return <span className="d-badge d-badge-neutral">{status}</span>;
    }
  };

  const newRequests = requests.filter(r => r.status === 'new');
  const otherRequests = requests.filter(r => r.status !== 'new');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Creative Requests</h1>
          <p className="dashboard-page-subtitle">Manage project requests from Creative Studio</p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-stats-4">
        <div className="stat-card">
          <div className="stat-label">Total Requests</div>
          <div className="stat-value-row">
            <span className="stat-value">{requests.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New</div>
          <div className="stat-value-row">
            <span className="stat-value">{newRequests.length}</span>
            <span className="stat-badge stat-badge-warning">{newRequests.length > 0 ? 'needs review' : 'none'}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Contacted</div>
          <div className="stat-value-row">
            <span className="stat-value">{requests.filter(r => r.status === 'contacted').length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value-row">
            <span className="stat-value">{requests.filter(r => r.status === 'completed').length}</span>
          </div>
        </div>
      </div>

      {newRequests.length > 0 && (
        <div className="mb-8">
          <h3 className="dashboard-section-title">New Requests</h3>
          <div className="space-y-4">
            {newRequests.map((request) => (
              <div key={request._id} className="dashboard-card border-l-4 border-l-[#FFCC00]">
                <div className="dashboard-card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="font-semibold text-lg">{request.name}</h4>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{request.phone}</span>
                        </div>
                        {request.companyName && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{request.companyName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{request.projectType}</span>
                        </div>
                      </div>
                      {request.budget && (
                        <p className="text-sm text-muted-foreground mt-2">Budget: {request.budget}</p>
                      )}
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{request.description}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="d-btn d-btn-primary d-btn-sm"
                        onClick={() => handleStatusChange(request._id, 'contacted')}
                      >
                        Mark Contacted
                      </button>
                      <button
                        className="d-btn d-btn-sm d-btn-ghost text-red-500"
                        onClick={() => handleDelete(request._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="dashboard-section-title">All Requests</h3>
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No creative requests yet</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Project Type</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <div className="font-medium">{request.name}</div>
                        {request.companyName && (
                          <div className="text-xs text-muted-foreground">{request.companyName}</div>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">{request.email}</div>
                        <div className="text-xs text-muted-foreground">{request.phone}</div>
                      </td>
                      <td>{request.projectType}</td>
                      <td>{request.budget || '-'}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          {request.status === 'new' && (
                            <button
                              className="d-btn d-btn-sm d-btn-outline"
                              onClick={() => handleStatusChange(request._id, 'contacted')}
                            >
                              Contact
                            </button>
                          )}
                          {request.status === 'contacted' && (
                            <button
                              className="d-btn d-btn-sm d-btn-primary"
                              onClick={() => handleStatusChange(request._id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="d-btn d-btn-sm d-btn-ghost text-red-500"
                            onClick={() => handleDelete(request._id)}
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}