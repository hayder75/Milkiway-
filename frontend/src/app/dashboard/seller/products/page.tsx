"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { type SystemRecord } from "@/lib/api";
import { getStoredSeller } from "@/lib/session";
import { ExternalLink, Eye } from "lucide-react";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<SystemRecord[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const seller = getStoredSeller();
    if (!seller) {
      router.push('/auth/login?redirect=/dashboard/seller/products');
      return;
    }
    api.systems.getAll().then(setProducts).catch(() => setProducts([]));
  }, [router]);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();
    return product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Products</h1>
          <p className="dashboard-page-subtitle">Browse products you can sell</p>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Commission</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="dashboard-list-primary">{product.title}</div>
                    <div className="dashboard-list-secondary">{product.description}</div>
                  </td>
                  <td><span className="d-badge d-badge-neutral">{product.category || "Business"}</span></td>
                  <td style={{ fontWeight: 500 }}>${product.price.toLocaleString()}</td>
                  <td><span className="d-badge d-badge-success">{product.commissionRate}%</span></td>
                  <td>
                    <Link href={`/demo/${product._id}`} className="d-btn d-btn-sm">Demo</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
