"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Sellers", href: "/become-seller" },
  { name: "Contact", href: "/contact" },
];

const dashboardNavigation = [
  { name: "Seller Dashboard", href: "/dashboard/seller" },
  { name: "Admin Dashboard", href: "/dashboard/admin" },
  { name: "Customer Dashboard", href: "/dashboard/customer" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>M</span>
            </div>
            <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Milkyway
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: '0.01em' }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth & Theme */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-sm font-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <button className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.7rem' }}>
                GET STARTED
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-lg px-4 py-2 transition-colors",
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground px-4 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Dashboards</p>
                    {dashboardNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <Link href="/auth/login" className="block">
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <button className="btn-primary w-full" style={{ fontSize: '0.7rem' }}>
                        GET STARTED
                      </button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
