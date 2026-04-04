"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";
import { getStoredSeller } from "@/lib/session";
import { cn } from "@/lib/utils";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!isDashboard) {
      return;
    }

    const seller = getStoredSeller();
    if (!seller) {
      router.replace("/auth/login");
      return;
    }

    if (pathname.startsWith("/dashboard/admin") && seller.role !== "admin") {
      router.replace("/dashboard/seller");
      return;
    }

    if (pathname.startsWith("/dashboard/seller") && seller.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }
  }, [isDashboard, pathname, router]);

  if (isDashboard) {
    // Dashboard pages get NO public navbar/footer — they have their own sidebar layout
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </>
  );
}
