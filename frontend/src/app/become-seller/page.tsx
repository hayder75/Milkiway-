import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Yellow */}
      <section className="bg-[#FFCC00] dark:bg-[#E5B800] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#132A4B] uppercase tracking-widest mb-4">
            Partner Program
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#132A4B] mb-6">
            Become a <span className="text-[#132A4B]">Milkyway Seller</span>
          </h1>
          <p className="text-lg md:text-xl text-[#132A4B]/80 mb-8 max-w-2xl mx-auto">
            Join our network of sales agents. Earn commissions by connecting businesses with premium software solutions.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-[#132A4B] hover:bg-[#0f1f35] text-white">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Active Sellers" },
              { value: "$2M+", label: "Commissions Paid" },
              { value: "30%", label: "Average Commission" },
              { value: "98%", label: "Seller Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Commission Structure</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { range: "$0 - $5,000", percentage: "10%" },
              { range: "$5,001 - $15,000", percentage: "15%" },
              { range: "$15,001 - $30,000", percentage: "18%" },
              { range: "$30,001+", percentage: "20%" },
            ].map((tier) => (
              <Card key={tier.range} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <span className="text-muted-foreground">{tier.range}</span>
                  <span className="text-2xl font-bold text-primary">{tier.percentage}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Submit Application", desc: "Tell us about your sales experience." },
              { step: "02", title: "Get Approved", desc: "We review within 48 hours." },
              { step: "03", title: "Start Selling", desc: "Access your dashboard and promo materials." },
              { step: "04", title: "Earn Commissions", desc: "Get paid directly to your bank." },
            ].map((item) => (
              <Card key={item.step} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-6">
                  <span className="text-4xl font-bold text-primary/20">{item.step}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#FFCC00] dark:bg-[#E5B800]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#132A4B] mb-4">Ready to Start Earning?</h2>
          <p className="text-[#132A4B]/80 mb-8">Join hundreds of sellers already earning with Milkyway.</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-[#132A4B] hover:bg-[#0f1f35] text-white">
              Apply Now - It's Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
