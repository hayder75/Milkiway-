"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api, { type SaleRecord, type SellerRecord, type SystemRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

interface DealForm {
  systemId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  salePrice: string;
  contractImage?: File;
  paymentImage?: File;
  contractPreview?: string;
  paymentPreview?: string;
}

interface ContractData {
  systemName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  salePrice: number;
  sellerName: string;
  date: string;
}

export default function SellerDealsPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerRecord | null>(null);
  const [products, setProducts] = useState<SystemRecord[]>([]);
  const [deals, setDeals] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [prefilledContractId, setPrefilledContractId] = useState<string | null>(null);
  const [form, setForm] = useState<DealForm>({
    systemId: "",
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    salePrice: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showContract, setShowContract] = useState(false);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any>(null);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSeller = getStoredSeller();
    if (!storedSeller) {
      router.push('/auth/login?redirect=/dashboard/seller/deals');
      return;
    }
    setSeller(storedSeller);

    // Check for prefilled contract data from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const systemId = params.get('systemId');
      const systemName = params.get('systemName');
      const buyerName = params.get('buyerName');
      const buyerPhone = params.get('buyerPhone');
      const buyerEmail = params.get('buyerEmail');
      const salePrice = params.get('salePrice');
      const contractId = params.get('contractId');

      if (systemId && buyerName) {
        setForm(prev => ({
          ...prev,
          systemId: systemId || "",
          buyerName: buyerName || "",
          buyerPhone: buyerPhone || "",
          buyerEmail: buyerEmail || "",
          salePrice: salePrice || ""
        }));
        if (contractId) setPrefilledContractId(contractId);
        
        // Clean up URL
        if (window.location.search) {
          window.history.replaceState({}, '', '/dashboard/seller/deals');
        }
      }
    }

    Promise.all([
      api.systems.getAll(), 
      api.sales.getBySeller(storedSeller.sellerId),
      api.sellerProfile.getPaymentMethods(storedSeller.sellerId)
    ])
      .then(([systems, sales, methods]) => {
        setProducts(systems);
        setDeals(sales);
        setPaymentMethods(methods);
      })
      .catch(() => setError("Failed to load seller data"))
      .finally(() => setLoading(false));
  }, [router]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "d-badge-warning";
      case "confirmed": return "d-badge-success";
      case "cancelled": return "d-badge-error";
      default: return "d-badge-neutral";
    }
  };

  const loadDeals = async (sellerId: string) => {
    const sales = await api.sales.getBySeller(sellerId);
    setDeals(sales);
  };

  const filteredDeals = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return deals.filter((deal) => {
      const matchesSearch = deal.systemName.toLowerCase().includes(query) || 
        deal.buyerName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deals, searchTerm, statusFilter]);

  const handleFileChange = (field: 'contractImage' | 'paymentImage', file: File | null) => {
    if (file) {
      setForm(prev => ({
        ...prev,
        [field]: file,
        [field === 'contractImage' ? 'contractPreview' : 'paymentPreview']: URL.createObjectURL(file)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: undefined,
        [field === 'contractImage' ? 'contractPreview' : 'paymentPreview']: undefined
      }));
    }
  };

  const openContractPreview = () => {
    const selectedProduct = products.find(p => p._id === form.systemId);
    if (!selectedProduct || !form.buyerName || !form.salePrice) return;

    setContractData({
      systemName: selectedProduct.title,
      buyerName: form.buyerName,
      buyerPhone: form.buyerPhone,
      buyerEmail: form.buyerEmail,
      salePrice: Number(form.salePrice),
      sellerName: seller?.name || 'Milkyway Systems',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    setShowContract(true);
  };

  const printContract = () => {
    const printContent = contractRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Contract - ${contractData?.systemName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #132A4B; }
            h2 { color: #132A4B; border-bottom: 2px solid #FFCC00; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .value { color: #000; }
            .signature { margin-top: 60px; display: flex; justify-content: space-between; }
            .sign-box { width: 45%; }
            .sign-line { border-top: 1px solid #000; margin-top: 40px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!seller) {
      setError("Please sign in as a seller first");
      return;
    }

    const selectedProduct = products.find((product) => product._id === form.systemId);
    if (!selectedProduct) {
      setError("Choose a product first");
      return;
    }

    setSubmitting(true);
    try {
      let contractImageUrl: string | undefined;
      let paymentImageUrl: string | undefined;

      if (form.contractImage) {
        const uploadResult = await api.upload.single(form.contractImage);
        contractImageUrl = uploadResult.url;
      }

      if (form.paymentImage) {
        const uploadResult = await api.upload.single(form.paymentImage);
        paymentImageUrl = uploadResult.url;
      }

      const status = contractImageUrl && paymentImageUrl ? 'confirmed' : 'pending';

      await api.sales.create({
        sellerId: seller.sellerId,
        systemId: selectedProduct._id,
        systemName: selectedProduct.title,
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        buyerEmail: form.buyerEmail,
        salePrice: Number(form.salePrice),
        sellerCommissionRate: seller.commissionRate,
      });

      if (status === 'confirmed') {
        const newDeals = await api.sales.getBySeller(seller.sellerId);
        const newDeal = newDeals.find((d: SaleRecord) => 
          d.buyerPhone === form.buyerPhone && 
          d.systemId === selectedProduct._id &&
          d.salePrice === Number(form.salePrice)
        );
        if (newDeal) {
          await api.sales.update(newDeal._id, {
            status: 'confirmed',
            contractImage: contractImageUrl,
            paymentImage: paymentImageUrl
          });
          
          // Mark contract as used if coming from a contract
          if (prefilledContractId) {
            try {
              await api.contracts.markAsUsed(prefilledContractId);
            } catch (e) {
              console.error("Failed to mark contract as used:", e);
            }
          }
        }
      }

      setMessage(status === 'confirmed' 
        ? "Deal submitted and confirmed successfully!" 
        : "Deal submitted successfully and is now pending review");
      
      setForm({ 
        systemId: "", 
        buyerName: "", 
        buyerPhone: "", 
        buyerEmail: "", 
        salePrice: "" 
      });
      setShowContract(false);
      
      await loadDeals(seller.sellerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit deal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const canPreview = form.systemId && form.buyerName && form.salePrice;
  
  const hasPaymentMethods = paymentMethods ? Object.values(paymentMethods).some((m: any) => m?.enabled) : false;

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Deals</h1>
          <p className="dashboard-page-subtitle">Submit and track your deals</p>
        </div>
      </div>

      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {!hasPaymentMethods && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-4">
          <p className="text-yellow-800">
            Please configure your payment methods in <a href="/dashboard/seller/profile" className="underline font-medium">Profile</a> before closing deals (uploading contract + payment proof).
          </p>
        </div>
      )}

      <div className="dashboard-card mb-6">
        <div className="dashboard-card-header">
          <div className="dashboard-card-title">Submit New Deal</div>
        </div>
        <div className="dashboard-card-body-padded">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select 
                  className="dashboard-search-input w-full" 
                  value={form.systemId} 
                  onChange={(e) => setForm((current) => ({ ...current, systemId: e.target.value }))} 
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>{product.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
                <input 
                  className="dashboard-search-input w-full" 
                  type="number" 
                  min="0" 
                  placeholder="Enter sale price"
                  value={form.salePrice} 
                  onChange={(event) => setForm((current) => ({ ...current, salePrice: event.target.value }))} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Buyer Name</label>
                <input 
                  className="dashboard-search-input w-full" 
                  placeholder="Enter buyer name"
                  value={form.buyerName} 
                  onChange={(event) => setForm((current) => ({ ...current, buyerName: event.target.value }))} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Buyer Phone</label>
                <input 
                  className="dashboard-search-input w-full" 
                  placeholder="+2519..."
                  value={form.buyerPhone} 
                  onChange={(event) => setForm((current) => ({ ...current, buyerPhone: event.target.value }))} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Buyer Email (Optional)</label>
                <input 
                  className="dashboard-search-input w-full" 
                  type="email" 
                  placeholder="buyer@example.com"
                  value={form.buyerEmail} 
                  onChange={(event) => setForm((current) => ({ ...current, buyerEmail: event.target.value }))} 
                />
              </div>

              <div className="flex items-end">
                <button 
                  type="button" 
                  className="d-btn d-btn-outline w-full"
                  onClick={openContractPreview}
                  disabled={!canPreview}
                >
                  Preview Contract
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Upload Signed Contract</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="dashboard-search-input w-full"
                  onChange={(e) => handleFileChange('contractImage', e.target.files?.[0] || null)}
                />
                {form.contractPreview && (
                  <div className="mt-2">
                    <img src={form.contractPreview} alt="Contract preview" className="h-24 object-contain border rounded" />
                    <button 
                      type="button" 
                      className="text-xs text-red-500 ml-2"
                      onClick={() => handleFileChange('contractImage', null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Upload Payment Proof</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="dashboard-search-input w-full"
                  onChange={(e) => handleFileChange('paymentImage', e.target.files?.[0] || null)}
                />
                {form.paymentPreview && (
                  <div className="mt-2">
                    <img src={form.paymentPreview} alt="Payment preview" className="h-24 object-contain border rounded" />
                    <button 
                      type="button" 
                      className="text-xs text-red-500 ml-2"
                      onClick={() => handleFileChange('paymentImage', null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <button 
                  className="d-btn d-btn-primary" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Deal"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="dashboard-search mb-4">
        <input
          type="text"
          className="dashboard-search-input"
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="dashboard-search-input" 
          style={{ maxWidth: '160px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          {filteredDeals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No deals found</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Client</th>
                  <th>Value</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Documents</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr key={deal._id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{deal.systemName}</span>
                    </td>
                    <td>
                      <div>{deal.buyerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{deal.buyerEmail}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>${deal.salePrice.toLocaleString()}</td>
                    <td style={{ color: '#48a87c', fontWeight: 500 }}>${deal.commissionAmount.toLocaleString()}</td>
                    <td>
                      <span className={`d-badge ${getStatusClass(deal.status)}`}>{deal.status}</span>
                    </td>
                    <td>
                      {deal.contractImage || deal.paymentImage ? (
                        <div className="flex gap-1">
                          {deal.contractImage && (
                            <a href={`${backendUrl}${deal.contractImage}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Contract</a>
                          )}
                          {deal.paymentImage && (
                            <a href={`${backendUrl}${deal.paymentImage}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Payment</a>
                          )}
                        </div>
                      ) : <span className="text-muted-foreground text-xs">-</span>}
                    </td>
                    <td style={{ color: 'var(--muted-foreground)' }}>{new Date(deal.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showContract && contractData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contract Preview</h2>
              <button onClick={() => setShowContract(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="p-6" ref={contractRef}>
              <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', color: '#132A4B', marginBottom: '30px' }}>SALES CONTRACT</h1>
                
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ color: '#132A4B', borderBottom: '2px solid #FFCC00', paddingBottom: '10px', fontSize: '16px' }}>PARTY INFORMATION</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Seller:</span>
                    <span style={{ color: '#000' }}>{contractData.sellerName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Buyer Name:</span>
                    <span style={{ color: '#000' }}>{contractData.buyerName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Buyer Phone:</span>
                    <span style={{ color: '#000' }}>{contractData.buyerPhone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Buyer Email:</span>
                    <span style={{ color: '#000' }}>{contractData.buyerEmail || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ color: '#132A4B', borderBottom: '2px solid #FFCC00', paddingBottom: '10px', fontSize: '16px' }}>PRODUCT DETAILS</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>System/Product:</span>
                    <span style={{ color: '#000' }}>{contractData.systemName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Sale Price:</span>
                    <span style={{ color: '#000', fontWeight: 'bold' }}>${contractData.salePrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold', color: '#555' }}>Contract Date:</span>
                    <span style={{ color: '#000' }}>{contractData.date}</span>
                  </div>
                </div>

                <div style={{ marginTop: '40px' }}>
                  <h2 style={{ color: '#132A4B', borderBottom: '2px solid #FFCC00', paddingBottom: '10px', fontSize: '16px' }}>TERMS & CONDITIONS</h2>
                  <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
                    <li>Payment must be made in full before system delivery.</li>
                    <li>System includes 1-year technical support from date of delivery.</li>
                    <li>Customizations requested after signing may incur additional costs.</li>
                    <li>Both parties agree to the terms outlined in this contract.</li>
                  </ul>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '1px solid #000', marginTop: '50px', paddingTop: '10px' }}>Buyer Signature</div>
                  </div>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '1px solid #000', marginTop: '50px', paddingTop: '10px' }}>Seller Signature</div>
                  </div>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                  Generated by Milkyway Systems
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex gap-2 justify-end">
              <button onClick={() => setShowContract(false)} className="d-btn d-btn-outline">Close</button>
              <button onClick={printContract} className="d-btn d-btn-primary">Print Contract</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}