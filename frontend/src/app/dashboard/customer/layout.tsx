"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { getStoredSeller } from "@/lib/session";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredSeller();
    if (!user || user.role !== 'customer') {
      router.push('/auth/login?redirect=/dashboard/customer');
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <DashboardSidebar role="customer" />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="dashboard-content p-6">{children}</div>
      </main>
    </div>
  );
}
