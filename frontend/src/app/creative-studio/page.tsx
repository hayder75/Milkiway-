"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api, { type PortfolioRecord } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading";

const categories = ["All", "Logo Design", "Brand Identity", "Visual Identity", "Packaging", "Web Design", "Illustration"];

export default function CreativeStudioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await api.portfolio.getAll();
        setPortfolio(data.filter((item: PortfolioRecord) => item.isActive));
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  const filteredPortfolio = selectedCategory === "All" 
    ? portfolio 
    : portfolio.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 inline-block px-6 py-3"
              style={{ background: '#FFCC00', borderRadius: '0.5rem', color: '#132A4B' }}
            >
              Creative Studio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Where ideas take shape. We craft stunning visual identities, logos, and brand experiences that leave lasting impressions.
            </p>
            <Link href="/creative-studio/contact">
              <Button 
                size="lg" 
                className="bg-[#132A4B] text-white hover:bg-[#1a3a5c] font-medium px-8"
              >
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Tags */}
      <section className="px-4 md:px-8 py-8 border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedCategory(tag)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === tag 
                    ? "bg-[#132A4B] text-white" 
                    : "bg-transparent border border-gray-300 text-gray-600 hover:border-[#132A4B] hover:text-[#132A4B]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pinterest-style Grid */}
      <section className="px-4 md:px-8 py-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No projects in this category yet.</p>
              <p className="text-muted-foreground mt-2">Check back soon for new work!</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredPortfolio.map((item) => (
                <Link 
                  key={item._id} 
                  href={`/creative-studio/${item._id}`}
                  className="block group break-inside-avoid"
                >
                  <div className="relative overflow-hidden rounded-xl bg-card border border-gray-200 hover:border-[#FFCC00] transition-all shadow-lg hover:shadow-xl">
                    <div className="relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={600}
                          height={item.size === "large" ? 500 : item.size === "medium" ? 350 : 250}
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-64 bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">No image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm font-medium">View Project →</span>
                      </div>
                    </div>
                    <div className="p-5 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#132A4B' }}>
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 rounded">
                          {item.size}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mt-1 group-hover:text-[#FFCC00] transition-colors" style={{ color: '#132A4B' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.client}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#132A4B' }}>Ready to bring your vision to life?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Let&apos;s create something beautiful together. Our team is ready to transform your brand identity.
          </p>
          <Link href="/creative-studio/contact">
            <Button size="lg" className="bg-[#132A4B] text-white hover:bg-[#1a3a5c] font-medium px-8">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}