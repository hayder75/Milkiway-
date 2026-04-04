"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type SalesStats, type SaleRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

export default function SellerEarningsPage() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller || seller.role !== 'seller') {
      router.push('/auth/login?redirect=/dashboard/seller/earnings');
      return;
    }

    const loadData = async () => {
      try {
        const [statsData, salesData] = await Promise.all([
          api.sales.getStats(seller.sellerId),
          api.sales.getBySeller(seller.sellerId)
        ]);
        setStats(statsData);
        setSales(salesData);
      } catch (error) {
        console.error("Failed to load earnings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const confirmedSales = sales.filter(s => s.status === 'confirmed');
  const pendingSales = sales.filter(s => s.status === 'pending');

  const monthlyEarnings = confirmedSales.reduce((acc, sale) => {
    const month = new Date(sale.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { amount: 0, deals: 0 };
    }
    acc[month].amount += sale.commissionAmount;
    acc[month].deals += 1;
    return acc;
  }, {} as Record<string, { amount: number; deals: number }>);

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
          <h1 className="dashboard-page-title">Earnings</h1>
          <p className="dashboard-page-subtitle">Track your earnings and commissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats dashboard-stats-3">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value-row">
            <span className="stat-value">${(stats?.totalEarnings || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Balance</div>
          <div className="stat-value-row">
            <span className="stat-value">${(stats?.totalEarnings || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month</div>
          <div className="stat-value-row">
            <span className="stat-value">${(stats?.totalEarnings || 0).toLocaleString()}</span>
          </div>
          <div className="stat-description">Total earnings</div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Monthly Earnings */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Monthly Earnings</div>
              <div className="dashboard-card-subtitle">Your earnings breakdown by month</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {Object.keys(monthlyEarnings).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No earnings yet</p>
            ) : (
              Object.entries(monthlyEarnings).map(([month, data]) => (
                <div key={month} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-primary">{month}</div>
                    <div className="dashboard-list-secondary">{data.deals} deals</div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#48a87c' }}>
                    +${data.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Recent Sales</div>
              <div className="dashboard-card-subtitle">Your recent transactions</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {sales.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sales yet</p>
            ) : (
              sales.slice(0, 5).map((sale) => (
                <div key={sale._id} className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-primary">{sale.systemName}</div>
                    <div className="dashboard-list-secondary">{sale.buyerName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`d-badge ${sale.status === 'confirmed' ? 'd-badge-success' : sale.status === 'pending' ? 'd-badge-warning' : 'd-badge-neutral'}`}>
                      {sale.status}
                    </span>
                    <div className="dashboard-list-secondary" style={{ marginTop: '0.25rem' }}>
                      ${sale.commissionAmount.toLocaleString()} commission
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
