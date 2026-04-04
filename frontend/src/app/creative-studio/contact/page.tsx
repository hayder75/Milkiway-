"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

const projectTypes = [
  "Logo Design",
  "Brand Identity",
  "Visual Identity",
  "Packaging Design",
  "Web Design",
  "Illustration",
  "Other"
];

const budgetRanges = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000+",
  "Not sure yet"
];

export default function CreativeStudioContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    projectType: "",
    budget: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.creativeRequests.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName || undefined,
        projectType: form.projectType,
        budget: form.budget || undefined,
        description: form.description
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#132A4B' }}>Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest! Our team will review your request and get back to you within 24-48 hours.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+251 912 345 678</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@milkyway.com</span>
              </div>
            </div>
            <Link href="/creative-studio">
              <Button variant="outline" className="mt-6 w-full">
                Back to Creative Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">
          <Link href="/creative-studio" className="text-muted-foreground hover:text-foreground">
            ← Back to Creative Studio
          </Link>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#132A4B' }}>Start Your Creative Project</h1>
            <p className="text-muted-foreground mb-8">
              Tell us about your project and we&apos;ll get back to you within 24-48 hours.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <Input
                    type="tel"
                    placeholder="+2519..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    placeholder="Your company (optional)"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    required
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget Range</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    <option value="">Select budget (optional)</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project Description *</label>
                <Textarea
                  placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#132A4B] hover:bg-[#1a3a5c] text-white font-medium py-3"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Submit Request
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#132A4B' }}>Get In Touch Directly</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#132A4B]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+251 912 345 678</p>
                    <p className="text-sm text-muted-foreground">Mon - Fri, 9AM - 6PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#132A4B]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@milkyway.com</p>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#132A4B]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-muted-foreground">Bole Road, Addis Ababa</p>
                    <p className="text-sm text-muted-foreground">Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#132A4B' }}>Why Work With Us?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#FFCC00] font-bold">✓</span>
                  <span className="text-muted-foreground">Experienced team with 5+ years in design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFCC00] font-bold">✓</span>
                  <span className="text-muted-foreground">Custom designs tailored to your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFCC00] font-bold">✓</span>
                  <span className="text-muted-foreground">Fast turnaround times</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFCC00] font-bold">✓</span>
                  <span className="text-muted-foreground">Unlimited revisions until satisfied</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFCC00] font-bold">✓</span>
                  <span className="text-muted-foreground">Post-delivery support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}