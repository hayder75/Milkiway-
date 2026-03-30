"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { ArrowRight, Search } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  image?: string;
}

const categories = ["All", "E-Commerce", "Business", "Retail", "Hospitality", "Education"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.systems.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Yellow */}
      <section className="bg-[#FFCC00] dark:bg-[#E5B800] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#132A4B] mb-4">
            Our Products
          </h1>
          <p className="text-lg text-[#132A4B]/80">
            Premium software solutions for your business.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.features?.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-2xl font-bold text-primary">${product.price?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/demo/${product._id}`}>
                            <Button variant="outline" size="sm">Demo</Button>
                          </Link>
                          <Link href={`/products/${product._id}`}>
                            <Button size="sm">Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
