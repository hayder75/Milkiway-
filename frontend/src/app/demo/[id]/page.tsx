import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Check, ShoppingCart, Building2, Briefcase, Users } from "lucide-react";
import { products } from "@/data/mockData";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function DemoPage({ params }: { params: { id: string } }) {
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
      case "Education":
        return Users;
      default:
        return Briefcase;
    }
  };

  const Icon = getCategoryIcon(product.category);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/products/${product.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Demo */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-20 h-20">
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary">Demo Video</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{product.category}</Badge>
                    <h3 className="font-semibold">{product.name}</h3>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">One-time payment</div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Custom Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team can provide a personalized demo tailored to your business needs.
                </p>
                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
