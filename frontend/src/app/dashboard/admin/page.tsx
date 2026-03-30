'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { 
  DollarSign, 
  Users, 
  ShoppingCart,
  Package,
  ArrowRight,
  Check,
  X
} from "lucide-react";

interface Seller {
  _id: string;
  sellerId: string;
  name: string;
  email: string;
  status: string;
  totalSales: number;
  totalEarnings: number;
  createdAt: string;
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

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellersData, salesData, contactsData] = await Promise.all([
          api.sellers.getAll(),
          api.sales.getAll(),
          api.contacts.getAll(),
        ]);
        setSellers(sellersData);
        setSales(salesData);
        setContacts(contactsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingDeals = sales.filter(s => s.status === 'pending');
  const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0);
  const totalEarnings = sales.reduce((sum, s) => sum + s.commissionAmount, 0);
  const activeSellers = sellers.filter(s => s.status === 'active').length;

  if (loading) {
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
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform&apos;s performance</p>
        </div>
        <Link href="/dashboard/admin/deals">
          <Button>Review Deals</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-semibold mt-1">${totalRevenue.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Active Sellers</p>
                <p className="text-2xl font-semibold mt-1">{activeSellers}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-semibold mt-1">{sales.length}</p>
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
                <p className="text-sm text-muted-foreground">New Inquiries</p>
                <p className="text-2xl font-semibold mt-1">{contacts.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Sales</CardTitle>
            <Link href="/dashboard/admin/deals">
              <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sales yet</p>
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

        {/* Recent Sellers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Sellers</CardTitle>
            <Link href="/dashboard/admin/users">
              <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {sellers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sellers yet</p>
            ) : (
              <div className="space-y-4">
                {sellers.slice(0, 4).map((seller) => (
                  <div key={seller._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{seller.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <p className="text-sm text-muted-foreground">{seller.email}</p>
                      </div>
                    </div>
                    <Badge variant={seller.status === "active" ? "default" : "warning"}>
                      {seller.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No inquiries yet</p>
          ) : (
            <div className="space-y-4">
              {contacts.slice(0, 4).map((contact) => (
                <div key={contact._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <Badge variant="secondary">{contact.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Approve Sellers</span>
            </Button>
          </Link>
          <Link href="/dashboard/admin/products">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Package className="w-5 h-5" />
              <span className="text-sm">Add Product</span>
            </Button>
          </Link>
          <Link href="/dashboard/admin/deals">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Review Deals</span>
            </Button>
          </Link>
          <Link href="/dashboard/admin/payouts">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Payouts</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
