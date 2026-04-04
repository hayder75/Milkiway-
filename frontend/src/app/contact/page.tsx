'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from '@/lib/api';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.contacts.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Yellow */}
      <section className="bg-[#FFCC00] dark:bg-[#E5B800] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#132A4B] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-[#132A4B]/80">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Form */}
            <Card className="bg-white border-2 border-[#132A4B] shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-[#132A4B] mb-6">Send us a message</h2>
                
                {success && (
                  <div className="bg-white/90 text-[#132A4B] px-4 py-3 mb-6 text-sm font-medium">
                    Message sent! We'll get back to you soon.
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-3 mb-6 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#132A4B]">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-white border border-gray-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#132A4B]">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white border border-gray-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#132A4B]">Phone (Optional)</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 234 567 8900" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white border border-gray-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#132A4B]">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us what you need..." 
                      rows={5} 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-white border-0 resize-none" 
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-[#132A4B] hover:bg-[#0f1f35] text-white">
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Email</h3>
                  <p className="text-muted-foreground">We respond within 24 hours.</p>
                  <p className="font-medium mt-2">hello@milkyway.com</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Phone</h3>
                  <p className="text-muted-foreground">Mon-Fri, 9am-6pm EST.</p>
                  <p className="font-medium mt-2">+1 234 567 8900</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Office</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                  <p className="font-medium mt-2">123 Tech Street</p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
