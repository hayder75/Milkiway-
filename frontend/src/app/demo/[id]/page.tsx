"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Check, ExternalLink, MonitorPlay, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getStoredSeller } from "@/lib/session";
import api, { type SystemRecord } from "@/lib/api";

export default function DemoPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<SystemRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller) {
      router.push('/auth/login?redirect=/demo/' + params.id);
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await api.systems.getById(params.id as string);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [params.id, router]);

  const getBackUrl = () => {
    const seller = getStoredSeller();
    if (seller?.role === 'admin') {
      return '/dashboard/admin/products';
    }
    return '/dashboard/seller/products';
  };

  const getVideoSrc = (video: string) => {
    if (!video) return '';
    if (video.startsWith('http') && video.includes('youtube')) {
      return video.replace("youtube.com/watch?v=", "youtube.com/embed/");
    }
    if (video.startsWith('/uploads')) {
      return `http://localhost:5000${video}`;
    }
    return video;
  };

  const getImageSrc = (image: string) => {
    if (!image) return '';
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    return image;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    const imgs = product?.image ? [product.image] : [];
    if (imgs.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % imgs.length);
  };

  const prevImage = () => {
    const imgs = product?.image ? [product.image] : [];
    if (imgs.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + imgs.length) % imgs.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Product Not Found</h1>
          <Link href={getBackUrl()}>
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const videos = product.video ? [product.video] : [];
  const images = product.image ? [product.image] : [];
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={getBackUrl()}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                {videos.length > 0 ? (
                  <video
                    src={getVideoSrc(videos[currentVideoIndex])}
                    controls
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No video available</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary">Demo Video</Badge>
                </div>
              </div>
              {videos.length > 1 && (
                <div className="flex gap-2 p-2 border-t">
                  {videos.map((vid, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentVideoIndex(idx)}
                      className={`px-3 py-1 rounded text-sm ${currentVideoIndex === idx ? 'bg-primary text-white' : 'bg-muted'}`}
                    >
                      Video {idx + 1}
                    </button>
                  ))}
                </div>
              )}
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                <p className="text-muted-foreground">{product.longDescription || product.description}</p>
              </CardContent>
            </Card>

            {/* Screenshots Gallery - Clickable with navigation */}
            {images.length > 0 && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                  <div className="relative">
                    <div 
                      className="aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer"
                      onClick={() => openLightbox(0)}
                    >
                      <img 
                        src={getImageSrc(images[0])}
                        alt={`${product.title} screenshot 1`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {images.length > 1 && (
                      <>
                        <button 
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          1 / {images.length}
                        </div>
                      </>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">Click image to view full screen</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Details */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">System Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.slice(0, 6).map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Category</h3>
                    <Badge variant="outline" className="mb-4">{product.category || "Business"}</Badge>
                    
                    <h3 className="font-medium mb-3">Price</h3>
                    <p className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info Card with Logo */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/logo.png" 
                      alt="Milkyway Logo" 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{product.category || "Business"}</Badge>
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">One-time payment</div>
                </div>

                <Button className="w-full">
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Live Demo Link Card - Separate yellow card */}
            {product.demoUrl && (
              <Card className="bg-[#FFCC00] border-[#FFCC00]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-6 h-6 text-[#132A4B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#132A4B]">Live Demo</h3>
                      <p className="text-sm text-[#132A4B]/70">Click to access the interactive demo</p>
                    </div>
                  </div>
                  <a 
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full py-3 bg-[#132A4B] text-white text-center font-medium rounded-lg hover:bg-[#132A4B]/90 transition-colors"
                  >
                    Open Demo →
                  </a>
                </CardContent>
              </Card>
            )}

            {/* How to Use */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">How to Use the Demo</h3>
                </div>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">1</span>
                    <span>Click "Open Demo" to launch in new tab</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">2</span>
                    <span>Explore all features available</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">3</span>
                    <span>Contact us for a walkthrough</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team can provide a personalized demo tailored to your needs.
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

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 text-white p-2"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                className="absolute right-4 text-white p-2"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          
          <img 
            src={getImageSrc(images[lightboxIndex])}
            alt={`${product.title} screenshot ${lightboxIndex + 1}`}
            className="max-h-[80vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-4 text-white">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
