"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStoredSeller, type SessionSeller } from "@/lib/session";
import api from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading";
import { Camera } from "lucide-react";

interface PaymentMethods {
  bank?: { enabled: boolean; bankName?: string; accountName?: string; accountNumber?: string };
  telebirr?: { enabled: boolean; phoneNumber?: string };
  cbe?: { enabled: boolean; accountNumber?: string; accountName?: string };
  awash?: { enabled: boolean; accountNumber?: string; accountName?: string };
}

export default function SellerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    bank: { enabled: false },
    telebirr: { enabled: false },
    cbe: { enabled: false },
    awash: { enabled: false },
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const storedUser = getStoredSeller();
    if (!storedUser || storedUser.role !== 'seller') {
      router.push('/auth/login?redirect=/dashboard/seller/profile');
      return;
    }
    setUser(storedUser);
    setName(storedUser.name || "");
    setEmail(storedUser.email || "");
    setPhone(storedUser.phone || "");
    setProfileImage(storedUser.image || null);
    
    loadPaymentMethods(storedUser.sellerId);
  }, [router]);

  const loadPaymentMethods = async (sellerId: string) => {
    try {
      const methods = await api.sellerProfile.getPaymentMethods(sellerId);
      if (methods) {
        setPaymentMethods(methods as PaymentMethods);
      }
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const result = await api.upload.single(file);
      const imageUrl = result.url;
      
      await api.sellerProfile.update(user.sellerId, {
        image: imageUrl,
      } as any);

      setProfileImage(imageUrl);
      const updatedUser = { ...user, image: imageUrl };
      setUser(updatedUser);
      localStorage.setItem('milkyway_user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Profile image updated!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload image' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await api.sellerProfile.update(user.sellerId, {
        name,
        email,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword("");
      setNewPassword("");
      
      const updatedUser = { ...user, name, email, phone };
      setUser(updatedUser);
      localStorage.setItem('milkyway_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentMethodUpdate = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await api.sellerProfile.update(user.sellerId, {
        paymentMethods: paymentMethods as any,
      } as any);
      
      setMessage({ type: 'success', text: 'Payment methods saved!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Profile</h1>
          <p className="dashboard-page-subtitle">Manage your account and payment settings</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#FFCC00] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profileImage ? (
                <Image 
                  src={profileImage.startsWith('http') ? profileImage : `${backendUrl}${profileImage}`}
                  alt="Profile" 
                  width={128} 
                  height={128} 
                  className="object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-[#132A4B]">{user?.name?.charAt(0) || 'S'}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#132A4B] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#1a3a5c] transition-colors"
            >
              {uploadingImage ? <LoadingSpinner size="sm" /> : <Camera className="w-5 h-5" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold" style={{ color: '#132A4B' }}>{user?.name}</h2>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
              <span className="text-sm text-muted-foreground">Seller ID: {user?.sellerId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold" style={{ color: '#132A4B' }}>Account Settings</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none transition-colors"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251..."
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-4" style={{ color: '#132A4B' }}>Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none transition-colors"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none transition-colors"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-[#132A4B] text-white rounded-lg font-medium hover:bg-[#1a3a5c] transition-colors disabled:opacity-50" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold" style={{ color: '#132A4B' }}>Payment Methods</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your bank or wallet details for payouts</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'telebirr', label: 'Telebirr', color: 'purple', initials: 'TB', field: 'phoneNumber', placeholder: 'Phone number' },
              { key: 'cbe', label: 'CBE', color: 'blue', initials: 'CBE', fields: ['accountName', 'accountNumber'] },
              { key: 'awash', label: 'Awash Bank', color: 'orange', initials: 'AW', fields: ['accountName', 'accountNumber'] },
              { key: 'bank', label: 'Other Bank', color: 'gray', initials: 'BK', fields: ['bankName', 'accountName', 'accountNumber'] },
            ].map((method) => (
              <div key={method.key} className="p-4 rounded-lg border border-gray-200 hover:border-[#FFCC00] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${method.color}-100 flex items-center justify-center`}>
                      <span className={`text-xs font-bold text-${method.color}-600`}>{method.initials}</span>
                    </div>
                    <span className="font-medium">{method.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={paymentMethods[method.key as keyof PaymentMethods]?.enabled || false}
                      onChange={(e) => setPaymentMethods(prev => ({
                        ...prev,
                        [method.key]: { ...(prev[method.key as keyof PaymentMethods] || { enabled: false }), enabled: e.target.checked }
                      }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500"></div>
                  </label>
                </div>
                {paymentMethods[method.key as keyof PaymentMethods]?.enabled && (
                  <div className="space-y-3">
                    {method.fields || [method.field]?.map((field) => (
                      <input
                        key={field}
                        type="text"
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-[#132A4B] focus:ring-1 focus:ring-[#132A4B] outline-none"
                        placeholder={field === 'phoneNumber' ? 'Phone number' : field === 'bankName' ? 'Bank name' : field === 'accountName' ? 'Account name' : 'Account number'}
                        value={paymentMethods[method.key as keyof PaymentMethods]?.[field as keyof typeof paymentMethods[typeof method.key]] || ""}
                        onChange={(e) => setPaymentMethods(prev => ({
                          ...prev,
                          [method.key]: { ...(prev[method.key as keyof PaymentMethods] || { enabled: true }), [field]: e.target.value }
                        }))}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={handlePaymentMethodUpdate}
              disabled={saving}
              className="px-6 py-2.5 bg-[#FFCC00] text-[#132A4B] rounded-lg font-medium hover:bg-[#e6b800] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Payment Methods"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
