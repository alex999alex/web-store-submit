import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    province: '',
    country: '',
    postal_code: ''
  });
  const [payment, setPayment] = useState({
    credit_card: '',
    credit_expire: '',
    credit_cvv: ''
  });
  const [invoice, setInvoice] = useState({
    invoice_amt: 0,
    invoice_tax: 0,
    invoice_total: 0
  });
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

    // Fetch user session
    const fetchUserSession = async () => {
      const response = await fetch(`${apiHost}/api/users/getSession`, {
        method: 'GET',
        credentials: 'include',
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

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = products.reduce((acc, product) => {
      const quantity = cartItems.filter(item => parseInt(item) === product.id).length;
      return acc + (product.cost ? product.cost * quantity : 0);
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  // Handle form change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle purchase submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subtotal, tax, total } = calculateTotals();
    setInvoice({
      invoice_amt: subtotal,
      invoice_tax: tax,
      invoice_total: total
    });

    const cart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];

    const response = await fetch(`${import.meta.env.VITE_APP_HOST}/api/products/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...address,
        ...payment,
        cart: cart.join(','),
        invoice_amt: subtotal,
        invoice_tax: tax,
        invoice_total: total
      })
    });

    if (response.ok) {
      navigate('/confirmation');
    } else {
      console.error('Error during purchase:', await response.json());
    }
  };

  // Render form fields
  const renderFormFields = () => (
    <>
      <h2>Shipping Information</h2>
      <div className="mb-3">
        <label htmlFor="street" className="form-label">Street</label>
        <input
          type="text"
          className="form-control"
          id="street"
          name="street"
          value={address.street}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">City</label>
        <input
          type="text"
          className="form-control"
          id="city"
          name="city"
          value={address.city}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="province" className="form-label">Province</label>
        <input
          type="text"
          className="form-control"
          id="province"
          name="province"
          value={address.province}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">Country</label>
        <input
          type="text"
          className="form-control"
          id="country"
          name="country"
          value={address.country}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="postal_code" className="form-label">Postal Code</label>
        <input
          type="text"
          className="form-control"
          id="postal_code"
          name="postal_code"
          value={address.postal_code}
          onChange={handleAddressChange}
          required
        />
      </div>

      <h2>Payment Information</h2>
      <div className="mb-3">
        <label htmlFor="credit_card" className="form-label">Credit Card Number</label>
        <input
          type="text"
          className="form-control"
          id="credit_card"
          name="credit_card"
          value={payment.credit_card}
          onChange={handlePaymentChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="credit_expire" className="form-label">Expiration Date</label>
        <input
          type="text"
          className="form-control"
          id="credit_expire"
          name="credit_expire"
          value={payment.credit_expire}
          onChange={handlePaymentChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="credit_cvv" className="form-label">CVV</label>
        <input
          type="text"
          className="form-control"
          id="credit_cvv"
          name="credit_cvv"
          value={payment.credit_cvv}
          onChange={handlePaymentChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">Complete Purchase</button>
    </>
  );

  return (
    <div className="checkout-container container">
      <h1>Checkout</h1>
      {user ? (
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
        </form>
      ) : (
        <p>You need to be logged in to complete your purchase.</p>
      )}
    </div>
  );
}
