import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const apiHost = import.meta.env.VITE_APP_HOST;
    fetch(`${apiHost}/api/products/get/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const addToCart = () => {
    const currentCart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];
    
    currentCart.push(id);
    
    Cookies.set('cart', currentCart.join(','), { expires: 7 });
    alert('Product added to cart!');
  };

  const goBack = () => {
    navigate('/');
  };

  if (!product) {
    return <p>Loading...</p>;
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