import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];
    const apiHost = import.meta.env.VITE_APP_HOST;

    const fetchProducts = async () => {
      const uniqueCartItems = [...new Set(cart)];
      const productPromises = uniqueCartItems.map(id => 
        fetch(`${apiHost}/api/products/get/${id}`).then(response => response.json())
      );

      try {
        const productDetails = await Promise.all(productPromises);
        setProducts(productDetails.filter(product => product));
        setCartItems(cart);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const calculateSubtotal = () => {
    return products.reduce((acc, product) => {
      const quantity = cartItems.filter(item => parseInt(item) === product.id).length;
      return acc + (product.cost ? product.cost * quantity : 0);
    }, 0);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleCompletePurchase = () => {
    navigate('/checkout');
  };

  const uniqueProducts = [...new Set(cartItems)];

  return (
    <div className="cart-container">
      <h1>Shopping Cart:</h1>
      {uniqueProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {uniqueProducts.map(id => {
            const product = products.find(p => p.id === parseInt(id));
            const quantity = cartItems.filter(item => item === id).length;
            const total = product ? product.cost * quantity : 0;
            const imageUrl = product ? `${import.meta.env.VITE_APP_HOST}/api/images/${product.filename}` : '';

            return (
              <div key={id} className="cart-item">
                {product ? (
                  <>
                    <img 
                      src={imageUrl} 
                      alt={product.name} 
                      style={{ width: '100px', height: 'auto', objectFit: 'cover' }} 
                    />
                    <h5>{product.name}</h5>
                    <p>Price: ${product.cost.toFixed(2)}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Total: ${total.toFixed(2)}</p>
                  </>
                ) : (
                  <p>Product not found for ID: {id}</p>
                )}
              </div>
            );
          })}
          <h3>Subtotal: ${calculateSubtotal().toFixed(2)}</h3>
          <button onClick={handleContinueShopping} className="btn btn-secondary">Continue Shopping</button>
          <button onClick={handleCompletePurchase} className="btn btn-primary">Complete Purchase</button>
        </div>
      )}
    </div>
  );
}