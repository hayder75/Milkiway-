import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Play
} from "lucide-react";
import { products } from "@/data/mockData";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "E-Commerce":
      case "Retail":
        return ShoppingCart;
      case "Business":
        return Briefcase;
      case "Hospitality":
        return Building2;
      default:
        return Briefcase;
    }
  };

  const Icon = getCategoryIcon(product.category);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header */}
            <div>
              <div className="h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-primary/5" />
                <Icon className="w-32 h-32 text-primary/40" />
                <Link href={`/demo/${product.id}`}>
                  <Button className="absolute bottom-4 right-4" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                  <p className="text-lg text-muted-foreground">{product.description}</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {product.commission}% Commission
                </Badge>
              </div>
            </div>

            {/* Tabs */}
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
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
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
                        <Link href={`/demo/${product.id}`}>
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
                      <h4 className="font-semibold">What's Included:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
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
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
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
                  <Link href={`/demo/${product.id}`} className="block">
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

            {/* Commission Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Commission</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {product.commission}%
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earn {product.commission}% on every sale
                  </p>
                  <Link href="/become-seller" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Become a Seller
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
