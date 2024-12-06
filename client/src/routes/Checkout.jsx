import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    
    // If the user is not logged in, store the checkout page path and redirect to login
    if (!isLoggedIn) {
      localStorage.setItem('redirectTo', '/checkout');
      navigate('/login');
    } else {
      // If logged in, fetch cart items (example code, replace with your actual logic)
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cartData);
    }
  }, [navigate]);

  // Handle the checkout process
  const handleCheckout = async () => {
    // Example checkout logic (replace with your API call for processing the checkout)
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: cartItems }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // After successful checkout, clear the cart and redirect to the confirmation page
      localStorage.removeItem('cart');
      navigate('/confirmation');
    } else {
      // Handle checkout failure
      console.error('Checkout failed');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      {cartItems.length > 0 && (
        <div>
          <button onClick={handleCheckout} className="btn btn-primary">
            Complete Purchase
          </button>
        </div>
      )}
    </div>
  );
}
