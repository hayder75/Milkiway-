'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import api from "@/lib/api";
import { 
  DollarSign, 
  ShoppingCart,
  ArrowRight,
  Clock,
  UserPlus,
  Gift,
  Bug
} from "lucide-react";

interface Seller {
  _id: string;
  sellerId: string;
  name: string;
  email: string;
  commissionRate: number;
  totalSales: number;
  totalEarnings: number;
  status: string;
}

interface Sale {
  _id: string;
  saleId: string;
  systemName: string;
  buyerName: string;
  salePrice: number;
  commissionAmount: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalSales: number;
  totalRevenue: number;
  totalEarnings: number;
  commissionRate: number;
  pendingSales: number;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSeller = localStorage.getItem('seller');
    if (!storedSeller) {
      router.push('/auth/login');
      return;
    }
    
    const sellerData: Seller = JSON.parse(storedSeller);
    setSeller(sellerData);

    const fetchData = async () => {
      try {
        const [salesData, statsData] = await Promise.all([
          api.sales.getBySeller(sellerData.sellerId),
          api.sales.getStats(sellerData.sellerId),
        ]);
        setSales(salesData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !seller) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {seller.name}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your sales today.</p>
        </div>
        <Link href="/dashboard/seller/deals">
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-semibold mt-1">{stats?.totalSales || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-semibold mt-1">${(stats?.totalEarnings || 0).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Deals</p>
                <p className="text-2xl font-semibold mt-1">{stats?.pendingSales || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="text-2xl font-semibold mt-1">{seller.commissionRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Sales</CardTitle>
            <Link href="/dashboard/seller/deals">
              <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sales yet. Start selling to earn commissions!</p>
            ) : (
              <div className="space-y-4">
                {sales.slice(0, 4).map((deal) => (
                  <div key={deal._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{deal.buyerName}</p>
                      <p className="text-sm text-muted-foreground">{deal.systemName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={deal.status === "confirmed" ? "default" : "secondary"}>
                        {deal.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${deal.salePrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Your Seller Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Seller ID</span>
                <span className="font-medium">{seller.sellerId}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{seller.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={seller.status === 'active' ? 'default' : 'secondary'}>
                  {seller.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium">${(stats?.totalRevenue || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/seller/leads">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <UserPlus className="w-5 h-5" />
              <span className="text-sm">Add Lead</span>
            </Button>
          </Link>
          <Link href="/dashboard/seller/deals">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Submit Deal</span>
            </Button>
          </Link>
          <Link href="/dashboard/seller/features">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm">Request Feature</span>
            </Button>
          </Link>
          <Link href="/dashboard/seller/issues">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Bug className="w-5 h-5" />
              <span className="text-sm">Report Issue</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
