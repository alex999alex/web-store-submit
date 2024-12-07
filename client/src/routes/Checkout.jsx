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
  const [errors, setErrors] = useState({});
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

  // Validate form data
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Address validation
    const addressFields = ['street', 'city', 'province', 'country', 'postal_code'];
    addressFields.forEach(field => {
      if (!address[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required.`;
        valid = false;
      }
    });

    // Payment validation
    if (!payment.credit_card || payment.credit_card.length !== 16) {
      newErrors.credit_card = 'Credit card number must be 16 digits.';
      valid = false;
    }
    if (!payment.credit_expire || !/\d{2}\/\d{2}/.test(payment.credit_expire)) {
      newErrors.credit_expire = 'Expiration date must be in MM/YY format.';
      valid = false;
    }
    if (!payment.credit_cvv || payment.credit_cvv.length !== 3) {
      newErrors.credit_cvv = 'CVV must be 3 digits.';
      valid = false;
    }

    // Cart validation
    if (cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty. Please add items to proceed.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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

    // Validate form before submitting
    if (!validateForm()) return;

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
      {['street', 'city', 'province', 'country', 'postal_code'].map(field => (
        <div className="mb-3" key={field}>
          <label htmlFor={field} className="form-label">{field.replace('_', ' ')}</label>
          <input
            type="text"
            className="form-control"
            id={field}
            name={field}
            value={address[field]}
            onChange={handleAddressChange}
            required
          />
          {errors[field] && <div className="text-danger">{errors[field]}</div>}
        </div>
      ))}

      <h2>Payment Information</h2>
      {['credit_card', 'credit_expire', 'credit_cvv'].map(field => (
        <div className="mb-3" key={field}>
          <label htmlFor={field} className="form-label">{field.replace('_', ' ')}</label>
          <input
            type="text"
            className="form-control"
            id={field}
            name={field}
            value={payment[field]}
            onChange={handlePaymentChange}
            required
          />
          {errors[field] && <div className="text-danger">{errors[field]}</div>}
        </div>
      ))}

      {errors.cart && <div className="text-danger">{errors.cart}</div>}

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
