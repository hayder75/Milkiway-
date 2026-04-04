"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

export default function CustomerProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'customer') {
      router.push('/auth/login?redirect=/dashboard/customer/products');
    } else {
      setLoading(false);
    }
  }, [router]);

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
          <h1 className="dashboard-page-title">My Products</h1>
          <p className="dashboard-page-subtitle">Your purchased software solutions</p>
        </div>
        <Link href="/products" className="d-btn">Browse More</Link>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <div className="text-center py-8 text-muted-foreground">
            No purchased products yet
          </div>
        </div>
      </div>
    </div>
  );
}
