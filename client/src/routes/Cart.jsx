import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const TAX_RATE = 0.15; 


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


  useEffect(() => {
    const apiHost = import.meta.env.VITE_APP_HOST;
    const fetchUserSession = async () => {
      const response = await fetch(`${apiHost}/api/users/getSession`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    };

    fetchUserSession();
  }, []);


  const updateCartInCookies = (newCart) => {
    if (newCart.length > 0) {
      Cookies.set('cart', newCart.join(','));
    } else {
      Cookies.remove('cart');
    }
    setCartItems(newCart);
  };


  const adjustQuantity = (productId, change) => {
    const stringId = productId.toString();
    const currentCart = [...cartItems];
    const index = currentCart.indexOf(stringId);
    
    if (change > 0) {
  
      currentCart.push(stringId);
    } else if (change < 0 && index !== -1) {
  
      currentCart.splice(index, 1);
    }
    
    updateCartInCookies(currentCart);
  };

 
  const calculateTotals = () => {
    const subtotal = products.reduce((acc, product) => {
      const quantity = cartItems.filter(item => parseInt(item) === product.id).length;
      return acc + (product.cost ? product.cost * quantity : 0);
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };


  const handleLogout = async () => {
    const apiHost = import.meta.env.VITE_APP_HOST;
    const response = await fetch(`${apiHost}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setUser(null);
      navigate('/');
    }
  };

 
  const renderCartItems = () => {
    const uniqueProducts = [...new Set(cartItems)];
    const { subtotal, tax, total } = calculateTotals();

    return (
      <div>
        {uniqueProducts.map(id => {
          const product = products.find(p => p.id === parseInt(id));
          const quantity = cartItems.filter(item => item === id).length;
          const productTotal = product ? product.cost * quantity : 0;

          const imageUrl = product ? `${import.meta.env.VITE_APP_HOST}/api/images/${product.filename}` : '';

          return product ? (
            <div key={id} className="cart-item d-flex align-items-center mb-3">
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="me-3"
                style={{ width: '100px', height: 'auto', objectFit: 'cover' }} 
              />
              <div className="flex-grow-1">
                <h5>{product.name}</h5>
                <p>Price: ${product.cost.toFixed(2)}</p>
                <div className="d-flex align-items-center">
                  <button 
                    onClick={() => adjustQuantity(product.id, -1)} 
                    className="btn btn-sm btn-outline-secondary me-2"
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <span className="me-2">{quantity}</span>
                  <button 
                    onClick={() => adjustQuantity(product.id, 1)} 
                    className="btn btn-sm btn-outline-secondary"
                  >
                    +
                  </button>
                </div>
                <p>Total: ${productTotal.toFixed(2)}</p>
              </div>
            </div>
          ) : null;
        })}

        <div className="cart-summary mt-4">
          <h3>Order Summary</h3>
          <div className="d-flex justify-content-between">
            <span>Sub-total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Tax (15%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="cart-actions mt-3">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-secondary me-2"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/checkout')} 
            className="btn btn-primary"
            disabled={uniqueProducts.length === 0}
          >
            Complete Purchase
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="cart-container container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Shopping Cart</h1>
        {user ? (
          <div className="d-flex align-items-center">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="btn btn-outline-danger ms-2">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Login
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        renderCartItems()
      )}
    </div>
  );
}