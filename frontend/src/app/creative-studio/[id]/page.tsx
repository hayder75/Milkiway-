"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api, { type PortfolioRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";
import { ArrowLeft, Play } from "lucide-react";

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<PortfolioRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [allPortfolio, setAllPortfolio] = useState<PortfolioRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.portfolio.getAll();
        setAllPortfolio(data);
        
        if (params.id) {
          const found = data.find((p: PortfolioRecord) => p._id === params.id);
          setItem(found || null);
        }
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Project Not Found</h1>
          <Link href="/creative-studio">
            <Button variant="outline">Back to Creative Studio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [item.image, ...(item.images || [])].filter(Boolean);
  const relatedProjects = allPortfolio
    .filter(p => p.category === item.category && p._id !== item._id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="px-4 md:px-8 pt-24 pb-8">
        <div className="max-w-[1200px] mx-auto">
          <Link 
            href="/creative-studio" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero Image with Gallery Thumbnails */}
      <section className="px-4 md:px-8 mb-8 bg-gray-50 pt-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative h-[300px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden mb-4">
            <Image
              src={allImages[selectedImage] || item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            {item.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <a 
                  href={item.video}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Play className="w-6 h-6 ml-1 text-gray-800" />
                </a>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === idx ? 'border-[#FFCC00]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Info */}
      <section className="px-4 md:px-8 mb-16 bg-white py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mt-2 mb-6">
                {item.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {/* Services */}
              {item.services && item.services.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.services.map((service: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-[#132A4B] text-white rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 border border-border rounded-full text-sm text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-xl p-6 sticky top-24">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Client
                  </span>
                  <p className="text-xl font-medium mt-1">{item.client}</p>
                </div>
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Category
                  </span>
                  <p className="text-xl font-medium mt-1">{item.category}</p>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Grid Size
                  </span>
                  <p className="text-xl font-medium mt-1 capitalize">{item.size}</p>
                </div>
                <div className="pt-6 border-t border-border">
                  <Link href={`/creative-studio/contact?project=${item._id}`}>
                    <Button className="w-full bg-[#FFCC00] text-[#132A4B] hover:bg-[#e6b800] font-medium">
                      Order Similar Design
                    </Button>
                  </Link>
                  <Link href="/creative-studio/contact">
                    <Button variant="outline" className="w-full mt-3 border-[#132A4B] text-[#132A4B]">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {item.video && (
        <section className="px-4 md:px-8 pb-12">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-light mb-6">Project Video</h2>
            <div className="relative h-[300px] md:h-[450px] rounded-xl overflow-hidden bg-muted">
              <iframe
                src={item.video.replace("youtube.com/watch?v=", "youtube.com/embed/")}
                title="Project Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="px-4 md:px-8 pb-20">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-light mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link 
                  key={project._id} 
                  href={`/creative-studio/${project._id}`}
                  className="group"
                >
                  <div className="relative h-48 md:h-56 rounded-xl overflow-hidden mb-3">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-medium group-hover:text-[#FFCC00] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-4" style={{ color: '#132A4B' }}>Like what you see?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let&apos;s create something amazing for your brand too. Contact us today to discuss your project.
          </p>
          <Link href="/contact?service=creative">
            <Button size="lg" className="bg-[#132A4B] text-white hover:bg-[#1a3a5c] font-medium px-8">
              Start Your Project
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}