"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSessionSeller } from "@/lib/session";
import { useTheme } from "next-themes";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Sellers", href: "/become-seller" },
  { name: "Creative Studio", href: "/creative-studio" },
  { name: "Contact", href: "/contact" },
];

const dashboardNavigation = [
  { name: "Seller Dashboard", href: "/dashboard/seller" },
  { name: "Admin Dashboard", href: "/dashboard/admin" },
  { name: "Customer Dashboard", href: "/dashboard/customer" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { seller, isLoggedIn, logout } = useSessionSeller();

  const dashboardHref = seller?.role === "admin" ? "/dashboard/admin" : "/dashboard/seller";

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Milkyway Logo" 
              width={200} 
              height={60} 
              className="h-10 w-auto transition-all hover:scale-105"
              style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)' }}
            />
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
            {isLoggedIn ? (
              <>
                <Link href={dashboardHref}>
                  <Button variant="ghost" className="text-sm font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} className="text-sm font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
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
                    {isLoggedIn ? (
                      <>
                        <Link href={dashboardHref} className="block" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full">Dashboard</Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block">
                          <Button variant="ghost" className="w-full">Sign In</Button>
                        </Link>
                        <Link href="/auth/register" className="block">
                          <button className="btn-primary w-full" style={{ fontSize: '0.7rem' }}>
                            GET STARTED
                          </button>
                        </Link>
                      </>
                    )}
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
