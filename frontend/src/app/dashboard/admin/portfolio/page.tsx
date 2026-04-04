"use client";

import { useEffect, useState } from "react";
import api, { type PortfolioRecord, type PortfolioPayload } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Video, X } from "lucide-react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading";

const initialForm: PortfolioPayload = {
  title: "",
  client: "",
  category: "Logo Design",
  description: "",
  image: "",
  images: [],
  video: "",
  size: "medium",
  services: [],
  tags: [],
  isActive: true,
};

const categories = ["Logo Design", "Brand Identity", "Visual Identity", "Packaging", "Web Design", "Illustration"];
const sizes = [
  { value: "small", label: "Small", description: "1x1 grid cell" },
  { value: "medium", label: "Medium", description: "1x1.5 grid cell" },
  { value: "large", label: "Large", description: "1x2 grid cell" },
];

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioRecord[]>([]);
  const [form, setForm] = useState<PortfolioPayload>(initialForm);
  const [servicesInput, setServicesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file);
    if (url) {
      setForm(current => ({ ...current, image: url }));
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        setForm(current => ({ ...current, images: [...current.images, url] }));
      }
    }
  };

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const data = await api.portfolio.getAll();
      setPortfolio(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPortfolio();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setServicesInput("");
    setTagsInput("");
    setNewImageUrl("");
    setEditingId(null);
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload: PortfolioPayload = {
      ...form,
      title: form.title.trim(),
      client: form.client.trim(),
      description: form.description.trim(),
      image: form.image?.trim() || "",
      video: form.video?.trim() || "",
      services: servicesInput.split(",").map(s => s.trim()).filter(Boolean),
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
    };

    try {
      if (editingId) {
        await api.portfolio.update(editingId, payload);
        setMessage("Project updated successfully");
      } else {
        await api.portfolio.create(payload);
        setMessage("Project created successfully");
      }
      resetForm();
      await loadPortfolio();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (item: PortfolioRecord) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      client: item.client,
      category: item.category,
      description: item.description,
      image: item.image || "",
      images: item.images || [],
      video: item.video || "",
      size: item.size,
      services: item.services,
      tags: item.tags,
      isActive: item.isActive,
    });
    setServicesInput(item.services.join(", "));
    setTagsInput(item.tags.join(", "));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setMessage(null);
    try {
      await api.portfolio.delete(id);
      setMessage("Project deleted successfully");
      if (editingId === id) resetForm();
      await loadPortfolio();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Creative Studio Portfolio</h1>
          <p className="dashboard-page-subtitle">Manage design projects for the public portfolio</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className="d-btn" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Mode" : "Preview Grid"}
          </button>
          <button className="d-btn d-btn-primary" onClick={resetForm}>
            {editingId ? "Cancel Edit" : "+ Add Project"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`dashboard-card ${message.includes("Failed") ? "border-red-500" : ""}`} style={{ marginBottom: "1rem", padding: "1rem" }}>
          {message}
        </div>
      )}

      {previewMode ? (
        <div className="dashboard-card">
          <div className="dashboard-card-body">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {portfolio.map((item) => (
                <div key={item._id} className="break-inside-avoid">
                  <div className="relative overflow-hidden rounded-xl bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={item.size === "large" ? 350 : item.size === "medium" ? 280 : 200}
                        className="w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground uppercase">{item.category}</span>
                      <h3 className="font-medium mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.client}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {portfolio.length === 0 && <p className="text-center py-8 text-muted-foreground">No projects yet</p>}
          </div>
        </div>
      ) : (
        <form className="dashboard-card" onSubmit={handleSubmit}>
          <div className="dashboard-card-body" style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Project title" 
                  value={form.title} 
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client *</label>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Client name" 
                  value={form.client} 
                  onChange={(e) => setForm(prev => ({ ...prev, client: e.target.value }))} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select 
                  className="dashboard-search-input"
                  value={form.category} 
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grid Size</label>
                <select 
                  className="dashboard-search-input"
                  value={form.size} 
                  onChange={(e) => setForm(prev => ({ ...prev, size: e.target.value as "small" | "medium" | "large" }))}
                >
                  {sizes.map(s => <option key={s.value} value={s.value}>{s.label} - {s.description}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                className="dashboard-search-input" 
                placeholder="Project description..." 
                value={form.description} 
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} 
                rows={4}
                required
              />
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              <div>
                <label className="block text-sm font-medium mb-1">Main Image *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleMainImageUpload}
                  className="dashboard-search-input" 
                />
                <input 
                  className="dashboard-search-input mt-2" 
                  placeholder="Or paste image URL"
                  value={form.image?.startsWith('http') ? form.image : ''}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                />
                {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                {form.image && (
                  <div className="mt-2 relative w-32 h-20 rounded overflow-hidden border">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
                <input 
                  className="dashboard-search-input" 
                  placeholder="https://youtube.com/..." 
                  value={form.video || ""} 
                  onChange={(e) => setForm(prev => ({ ...prev, video: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gallery Images (additional)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleGalleryUpload}
                className="dashboard-search-input mb-2"
              />
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Add image URL..." 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                />
                <button type="button" className="d-btn" onClick={addImageUrl}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.images.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-20 h-16 rounded overflow-hidden border">
                        <Image src={img} alt={`Gallery ${idx}`} width={80} height={64} className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Users can view all these images in the detail page</p>
            </div>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div>
                <label className="block text-sm font-medium mb-1">Services (comma separated)</label>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Logo Design, Brand Guidelines, etc." 
                  value={servicesInput} 
                  onChange={(e) => setServicesInput(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Tech, Startup, B2B, etc." 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                />
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem" }}>
              <input 
                type="checkbox" 
                checked={form.isActive} 
                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} 
              />
              Active (show on public page)
            </label>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button className="d-btn d-btn-primary" type="submit" disabled={saving || uploading}>
                {saving || uploading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Saving...
                  </span>
                ) : editingId ? "Update Project" : "Create Project"}
              </button>
              <button className="d-btn" type="button" onClick={resetForm} disabled={saving || uploading}>Reset</button>
            </div>
          </div>
        </form>
      )}

      <div className="dashboard-card" style={{ marginTop: "1rem" }}>
        <div className="dashboard-card-body">
          <h3 className="text-lg font-medium mb-4">All Projects ({portfolio.length})</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : portfolio.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No projects yet. Add your first project above.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {portfolio.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="w-24 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} width={96} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium truncate">{item.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{item.client}</p>
                        </div>
                        <span className={`d-badge ${item.isActive ? "d-badge-success" : "d-badge-neutral"}`}>
                          {item.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">{item.category}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded capitalize">{item.size}</span>
                        <span className="text-xs text-muted-foreground">{item.images?.length || 0} images</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <button className="d-btn d-btn-sm" onClick={() => startEditing(item)}>Edit</button>
                    <button className="d-btn d-btn-sm text-red-500" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}