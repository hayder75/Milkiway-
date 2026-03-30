import { products } from "@/data/mockData";

export default function SellerProductsPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Products</h1>
          <p className="dashboard-page-subtitle">Browse products you can sell</p>
        </div>
      </div>

      <div className="dashboard-search">
        <input type="text" className="dashboard-search-input" placeholder="Search products..." />
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="dashboard-list-primary">{product.name}</div>
                    <div className="dashboard-list-secondary">{product.description}</div>
                  </td>
                  <td><span className="d-badge d-badge-neutral">{product.category}</span></td>
                  <td style={{ fontWeight: 500 }}>${product.price.toLocaleString()}</td>
                  <td><span className="d-badge d-badge-success">{product.commission}%</span></td>
                  <td><button className="d-btn d-btn-sm">Demo</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
