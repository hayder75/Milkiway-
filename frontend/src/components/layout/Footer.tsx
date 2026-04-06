import Link from "next/link";

const footerLinks = {
  products: [
    { name: "E-Commerce", href: "/products" },
    { name: "CRM", href: "/products" },
    { name: "Inventory", href: "/products" },
    { name: "Hotel Management", href: "/products" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "FAQ", href: "/faq" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                <span
                  className="text-background font-bold text-sm"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  M
                </span>
              </div>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Milkyway Labs
              </span>
            </Link>
            <p
              className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Empowering businesses with premium software solutions.
              Join our network and transform your operations.
            </p>
            <div className="mt-6 space-y-1.5">
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                +251 930 304 345
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                +251 932 123 090
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Products
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Legal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 Milkyway Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
