import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Make sure to install js-cookie

export default function Details() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to store product details
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Fetch product details from the API
    const apiHost = import.meta.env.VITE_APP_HOST;
    fetch(`${apiHost}/api/products/get/${id}`) // Adjust the endpoint as necessary
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const addToCart = () => {
    // Get the current cart from cookies
    const currentCart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];
    
    // Add the current product ID to the cart
    currentCart.push(id);
    
    // Save the updated cart back to cookies
    Cookies.set('cart', currentCart.join(','), { expires: 7 }); // Expires in 7 days
    alert('Product added to cart!');
  };

  const goBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  if (!product) {
    return <p>Loading...</p>; // Show a loading message while fetching
  }

  return (
    <div className="details-container">
      <h1>{product.name}</h1>
      <img 
        src={`${import.meta.env.VITE_APP_HOST}/api/images/${product.filename}`} 
        alt={product.name} 
        style={{ width: '300px', height: 'auto', objectFit: 'cover' }} 
      />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Cost: ${product.cost}</strong></p>
      
      <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
      <button onClick={goBack} className="btn btn-secondary">Go Back</button>
    </div>
  );
}