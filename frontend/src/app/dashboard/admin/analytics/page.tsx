"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type SaleRecord, type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

export default function AdminAnalyticsPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [sellers, setSellers] = useState<SellerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'admin') {
      router.push('/auth/login?redirect=/dashboard/admin/analytics');
      return;
    }

    const loadData = async () => {
      try {
        const [salesData, sellersData] = await Promise.all([
          api.sales.getAll(),
          api.sellers.getAll()
        ]);
        setSales(salesData);
        setSellers(sellersData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0);
  const totalSales = sales.length;
  const confirmedSales = sales.filter(s => s.status === 'confirmed');
  const activeSellers = sellers.filter(s => s.status === 'active').length;
  
  const sellerStats = sellers.map(seller => {
    const sellerSales = sales.filter(s => s.sellerId === seller.id);
    const sellerRevenue = sellerSales.reduce((sum, s) => sum + s.salePrice, 0);
    return {
      ...seller,
      salesCount: sellerSales.length,
      revenue: sellerRevenue
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const productStats = sales.reduce((acc, sale) => {
    if (!acc[sale.systemName]) {
      acc[sale.systemName] = { sales: 0, revenue: 0 };
    }
    acc[sale.systemName].sales += 1;
    acc[sale.systemName].revenue += sale.salePrice;
    return acc;
  }, {} as Record<string, { sales: number; revenue: number }>);

  const topProducts = Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

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
          <h1 className="dashboard-page-title">Analytics</h1>
          <p className="dashboard-page-subtitle">Platform performance and insights</p>
        </div>
      </div>

      <div className="dashboard-stats dashboard-stats-4">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value-row">
            <span className="stat-value">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="stat-description">All time revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sales</div>
          <div className="stat-value-row">
            <span className="stat-value">{totalSales}</span>
          </div>
          <div className="stat-description">All time sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Sellers</div>
          <div className="stat-value-row">
            <span className="stat-value">{activeSellers}</span>
          </div>
          <div className="stat-description">Total sellers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value-row">
            <span className="stat-value">{confirmedSales.length > 0 ? Math.round((confirmedSales.length / totalSales) * 100) : 0}%</span>
          </div>
          <div className="stat-description">Confirmed sales rate</div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Top Sellers */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Top Sellers</div>
              <div className="dashboard-card-subtitle">Best performing sellers</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {sellerStats.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sellers yet</p>
            ) : (
              sellerStats.map((seller, index) => (
                <div key={seller._id} className="dashboard-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="d-avatar">{index + 1}</div>
                    <div>
                      <div className="dashboard-list-primary">{seller.name}</div>
                      <div className="dashboard-list-secondary">{seller.salesCount} sales</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>${seller.revenue.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <div className="dashboard-card-title">Top Products</div>
              <div className="dashboard-card-subtitle">Best selling products</div>
            </div>
          </div>
          <div className="dashboard-card-body">
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No products yet</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.name} className="dashboard-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="d-avatar">{index + 1}</div>
                    <div>
                      <div className="dashboard-list-primary">{product.name}</div>
                      <div className="dashboard-list-secondary">{product.sales} sales</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>${product.revenue.toLocaleString()}</div>
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
