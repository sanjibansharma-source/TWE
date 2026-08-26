import { useEffect, useState } from 'react';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartCount,
  getCartTotal,
} from './cart';
import './App.css';

const productsUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/products`;

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(productsUrl);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
        setStatus('ready');
      } catch (requestError) {
        setError(requestError.message);
        setStatus('error');
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => addToCart(prev, product));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => removeFromCart(prev, productId));
  };

  const handleQtyChange = (productId, quantity) => {
    setCart((prev) => updateQuantity(prev, productId, quantity));
  };

  const total = getCartTotal(cart);

  return (
    <main className="storefront">
      <header className="store-header">
        <div>
          <p className="eyebrow">The everyday edit</p>
          <h1>Shop the collection</h1>
        </div>
        <div className="cart-summary" aria-label={`${getCartCount(cart)} items in cart`}>
          <span>{getCartCount(cart)} items</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </header>

      {status === 'loading' && <p className="message">Loading products...</p>}
      {status === 'error' && <p className="message error">Could not load products: {error}</p>}
      {status === 'ready' && products.length === 0 && (
        <p className="message">No products are available yet.</p>
      )}

      <section className="product-grid" aria-label="Product list">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              ) : (
                <span className="image-placeholder">No image</span>
              )}
            </div>
            <div className="product-details">
              <div>
                <h2>{product.name}</h2>
                <p>{product.description || 'A considered addition to your everyday.'}</p>
              </div>
              <div className="product-footer">
                <strong>₹{Number(product.price).toFixed(2)}</strong>
                <button type="button" onClick={() => handleAddToCart(product)}>Add to cart</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {cart.length > 0 && (
        <aside className="cart-panel" aria-label="Shopping cart">
          <div className="cart-panel-header"><h2>Your cart</h2><strong>₹{total.toFixed(2)}</strong></div>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <span>{item.name}</span>
              <div className="quantity-controls">
                <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => handleQtyChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.name}`} onClick={() => handleQtyChange(item.id, item.quantity + 1)}>+</button>
                <button type="button" className="remove-button" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </aside>
      )}
    </main>
  );
}

export default App;