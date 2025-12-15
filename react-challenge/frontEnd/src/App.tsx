import './App.css';
import ProductDetail from './Components/ProductDetail';
import { ProductsProvider, useProducts } from './context/ProductsContext';

function ProductsView() {
  const { products, loading, error, refresh } = useProducts();

  if (loading) return <p className="status">Loading products…</p>;
  if (error) return (
    <div className="status error">
      <p>Could not load products: {error}</p>
      <button onClick={refresh}>Retry</button>
    </div>
  );

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductDetail key={product.id} product={product} />
      ))}
    </div>
  );
}

function App() {
  return (
    <ProductsProvider>
      <main className="page">
        <header className="hero">
          <div>
            <p className="eyebrow">Mini Fullstack Challenge</p>
            <h1>Product Reviews</h1>
            <p className="lede">Browse products and share your thoughts.</p>
          </div>
        </header>

        <ProductsView />
      </main>
    </ProductsProvider>
  );
}

export default App;
