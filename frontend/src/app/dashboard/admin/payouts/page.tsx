"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

interface PayoutRequest {
  _id: string;
  sellerId: string;
  amount: number;
  paymentMethod: string;
  note?: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
  seller: {
    _id: string;
    name: string;
    email: string;
    sellerId: string;
  };
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'admin') {
      router.push('/auth/login?redirect=/dashboard/admin/payouts');
      return;
    }

    loadPayouts();
  }, [router]);

  const loadPayouts = async () => {
    try {
      const data = await api.payouts.getAll();
      setPayouts(data);
    } catch (error) {
      console.error("Failed to load payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (payoutId: string, status: 'completed' | 'rejected') => {
    setProcessingId(payoutId);
    try {
      await api.payouts.updateStatus(payoutId, status);
      await loadPayouts();
    } catch (error) {
      console.error("Failed to update payout:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const completedPayouts = payouts.filter(p => p.status === 'completed');
  const rejectedPayouts = payouts.filter(p => p.status === 'rejected');

  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = completedPayouts.reduce((sum, p) => sum + p.amount, 0);

  const formatPaymentMethod = (method: string) => {
    const map: Record<string, string> = {
      telebirr: 'Telebirr',
      cbe: 'CBE',
      awash: 'Awash Bank',
      bank: 'Other Bank'
    };
    return map[method] || method;
  };

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
          <h1 className="dashboard-page-title">Payouts</h1>
          <p className="dashboard-page-subtitle">Manage seller payout requests</p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value-row">
            <span className="stat-value">${totalPending.toLocaleString()}</span>
            <span className="stat-badge stat-badge-warning">{pendingPayouts.length} pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Completed</div>
          <div className="stat-value-row">
            <span className="stat-value">${totalCompleted.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value-row">
            <span className="stat-value">{rejectedPayouts.length}</span>
          </div>
        </div>
      </div>

      {pendingPayouts.length > 0 && (
        <div className="mb-6">
          <h3 className="dashboard-section-title">Pending Requests</h3>
          <div className="space-y-3">
            {pendingPayouts.map((payout) => (
              <div key={payout._id} className="dashboard-card">
                <div className="dashboard-card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{payout.seller?.name}</div>
                      <div className="text-sm text-muted-foreground">{payout.seller?.email}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Amount: <span className="font-medium">${payout.amount.toLocaleString()}</span> via {formatPaymentMethod(payout.paymentMethod)}
                      </div>
                      {payout.note && (
                        <div className="text-sm text-muted-foreground mt-1 italic">Note: {payout.note}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Requested: {new Date(payout.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="d-btn d-btn-primary d-btn-sm"
                        onClick={() => handleStatusUpdate(payout._id, 'completed')}
                        disabled={processingId === payout._id}
                      >
                        {processingId === payout._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        className="d-btn d-btn-outline d-btn-sm"
                        onClick={() => handleStatusUpdate(payout._id, 'rejected')}
                        disabled={processingId === payout._id}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="dashboard-section-title">All Payout Requests</h3>
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          {payouts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No payout requests yet</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout._id}>
                    <td>
                      <div className="font-medium">{payout.seller?.name}</div>
                      <div className="text-xs text-muted-foreground">{payout.seller?.email}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>${payout.amount.toLocaleString()}</td>
                    <td>{formatPaymentMethod(payout.paymentMethod)}</td>
                    <td>
                      <span className={`d-badge ${
                        payout.status === 'pending' ? 'd-badge-warning' :
                        payout.status === 'completed' ? 'd-badge-success' :
                        'd-badge-neutral'
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}