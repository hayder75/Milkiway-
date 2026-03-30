import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Package,
  Headphones,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
  Download
} from "lucide-react";

const purchasedProducts = [
  { id: "1", name: "E-Commerce Pro", purchaseDate: "2026-03-15", status: "active", price: 2499 },
];

const stats = [
  { title: "Purchased Products", value: "1", icon: Package },
  { title: "Active Licenses", value: "1", icon: Package },
  { title: "Support Tickets", value: "0", icon: Headphones },
];

export default function CustomerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground">Manage your purchased products and support</p>
        </div>
        <Link href="/dashboard/customer/support">
          <Button>Contact Support</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">My Products</CardTitle>
        </CardHeader>
        <CardContent>
          {purchasedProducts.length > 0 ? (
            <div className="space-y-4">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{product.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Purchased on {product.purchaseDate}</p>
                      <Badge variant="default" className="mt-1">{product.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Access
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
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
          <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
            <Package className="w-5 h-5" />
            <span className="text-sm">License Info</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
