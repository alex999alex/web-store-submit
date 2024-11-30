import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Make sure to install js-cookie
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [products, setProducts] = useState([]); // State to store product details
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Get the cart from cookies
    const cart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];
    
    // Fetch product details for each product ID in the cart
    const apiHost = import.meta.env.VITE_APP_HOST;

    // Fetch products based on unique IDs in the cart
    const fetchProducts = async () => {
      const uniqueCartItems = [...new Set(cart)]; // Get unique product IDs
      const productPromises = uniqueCartItems.map(id => 
        fetch(`${apiHost}/api/products/get/${id}`).then(response => response.json())
      );

      try {
        const productDetails = await Promise.all(productPromises);
        console.log('Fetched Products:', productDetails); // Debugging log
        setProducts(productDetails.filter(product => product)); // Filter out any undefined products
        setCartItems(cart);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return products.reduce((acc, product) => {
      // Ensure ID comparison is correct (parse ID to int)
      const quantity = cartItems.filter(item => parseInt(item) === product.id).length;
      return acc + (product.cost ? product.cost * quantity : 0); // Check if cost is defined
    }, 0);
  };

  const handleContinueShopping = () => {
    navigate('/'); // Navigate back to the home page
  };

  const handleCompletePurchase = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const uniqueProducts = [...new Set(cartItems)]; // Get unique product IDs

  return (
    <div className="cart-container">
      <h1>Shopping Cart:</h1>
      {uniqueProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {uniqueProducts.map(id => {
            const product = products.find(p => p.id === parseInt(id)); // Ensure ID is an integer
            const quantity = cartItems.filter(item => item === id).length;
            const total = product ? product.cost * quantity : 0;

            // Construct the image URL safely
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
                  <p>Product not found for ID: {id}</p> // Handle case where product is not found
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