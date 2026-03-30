import Link from "next/link";

const purchasedProducts = [
  {
    id: "1",
    name: "E-Commerce Pro",
    category: "E-Commerce",
    purchaseDate: "2026-03-15",
    status: "active",
    price: 2499
  },
];

export default function CustomerProductsPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">My Products</h1>
          <p className="dashboard-page-subtitle">Your purchased software solutions</p>
        </div>
        <Link href="/products" className="d-btn">Browse More</Link>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Purchase Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchasedProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td><span className="d-badge d-badge-neutral">{product.category}</span></td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{product.purchaseDate}</td>
                  <td>
                    <span className="d-badge d-badge-success">{product.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="d-btn d-btn-sm">Access</button>
                      <button className="d-btn d-btn-sm">Download</button>
                    </div>
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
