'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sellerId: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.sellers.login(formData.sellerId, formData.email);
      localStorage.setItem('seller', JSON.stringify(result.seller));
      router.push('/dashboard/seller');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[var(--background)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-2 text-foreground">
            <div className="w-10 h-10 bg-foreground flex items-center justify-center">
              <span className="font-serif text-background font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-serif tracking-tight">Milkyway</span>
          </Link>
        </div>

        <div className="border border-border bg-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif mb-2">Welcome back</h1>
            <p className="text-muted-foreground font-sans text-sm">
              Sign in to your seller account
            </p>
          </div>

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 text-sm">
              Application submitted! Please login with your seller ID.
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sellerId" className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">Seller ID</Label>
                <Input 
                  id="sellerId" 
                  placeholder="MWXXXXX" 
                  value={formData.sellerId}
                  onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                  required
                  className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 font-sans tracking-wide">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm font-sans text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all">
                Apply now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
