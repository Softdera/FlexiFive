import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Custom Hook for Fetching Data
function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [url]);

  return { data, loading };
}

// Product Component
const Product = ({ product, addToCart, updateProductPrice }) => (
  <div style={{ marginBottom: '10px' }}>
    <span>{product.name} - ${product.price}</span>
    <button onClick={() => addToCart(product)} style={{ marginLeft: '10px' }}>Add to Cart</button>
    <button onClick={() => updateProductPrice(product.id)} style={{ marginLeft: '10px' }}>Update Price</button>
  </div>
);

// Shopping Cart Item
const CartItem = ({ item, removeFromCart }) => (
  <div style={{ marginBottom: '10px' }}>
    <span>{item.name} - ${item.price}</span>
    <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>Remove</button>
  </div>
);

// Product List Component with Hooks
const ProductList = () => {
  const { data: products, loading } = useFetch('https://api.example.com/products');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const addToCart = (product) => {
    fetch('https://api.example.com/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => setCart([...cart, data]))
      .catch((error) => console.error('Error adding to cart:', error));
  };

  const removeFromCart = (id) => {
    fetch(`https://api.example.com/cart/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) setCart(cart.filter((item) => item.id !== id));
      })
      .catch((error) => console.error('Error removing from cart:', error));
  };

  const updateProductPrice = (id) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (!productToUpdate) return;

    const updatedProduct = { ...productToUpdate, price: productToUpdate.price + 10 };

    fetch(`https://api.example.com/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(products.map((product) => (product.id === id ? { ...product, price: data.price } : product)));
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <p>Loading products...</p>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={searchInputRef}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />
      <div>
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} addToCart={addToCart} updateProductPrice={updateProductPrice} />
        ))}
      </div>
      <h2>Shopping Cart</h2>
      <div>
        {cart.map((item) => <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />)}
        {cart.length === 0 && <p>Your cart is empty.</p>}
      </div>
    </div>
  );
};

const App = () => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <ProductList />
  </div>
);

export default App;
