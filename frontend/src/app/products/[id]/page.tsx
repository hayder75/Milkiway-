import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  Star,
  Clock,
  Shield,
  Zap,
  Users,
  ShoppingCart,
  Building2,
  Briefcase,
  Play,
} from "lucide-react";
import api from "@/lib/api";

const categoryIcons: Record<string, LucideIcon> = {
  "E-Commerce": ShoppingCart,
  Retail: ShoppingCart,
  Business: Briefcase,
  Hospitality: Building2,
  Education: Users,
};

function getCategoryIcon(category?: string | null): LucideIcon {
  if (!category) {
    return Briefcase;
  }

  return categoryIcons[category] || Briefcase;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  noStore();

  const { id } = await params;

  let product;

  try {
    product = await api.systems.getById(id);
  } catch {
    notFound();
  }

  const Icon = getCategoryIcon(product.category);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-primary/5" />
                <Icon className="w-32 h-32 text-primary/40" />
                <Link href={`/demo/${product._id}`}>
                  <Button className="absolute bottom-4 right-4" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <Badge variant="outline" className="mb-2">{product.category || "Business"}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                  <p className="text-lg text-muted-foreground">{product.description}</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2 shrink-0">
                  {product.commissionRate}% Commission
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-primary mb-2">
                        ${product.price.toLocaleString()}
                      </div>
                      <p className="text-muted-foreground mb-6">One-time payment</p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/demo/${product._id}`}>
                          <Button variant="outline" size="lg">
                            Request Demo
                          </Button>
                        </Link>
                        <Button size="lg">
                          Buy Now
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <h4 className="font-semibold">What is included:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="text-4xl font-bold">4.9</div>
                        <div>
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <Star key={index} className="w-5 h-5 fill-primary text-primary" />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">Based on 127 reviews</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Be the first to review this product after purchase.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">One-time payment</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>24/7 support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Dedicated account manager</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={`/demo/${product._id}`} className="block">
                    <Button variant="outline" className="w-full">
                      Request Demo
                    </Button>
                  </Link>
                  <Button className="w-full">
                    Buy Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Commission</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {product.commissionRate}%
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earn {product.commissionRate}% on every sale
                  </p>
                  <Link href="/become-seller" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Become a Seller
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {product.longDescription ? (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Overview</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.longDescription}</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
