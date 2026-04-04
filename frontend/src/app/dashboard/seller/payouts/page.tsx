"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type SalesStats, type SaleRecord, type PayoutRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

interface PaymentMethods {
  bank?: { enabled: boolean; bankName?: string; accountName?: string; accountNumber?: string };
  telebirr?: { enabled: boolean; phoneNumber?: string };
  cbe?: { enabled: boolean; accountNumber?: string; accountName?: string };
  awash?: { enabled: boolean; accountNumber?: string; accountName?: string };
}

export default function SellerPayoutsPage() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestMethod, setRequestMethod] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [requestError, setRequestError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller || seller.role !== 'seller') {
      router.push('/auth/login?redirect=/dashboard/seller/payouts');
      return;
    }

    const loadData = async () => {
      try {
        const [statsData, salesData, payoutsData, methodsData] = await Promise.all([
          api.sales.getStats(seller.sellerId),
          api.sales.getBySeller(seller.sellerId),
          api.payouts.getBySeller(seller.sellerId),
          api.sellerProfile.getPaymentMethods(seller.sellerId)
        ]);
        setStats(statsData);
        setSales(salesData);
        setPayouts(payoutsData as PayoutRecord[]);
        setPaymentMethods(methodsData as PaymentMethods);
      } catch (error) {
        console.error("Failed to load payouts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const confirmedSales = sales.filter(s => s.status === 'confirmed');
  const pendingSales = sales.filter(s => s.status === 'pending');
  const totalPaid = confirmedSales.reduce((sum, s) => sum + s.commissionAmount, 0);

  const availableMethods = paymentMethods ? Object.entries(paymentMethods)
    .filter(([_, m]) => m?.enabled)
    .map(([key]) => {
      const map: Record<string, string> = {
        telebirr: 'Telebirr',
        cbe: 'CBE',
        awash: 'Awash Bank',
        bank: 'Other Bank'
      };
      return { key, label: map[key] || key };
    }) : [];

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const seller = getStoredSeller();
    if (!seller) return;

    setRequesting(true);
    setRequestError("");

    try {
      await api.payouts.create({
        sellerId: seller.sellerId,
        amount: Number(requestAmount),
        paymentMethod: requestMethod,
        note: requestNote || undefined
      });
      
      const payoutsData = await api.payouts.getBySeller(seller.sellerId);
      setPayouts(payoutsData as PayoutRecord[]);
      setShowRequestModal(false);
      setRequestAmount("");
      setRequestMethod("");
      setRequestNote("");
    } catch (error: any) {
      setRequestError(error.message || "Failed to create payout request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const canRequest = stats && stats.totalEarnings > 0 && availableMethods.length > 0;

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Payouts</h1>
          <p className="dashboard-page-subtitle">Request and track your payouts</p>
        </div>
        <button 
          className="d-btn d-btn-primary" 
          disabled={!canRequest}
          onClick={() => setShowRequestModal(true)}
        >
          Request Payout
        </button>
      </div>

      {!canRequest && stats && stats.totalEarnings > 0 && availableMethods.length === 0 && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-4">
          <p className="text-yellow-800">
            Please configure your payment methods in <a href="/dashboard/seller/profile" className="underline font-medium">Profile</a> before requesting a payout.
          </p>
        </div>
      )}

      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-value-row">
            <span className="stat-value">${(stats?.totalEarnings || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Sales</div>
          <div className="stat-value-row">
            <span className="stat-value">{stats?.pendingSales || 0}</span>
            <span className="stat-badge stat-badge-warning">pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Paid</div>
          <div className="stat-value-row">
            <span className="stat-value">${totalPaid.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {payouts.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="dashboard-section-title">Payout Requests</h3>
          <div className="dashboard-card">
            <div className="dashboard-card-body">
              {payouts.map((payout) => (
                <div key={payout._id} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-primary">${payout.amount.toLocaleString()}</div>
                    <div className="dashboard-list-secondary">
                      {payout.paymentMethod} — {new Date(payout.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`d-badge ${
                    payout.status === 'pending' ? 'd-badge-warning' :
                    payout.status === 'completed' ? 'd-badge-success' :
                    'd-badge-neutral'
                  }`}>
                    {payout.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pendingSales.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 className="dashboard-section-title">Pending Sales (Not yet paid out)</h3>
          <div className="dashboard-card">
            <div className="dashboard-card-body">
              {pendingSales.map((sale) => (
                <div key={sale._id} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-primary">{sale.systemName}</div>
                    <div className="dashboard-list-secondary">
                      {new Date(sale.createdAt).toLocaleDateString()} — ${sale.commissionAmount.toLocaleString()} commission
                    </div>
                  </div>
                  <span className="d-badge d-badge-warning">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <h3 className="dashboard-section-title">Sales History</h3>
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          {sales.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No sales yet</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.systemName}</td>
                    <td>{sale.buyerName}</td>
                    <td style={{ fontWeight: 500 }}>${sale.salePrice.toLocaleString()}</td>
                    <td>${sale.commissionAmount.toLocaleString()}</td>
                    <td>
                      <span className={`d-badge ${sale.status === 'confirmed' ? 'd-badge-success' : 'd-badge-warning'}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md border">
            <h2 className="text-xl font-semibold mb-4">Request Payout</h2>
            <form onSubmit={handleRequestPayout}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    className="dashboard-search-input w-full"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    min={1}
                    max={stats?.totalEarnings}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: ${(stats?.totalEarnings || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    className="dashboard-search-input w-full"
                    value={requestMethod}
                    onChange={(e) => setRequestMethod(e.target.value)}
                    required
                  >
                    <option value="">Select method</option>
                    {availableMethods.map((m) => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note (optional)</label>
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="Optional note"
                  />
                </div>
                {requestError && (
                  <p className="text-red-500 text-sm">{requestError}</p>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  className="d-btn d-btn-outline flex-1"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="d-btn d-btn-primary flex-1"
                  disabled={requesting}
                >
                  {requesting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}