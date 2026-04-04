"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { type ContractRecord, type SystemRecord, type SellerRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { LoadingSpinner } from "@/components/ui/loading";

interface ContractForm {
  systemId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  salePrice: string;
}

interface PaymentMethods {
  bank?: { enabled: boolean; bankName?: string; accountName?: string; accountNumber?: string };
  telebirr?: { enabled: boolean; phoneNumber?: string };
  cbe?: { enabled: boolean; accountNumber?: string; accountName?: string };
  awash?: { enabled: boolean; accountNumber?: string; accountName?: string };
}

export default function SellerContractsPage() {
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [products, setProducts] = useState<SystemRecord[]>([]);
  const [seller, setSeller] = useState<SellerRecord | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractRecord | null>(null);
  const [form, setForm] = useState<ContractForm>({
    systemId: "",
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    salePrice: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedSeller = getStoredSeller();
    if (!storedSeller || storedSeller.role !== 'seller') {
      router.push('/auth/login?redirect=/dashboard/seller/contracts');
      return;
    }
    setSeller(storedSeller);

    loadData(storedSeller.sellerId);
  }, [router]);

  const loadData = async (sellerId: string) => {
    try {
      const [contractsData, systemsData, methodsData] = await Promise.all([
        api.contracts.getBySeller(sellerId),
        api.systems.getAll(),
        api.sellerProfile.getPaymentMethods(sellerId)
      ]);
      setContracts(contractsData);
      setProducts(systemsData);
      setPaymentMethods(methodsData as PaymentMethods);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openContractPreview = (contract: ContractRecord) => {
    setSelectedContract(contract);
    setShowContract(true);
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;

    const product = products.find(p => p._id === form.systemId);
    if (!product) return;

    setSaving(true);
    setError(null);

    try {
      await api.contracts.create({
        sellerId: seller.sellerId,
        systemId: form.systemId,
        systemName: product.title,
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        buyerEmail: form.buyerEmail || undefined,
        salePrice: Number(form.salePrice)
      });

      setMessage("Contract created successfully!");
      setShowCreateModal(false);
      setForm({ systemId: "", buyerName: "", buyerPhone: "", buyerEmail: "", salePrice: "" });
      
      const contractsData = await api.contracts.getBySeller(seller.sellerId);
      setContracts(contractsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contract");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContract = async (contractId: string) => {
    if (!seller || !confirm("Are you sure you want to delete this contract?")) return;

    try {
      await api.contracts.delete(contractId);
      setMessage("Contract deleted");
      const contractsData = await api.contracts.getBySeller(seller.sellerId);
      setContracts(contractsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contract");
    }
  };

  const printContract = () => {
    if (!selectedContract) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contract - ${selectedContract.systemName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; min-height: 100vh; background: linear-gradient(135deg, #132A4B 0%, #1a3a5c 100%); }
            .bg-pattern { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-image: url('https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1920'); background-size: cover; background-position: center; opacity: 0.1; }
            .contract-container { position: relative; max-width: 800px; margin: 40px auto; background: white; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #FFCC00; margin-bottom: 30px; }
            .logo { width: 150px; filter: brightness(0); }
            .company-name { font-size: 28px; font-weight: bold; color: #132A4B; }
            .contract-title { font-size: 22px; color: #132A4B; text-align: center; margin: 30px 0; text-transform: uppercase; letter-spacing: 2px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 15px; font-weight: bold; color: #132A4B; border-left: 4px solid #FFCC00; padding-left: 12px; margin-bottom: 12px; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: 600; color: #666; }
            .info-value { color: #333; }
            .amount-box { background: linear-gradient(135deg, #132A4B, #1a3a5c); color: white; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; }
            .amount-label { font-size: 14px; opacity: 0.9; }
            .amount-value { font-size: 32px; font-weight: bold; color: #FFCC00; }
            .terms { background: #f5f5f5; padding: 18px; border-radius: 8px; margin: 20px 0; }
            .terms-title { font-weight: bold; color: #132A4B; margin-bottom: 10px; }
            .terms-list { font-size: 13px; line-height: 1.7; color: #555; padding-left: 18px; }
            .terms-list li { margin-bottom: 6px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; gap: 40px; }
            .sign-box { flex: 1; text-align: center; }
            .sign-line { border-top: 2px solid #333; margin-top: 50px; padding-top: 10px; }
            .sign-label { font-weight: 600; color: #132A4B; }
            .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #888; }
            @media print { body { background: white; } .bg-pattern { display: none; } .contract-container { box-shadow: none; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="bg-pattern"></div>
          <div class="contract-container">
            <div class="header">
              <img src="/logo.png" class="logo" />
              <div class="company-name">Milkyway Systems</div>
              <div style="color:#666;font-size:13px;">Software Development & IT Solutions</div>
            </div>
            <div class="contract-title">Sales Contract</div>
            <div class="section">
              <div class="section-title">Buyer Information</div>
              <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${selectedContract.buyerName}</span></div>
              <div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${selectedContract.buyerPhone}</span></div>
              <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${selectedContract.buyerEmail || 'N/A'}</span></div>
            </div>
            <div class="section">
              <div class="section-title">Product Details</div>
              <div class="info-row"><span class="info-label">System:</span><span class="info-value">${selectedContract.systemName}</span></div>
              <div class="info-row"><span class="info-label">Date:</span><span class="info-value">${new Date(selectedContract.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div class="amount-box">
              <div class="amount-label">Total Sale Amount</div>
              <div class="amount-value">$${selectedContract.salePrice.toLocaleString()}</div>
            </div>
            <div class="terms">
              <div class="terms-title">Terms & Conditions</div>
              <ul class="terms-list">
                <li>Full payment must be completed before system delivery.</li>
                <li>12 months technical support included from delivery date.</li>
                <li>Additional features charged separately.</li>
                <li>This contract is binding upon signature.</li>
              </ul>
            </div>
            <div class="signatures">
              <div class="sign-box"><div class="sign-line">Buyer Signature</div><div style="margin-top:8px;font-size:13px;">${selectedContract.buyerName}</div></div>
              <div class="sign-box"><div class="sign-line">Seller Signature</div><div style="margin-top:8px;font-size:13px;">Milkyway Systems</div></div>
            </div>
            <div class="footer">Generated by Milkyway Systems</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const checkPaymentMethods = () => {
    if (!paymentMethods) return false;
    return Object.values(paymentMethods).some(m => m?.enabled);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const hasPaymentMethods = checkPaymentMethods();
  const draftContracts = contracts.filter(c => c.status === 'draft');
  const usedContracts = contracts.filter(c => c.status === 'used');

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Contracts</h1>
          <p className="dashboard-page-subtitle">Create and manage sales contracts</p>
        </div>
        <button className="d-btn d-btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create Contract
        </button>
      </div>

      {!hasPaymentMethods && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 mb-4">
          <p className="text-yellow-800">
            Please configure your payment methods in <a href="/dashboard/seller/profile" className="underline font-medium">Profile</a> before closing deals.
          </p>
        </div>
      )}

      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {draftContracts.length > 0 && (
        <div className="mb-6">
          <h3 className="dashboard-section-title">Draft Contracts</h3>
          <div className="grid gap-4">
            {draftContracts.map((contract) => (
              <div key={contract._id} className="border rounded-lg p-4 bg-card border-l-4 border-l-[#FFCC00]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{contract.systemName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Buyer: {contract.buyerName} {contract.buyerPhone && `(${contract.buyerPhone})`}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Amount: ${contract.salePrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="d-badge d-badge-warning">Draft</span>
                </div>
                
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button 
                    onClick={() => openContractPreview(contract)}
                    className="d-btn d-btn-sm d-btn-primary"
                  >
                    View Contract
                  </button>
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams({
                        systemId: contract.systemId,
                        systemName: contract.systemName,
                        buyerName: contract.buyerName,
                        buyerPhone: contract.buyerPhone,
                        buyerEmail: contract.buyerEmail || '',
                        salePrice: contract.salePrice.toString(),
                        contractId: contract._id
                      });
                      window.location.href = `/dashboard/seller/deals?${params.toString()}`;
                    }}
                    className="d-btn d-btn-sm d-btn-outline"
                  >
                    Close Deal
                  </button>
                  <button 
                    onClick={() => handleDeleteContract(contract._id)}
                    className="d-btn d-btn-sm d-btn-ghost text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {usedContracts.length > 0 && (
        <div>
          <h3 className="dashboard-section-title">Used Contracts</h3>
          <div className="grid gap-4">
            {usedContracts.map((contract) => (
              <div key={contract._id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{contract.systemName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Buyer: {contract.buyerName} {contract.buyerPhone && `(${contract.buyerPhone})`}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Amount: ${contract.salePrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(contract.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="d-badge d-badge-success">Used</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <button 
                    onClick={() => openContractPreview(contract)}
                    className="d-btn d-btn-sm d-btn-outline"
                  >
                    View Contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contracts.length === 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No contracts yet</p>
              <p className="text-sm text-muted-foreground">Create a contract first, then use it when closing deals</p>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-lg border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create New Contract</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <form onSubmit={handleCreateContract}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select System/Product</label>
                  <select 
                    className="dashboard-search-input w-full" 
                    value={form.systemId}
                    onChange={(e) => setForm(prev => ({ ...prev, systemId: e.target.value }))}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Name</label>
                  <input 
                    type="text" 
                    className="dashboard-search-input w-full" 
                    value={form.buyerName}
                    onChange={(e) => setForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    placeholder="Enter buyer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Phone</label>
                  <input 
                    type="tel" 
                    className="dashboard-search-input w-full" 
                    value={form.buyerPhone}
                    onChange={(e) => setForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
                    placeholder="+2519..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Email (Optional)</label>
                  <input 
                    type="email" 
                    className="dashboard-search-input w-full" 
                    value={form.buyerEmail}
                    onChange={(e) => setForm(prev => ({ ...prev, buyerEmail: e.target.value }))}
                    placeholder="buyer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
                  <input 
                    type="number" 
                    className="dashboard-search-input w-full" 
                    value={form.salePrice}
                    onChange={(e) => setForm(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="Enter sale price"
                    required
                  />
                </div>
              </div>
              <div className="p-4 border-t flex gap-2 justify-end">
                <button type="button" onClick={() => setShowCreateModal(false)} className="d-btn d-btn-outline">Cancel</button>
                <button type="submit" className="d-btn d-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Create Contract"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContract && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto border">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contract Preview</h2>
              <button onClick={() => setShowContract(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #132A4B, #1a3a5c)', minHeight: '400px' }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center', paddingBottom: '15px', borderBottom: '2px solid #FFCC00', marginBottom: '20px' }}>
                  <img src="/logo.png" style={{ width: '120px', filter: 'brightness(0)' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#132A4B' }}>Milkyway Systems</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '18px', color: '#132A4B', margin: '15px 0', fontWeight: 'bold' }}>SALES CONTRACT</div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#132A4B', marginBottom: '8px', fontSize: '13px' }}>BUYER INFO</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#666' }}>Name:</span><span>{selectedContract.buyerName}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#666' }}>Phone:</span><span>{selectedContract.buyerPhone}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#666' }}>Email:</span><span>{selectedContract.buyerEmail || 'N/A'}</span></div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#132A4B', marginBottom: '8px', fontSize: '13px' }}>PRODUCT</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#666' }}>System:</span><span>{selectedContract.systemName}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#666' }}>Date:</span><span>{new Date(selectedContract.createdAt).toLocaleDateString()}</span></div>
                </div>
                <div style={{ background: '#132A4B', color: 'white', padding: '15px', borderRadius: '6px', textAlign: 'center', margin: '15px 0' }}>
                  <div style={{ fontSize: '12px' }}>Amount</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFCC00' }}>${selectedContract.salePrice.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '20px' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ borderTop: '2px solid #333', marginTop: '40px' }}>Buyer</div></div>
                  <div style={{ flex: 1, textAlign: 'center' }}><div style={{ borderTop: '2px solid #333', marginTop: '40px' }}>Seller</div></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <button onClick={() => setShowContract(false)} className="d-btn d-btn-outline">Close</button>
              <button onClick={printContract} className="d-btn d-btn-primary">Print / Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}