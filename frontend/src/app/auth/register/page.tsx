'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      await api.sellers.register({
        name,
        email: formData.email,
        phone: formData.phone,
      });
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
            <h1 className="text-2xl font-serif mb-2">Apply as a Seller</h1>
            <p className="text-muted-foreground font-sans text-sm">
              Join our partner program and start earning commissions
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                />
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox id="terms" required className="rounded-none border-border mt-1" />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground font-sans leading-relaxed"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-foreground underline decoration-border hover:decoration-foreground">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-foreground underline decoration-border hover:decoration-foreground">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 font-sans tracking-wide mt-4">
                {loading ? 'Submitting...' : 'Apply Now'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-sans tracking-wider text-[10px]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="rounded-none border-border hover:bg-secondary font-sans transition-colors">
                Google
              </Button>
              <Button variant="outline" className="rounded-none border-border hover:bg-secondary font-sans transition-colors">
                GitHub
              </Button>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm font-sans text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
