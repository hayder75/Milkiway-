'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

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
        {/* Llama image bouncing */}
        <div className="relative w-28 h-32 animate-bounce-slow">
          <Image
            src="/hero-llama.png"
            alt="Loading"
            width={112}
            height={140}
            className="object-contain object-top invert dark:invert-0"
          />
        </div>
        
        {/* Horizontal progress bar - yellow with black fill */}
        <div className="w-40 h-2 bg-[#FFCC00] rounded-full overflow-hidden">
          <div className="h-full bg-[#FFCC00] rounded-full animate-progress" />
        </div>
        
        {/* Loading dots */}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      await api.sellers.register({
        name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push('/auth/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-[var(--background)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-2">
          <div className="relative w-32 h-36 mx-auto">
            <Image 
              src="/hero-llama.png" 
              alt="Milkyway Logo" 
              fill
              className="object-contain object-top invert dark:invert-0"
            />
          </div>
        </div>

        <div className="p-3">
          <div className="text-center mb-3">
            <h1 className="text-2xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>Create your Seller Account</h1>
            <p className="text-muted-foreground text-xs mt-1">
              Choose username and password
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-xs uppercase text-muted-foreground font-medium">First</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-xs uppercase text-muted-foreground font-medium">Last</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="username" className="text-xs uppercase text-muted-foreground font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="johnseller"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs uppercase text-muted-foreground font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs uppercase text-muted-foreground font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-xs uppercase text-muted-foreground font-medium">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs uppercase text-muted-foreground font-medium">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-lg border-border focus-visible:ring-0 focus-visible:border-foreground h-10"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox id="terms" required className="rounded border-border mt-0" />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
                  I agree to the{" "}
                  <Link href="/terms" className="text-foreground underline hover:no-underline">Terms</Link>
                  {" "}&{" "}
                  <Link href="/privacy" className="text-foreground underline hover:no-underline">Privacy</Link>
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 h-10 text-sm font-medium">
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-lg border-border hover:bg-secondary h-9 text-xs">
                Google
              </Button>
              <Button variant="outline" className="rounded-lg border-border hover:bg-secondary h-9 text-xs">
                GitHub
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <a 
                href="/auth/login" 
                onClick={(e) => handleNavigate(e, '/auth/login')}
                className="text-foreground underline hover:no-underline cursor-pointer"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
