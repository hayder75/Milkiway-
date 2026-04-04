"use client";

import { useEffect, useState } from "react";
import api, { type SystemPayload, type SystemRecord } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading";

const initialForm: SystemPayload & { images: string[]; videos: string[] } = {
  title: "",
  description: "",
  longDescription: "",
  images: [],
  videos: [],
  demoUrl: "",
  price: 0,
  commissionRate: 15,
  features: [],
  category: "Business",
  isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SystemRecord[]>([]);
  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [featuresInput, setFeaturesInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [videoInputKey, setVideoInputKey] = useState(0);

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file:', file.name, file.size);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload success:', data);
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error instanceof Error ? error.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        setForm(current => ({ ...current, images: [...current.images, url] }));
      }
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        setForm(current => ({ ...current, videos: [...current.videos, url] }));
      }
    }
  };

  const removeImage = (index: number) => {
    setForm(current => ({ ...current, images: current.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index: number) => {
    setForm(current => ({ ...current, videos: current.videos.filter((_, i) => i !== index) }));
  };

  const handleDemoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file);
    if (url) {
      setForm(current => ({ ...current, demoUrl: url }));
    }
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const systems = await api.systems.getAll();
      setProducts(systems);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setFeaturesInput("");
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload: SystemPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription?.trim() || form.description.trim(),
      features: featuresInput
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      image: form.images[0] || "",
      video: form.videos[0] || "",
      demoUrl: form.demoUrl?.trim() || "",
      category: form.category,
      price: form.price,
      commissionRate: form.commissionRate,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await api.systems.update(editingId, payload);
        setMessage("Product updated successfully");
      } else {
        await api.systems.create(payload);
        setMessage("Product created successfully");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (product: SystemRecord) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      longDescription: product.longDescription || product.description,
      images: product.image ? [product.image] : [],
      videos: product.video ? [product.video] : [],
      demoUrl: product.demoUrl || "",
      price: product.price,
      commissionRate: product.commissionRate,
      features: product.features,
      category: product.category || "Business",
      isActive: product.isActive,
    });
    setFeaturesInput(product.features.join(", "));
  };

  const handleDelete = async (id: string) => {
    setMessage(null);

    try {
      await api.systems.delete(id);
      setMessage("Product deleted successfully");
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete product");
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Products</h1>
          <p className="dashboard-page-subtitle">Manage your live product catalog</p>
        </div>
        <button className="d-btn d-btn-primary" onClick={resetForm}>
          {editingId ? "Cancel Edit" : "+ Add Product"}
        </button>
      </div>

      {message ? <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div> : null}

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Product" : "Add New Product"}</h3>
        
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input className="dashboard-search-input" style={{ maxWidth: 'none' }} placeholder="Enter product title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input className="dashboard-search-input" style={{ maxWidth: 'none' }} placeholder="Enter category" value={form.category || ""} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input className="dashboard-search-input" style={{ maxWidth: 'none' }} type="number" min="0" placeholder="Enter price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
            <input className="dashboard-search-input" style={{ maxWidth: 'none' }} type="number" min="0" max="100" placeholder="Enter commission %" value={form.commissionRate || 15} onChange={(event) => setForm((current) => ({ ...current, commissionRate: Number(event.target.value) }))} required />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Short Description</label>
          <input className="dashboard-search-input" style={{ maxWidth: 'none' }} placeholder="Enter short description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Long Description</label>
          <textarea className="dashboard-search-input" style={{ maxWidth: 'none', minHeight: '100px' }} placeholder="Enter detailed description" value={form.longDescription || ""} onChange={(event) => setForm((current) => ({ ...current, longDescription: event.target.value }))} />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
          <input className="dashboard-search-input" style={{ maxWidth: 'none' }} placeholder="Feature 1, Feature 2, Feature 3" value={featuresInput} onChange={(event) => setFeaturesInput(event.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Images (multiple)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload}
              key={imageInputKey}
              className="dashboard-search-input" 
              style={{ maxWidth: 'none' }}
            />
            <input 
              className="dashboard-search-input mt-2" 
              style={{ maxWidth: 'none' }} 
              placeholder="Or paste image URL"
              value={form.images[0]?.startsWith('http') ? form.images[0] : ''}
              onChange={(event) => {
                const url = event.target.value;
                if (url) {
                  setForm(current => ({ ...current, images: [url, ...current.images.filter(i => !i.startsWith('http'))] }));
                }
              }} 
            />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((img, idx) => {
                  const imgSrc = img.startsWith('http') ? img : `http://localhost:5000${img}`;
                  return (
                    <div key={idx} className="relative w-20 h-16 rounded overflow-hidden border">
                      <img src={imgSrc} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Videos (multiple)</label>
            <input 
              type="file" 
              accept="video/*" 
              multiple 
              onChange={handleVideoUpload}
              key={videoInputKey}
              className="dashboard-search-input" 
              style={{ maxWidth: 'none' }}
            />
            <input 
              className="dashboard-search-input mt-2" 
              style={{ maxWidth: 'none' }} 
              placeholder="Or paste video URL"
              value={form.videos[0]?.startsWith('http') ? form.videos[0] : ''}
              onChange={(event) => {
                const url = event.target.value;
                if (url) {
                  setForm(current => ({ ...current, videos: [url, ...current.videos.filter(v => !v.startsWith('http'))] }));
                }
              }} 
            />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            {form.videos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.videos.map((vid, idx) => {
                  const isExternal = vid.startsWith('http');
                  return (
                    <div key={idx} className="relative w-24 h-16 rounded overflow-hidden border bg-muted">
                      {isExternal ? (
                        <video src={vid} className="w-full h-full object-cover" controls />
                      ) : (
                        <video src={`http://localhost:5000${vid}`} className="w-full h-full object-cover" />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeVideo(idx)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo File</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.zip" 
              onChange={handleDemoUpload}
              className="dashboard-search-input" 
              style={{ maxWidth: 'none' }}
            />
            <input 
              className="dashboard-search-input mt-2" 
              style={{ maxWidth: 'none' }} 
              placeholder="Or paste demo URL"
              value={form.demoUrl?.startsWith('http') ? form.demoUrl : ''}
              onChange={(event) => setForm((current) => ({ ...current, demoUrl: event.target.value }))} 
            />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            {form.demoUrl && <p className="text-xs text-muted-foreground mt-1">Demo file added</p>}
          </div>
        </div>

        <div className="mt-4">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem" }}>
            <input type="checkbox" checked={form.isActive ?? true} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Active product
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button className="d-btn d-btn-primary" type="submit" disabled={saving || uploading}>
            {saving ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Saving...
              </span>
            ) : editingId ? "Update Product" : "Create Product"}
          </button>
          <button className="d-btn" type="button" onClick={resetForm} disabled={saving}>Reset</button>
        </div>
        </form>
      </div>

      <div className="dashboard-card" style={{ marginTop: "1rem" }}>
        <div className="dashboard-card-body">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="dashboard-list-primary">{product.title}</div>
                      <div className="dashboard-list-secondary">{product.description}</div>
                    </td>
                    <td><span className="d-badge d-badge-neutral">{product.category || "Business"}</span></td>
                    <td style={{ fontWeight: 500 }}>${product.price.toLocaleString()}</td>
                    <td><span className="d-badge d-badge-success">{product.commissionRate}%</span></td>
                    <td><span className={`d-badge ${product.isActive ? "d-badge-success" : "d-badge-neutral"}`}>{product.isActive ? "active" : "inactive"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="d-btn d-btn-sm" type="button" onClick={() => startEditing(product)}>Edit</button>
                        <button className="d-btn d-btn-sm" type="button" onClick={() => handleDelete(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
