"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getStoredSeller, type SessionSeller } from "@/lib/session";
import { 
  Package,
  Headphones,
  ShoppingCart
} from "lucide-react";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionSeller | null>(null);

  useEffect(() => {
    const storedUser = getStoredSeller();
    if (!storedUser || storedUser.role !== 'customer') {
      router.push('/auth/login?redirect=/dashboard/customer');
      return;
    }
    setUser(storedUser);
  }, [router]);

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Manage your purchased products and support</p>
        </div>
        <Link href="/dashboard/customer/support">
          <Button>Contact Support</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Purchased Products</p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Licenses</p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Support Tickets</p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">My Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/customer/support">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Headphones className="w-5 h-5" />
              <span className="text-sm">Get Support</span>
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Browse Products</span>
            </Button>
          </Link>
          <Link href="/dashboard/customer/products">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Package className="w-5 h-5" />
              <span className="text-sm">My Products</span>
            </Button>
          </Link>
          <Button variant="outline" className="w-full h-20 flex flex-col gap-2" disabled>
            <Package className="w-5 h-5" />
            <span className="text-sm">License Info</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
