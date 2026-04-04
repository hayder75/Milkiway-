'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/lib/api';
import { setStoredUser } from '@/lib/session';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.sellers.login(formData.identifier, formData.password);
      setStoredUser(result.seller);
      if (result.seller.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/seller');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
    }, 1200);
  };

  if (isNavigating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
        <div className="relative w-28 h-32 animate-bounce-slow">
          <Image
            src="/hero-llama.png"
            alt="Loading"
            width={112}
            height={140}
            className="object-contain object-top invert dark:invert-0"
          />
        </div>
        
        <div className="w-40 h-2 bg-[#FFCC00] rounded-full overflow-hidden">
          <div className="h-full bg-[#FFCC00] rounded-full animate-progress" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium animate-pulse text-[#132A4B]">Loading</p>
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <div className="relative w-32 h-36 mx-auto">
            <Image 
              src="/hero-llama.png" 
              alt="Milkyway Logo" 
              fill
              className="object-contain object-top invert dark:invert-0"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="text-center mb-3">
            <h1 className="text-2xl font-light text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome back</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Sign in with username or phone
            </p>
          </div>

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 mb-3 text-xs rounded-lg">
              Application submitted. You can now login.
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 mb-3 text-xs rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="identifier" className="text-xs uppercase text-muted-foreground font-medium">Username or Phone</Label>
                <Input 
                  id="identifier" 
                  placeholder="username or +123456789" 
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  required
                  className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs uppercase text-muted-foreground font-medium">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 h-10 text-sm font-medium">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a 
                href="/auth/register" 
                onClick={(e) => handleNavigate(e, '/auth/register')}
                className="text-foreground underline hover:no-underline cursor-pointer"
              >
                Apply now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
