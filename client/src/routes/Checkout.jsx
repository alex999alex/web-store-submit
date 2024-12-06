import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    
  
    if (!isLoggedIn) {
      localStorage.setItem('redirectTo', '/checkout');
      navigate('/login');
    } else {
 
      const cartData = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cartData);
    }
  }, [navigate]);


  const handleCheckout = async () => {
 
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: cartItems }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
 
      localStorage.removeItem('cart');
      navigate('/confirmation');
    } else {
 
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
