"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStoredSeller, type SessionSeller } from "@/lib/session";
import api from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading";
import { Camera, Upload } from "lucide-react";

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
      const result = await api.sellerProfile.update(user.sellerId, {
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
      
      setMessage({ type: 'success', text: 'Payment methods saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save payment methods' });
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
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Profile</h1>
          <p className="dashboard-page-subtitle">Manage your account and payment settings</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Header with Image */}
      <div className="dashboard-card mb-6">
        <div className="dashboard-card-body-padded">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-[#FFCC00] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <Image 
                    src={profileImage.startsWith('http') ? profileImage : `${backendUrl}${profileImage}`}
                    alt="Profile" 
                    width={112} 
                    height={112} 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-[#132A4B]">{user?.name?.charAt(0) || 'S'}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#132A4B] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#1a3a5c] transition-colors"
              >
                {uploadingImage ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <span className="d-badge d-badge-success mt-2">{user?.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="dashboard-card mb-6">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">Account Information</div>
        </div>
        <div className="dashboard-card-body-padded">
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="dashboard-search-input w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="dashboard-search-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="dashboard-search-input w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251..."
                />
              </div>
              <div></div>
              
              <div className="md:col-span-2 pt-4 border-t">
                <h4 className="font-medium mb-3">Change Password</h4>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  className="dashboard-search-input w-full"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="dashboard-search-input w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="d-btn d-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">Payment Methods</div>
          <div className="dashboard-card-subtitle">Add your bank or wallet details for payouts</div>
        </div>
        <div className="dashboard-card-body-padded">
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Telebirr */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">TB</span>
                  </div>
                  <span className="font-medium">Telebirr</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={paymentMethods.telebirr?.enabled || false}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      telebirr: { ...(prev.telebirr || { enabled: false }), enabled: e.target.checked }
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {paymentMethods.telebirr?.enabled && (
                <input
                  type="tel"
                  className="dashboard-search-input w-full"
                  placeholder="+2519..."
                  value={paymentMethods.telebirr?.phoneNumber || ""}
                  onChange={(e) => setPaymentMethods(prev => ({
                    ...prev,
                    telebirr: { ...(prev.telebirr || { enabled: true }), phoneNumber: e.target.value }
                  }))}
                />
              )}
            </div>

            {/* CBE */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">CBE</span>
                  </div>
                  <span className="font-medium">CBE</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={paymentMethods.cbe?.enabled || false}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      cbe: { ...(prev.cbe || { enabled: false }), enabled: e.target.checked }
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {paymentMethods.cbe?.enabled && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Name"
                    value={paymentMethods.cbe?.accountName || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      cbe: { ...(prev.cbe || { enabled: false }), accountName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Number"
                    value={paymentMethods.cbe?.accountNumber || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      cbe: { ...(prev.cbe || { enabled: false }), accountNumber: e.target.value }
                    }))}
                  />
                </div>
              )}
            </div>

            {/* Awash Bank */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">AW</span>
                  </div>
                  <span className="font-medium">Awash Bank</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={paymentMethods.awash?.enabled || false}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      awash: { ...(prev.awash || { enabled: false }), enabled: e.target.checked }
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {paymentMethods.awash?.enabled && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Name"
                    value={paymentMethods.awash?.accountName || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      awash: { ...(prev.awash || { enabled: false }), accountName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Number"
                    value={paymentMethods.awash?.accountNumber || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      awash: { ...(prev.awash || { enabled: false }), accountNumber: e.target.value }
                    }))}
                  />
                </div>
              )}
            </div>

            {/* Other Bank */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">BK</span>
                  </div>
                  <span className="font-medium">Other Bank</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={paymentMethods.bank?.enabled || false}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      bank: { ...(prev.bank || { enabled: false }), enabled: e.target.checked }
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {paymentMethods.bank?.enabled && (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Bank Name"
                    value={paymentMethods.bank?.bankName || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      bank: { ...(prev.bank || { enabled: false }), bankName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Name"
                    value={paymentMethods.bank?.accountName || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      bank: { ...(prev.bank || { enabled: false }), accountName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    className="dashboard-search-input w-full"
                    placeholder="Account Number"
                    value={paymentMethods.bank?.accountNumber || ""}
                    onChange={(e) => setPaymentMethods(prev => ({
                      ...prev,
                      bank: { ...(prev.bank || { enabled: false }), accountNumber: e.target.value }
                    }))}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              type="button" 
              className="d-btn d-btn-primary"
              onClick={handlePaymentMethodUpdate}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Payment Methods"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
