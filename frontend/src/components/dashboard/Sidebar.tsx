"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  Bug,
  LogOut,
  Home,
  BarChart3,
  ShoppingCart,
  Headphones,
  Palette,
  User,
  FileText
} from "lucide-react";
import { clearStoredSeller } from "@/lib/session";

interface SidebarProps {
  role: "seller" | "admin" | "customer";
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const sellerSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard/seller", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sales",
    items: [
      { name: "Products", href: "/dashboard/seller/products", icon: Package },
      { name: "Leads", href: "/dashboard/seller/leads", icon: Users },
      { name: "Deals", href: "/dashboard/seller/deals", icon: ShoppingCart },
      { name: "Contracts", href: "/dashboard/seller/contracts", icon: FileText },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Earnings", href: "/dashboard/seller/earnings", icon: DollarSign },
      { name: "Payouts", href: "/dashboard/seller/payouts", icon: TrendingUp },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Profile", href: "/dashboard/seller/profile", icon: User },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Feature Requests", href: "/dashboard/seller/features", icon: Gift },
      { name: "Report Issue", href: "/dashboard/seller/issues", icon: Bug },
    ],
  },
];

const adminSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Products", href: "/dashboard/admin/products", icon: Package },
      { name: "Deals", href: "/dashboard/admin/deals", icon: ShoppingCart },
      { name: "Creative Requests", href: "/dashboard/admin/creative-requests", icon: Palette },
      { name: "Creative Studio", href: "/dashboard/admin/portfolio", icon: Palette },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Payouts", href: "/dashboard/admin/payouts", icon: DollarSign },
      { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Feature Requests", href: "/dashboard/admin/features", icon: Gift },
      { name: "Issues", href: "/dashboard/admin/issues", icon: Bug },
    ],
  },
];

const customerSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    ],
  },
  {
    label: "Products",
    items: [
      { name: "My Products", href: "/dashboard/customer/products", icon: Package },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Support", href: "/dashboard/customer/support", icon: Headphones },
    ],
  },
];

const sectionMap: Record<"seller" | "admin" | "customer", NavSection[]> = {
  seller: sellerSections,
  admin: adminSections,
  customer: customerSections,
};

const roleLabels = {
  seller: "Seller",
  admin: "Admin",
  customer: "Customer",
};

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const sections = sectionMap[role];

  const handleLogout = () => {
    clearStoredSeller();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-background border-r h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="flex flex-col items-start gap-2">
          <Image 
            src="/logo.png" 
            alt="Milkyway Logo" 
            width={160} 
            height={48} 
            className="h-10 w-auto transition-all"
            style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)' }}
          />
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap font-bold uppercase tracking-widest">
            {roleLabels[role]}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.label && (
                <p className="text-xs font-medium text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
