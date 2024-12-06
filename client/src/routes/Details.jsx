import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const apiHost = import.meta.env.VITE_APP_HOST;
    fetch(`${apiHost}/api/products/get/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const adjustQuantity = (change) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const addToCart = () => {
  
    const currentCart = Cookies.get('cart') ? Cookies.get('cart').split(',') : [];
    
    
    const productToAdd = Array(quantity).fill(id.toString());
    
   
    const updatedCart = [...currentCart, ...productToAdd];
    
    
    Cookies.set('cart', updatedCart.join(','), { expires: 7 }); 
    
    alert(`${quantity} product(s) added to cart!`);
  };

  const goBack = () => {
    navigate('/');
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="details-container container">
      <h1>{product.name}</h1>
      <div className="row">
        <div className="col-md-6">
          <img 
            src={`${import.meta.env.VITE_APP_HOST}/api/images/${product.filename}`} 
            alt={product.name} 
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'cover' }} 
          />
        </div>
        <div className="col-md-6">
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Cost:</strong> ${product.cost.toFixed(2)}</p>
          
          <div className="quantity-selector d-flex align-items-center mb-3">
            <button 
              onClick={() => adjustQuantity(-1)} 
              className="btn btn-sm btn-outline-secondary me-2"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="me-2">{quantity}</span>
            <button 
              onClick={() => adjustQuantity(1)} 
              className="btn btn-sm btn-outline-secondary"
            >
              +
            </button>
          </div>

          <div className="total-price mb-3">
            <strong>Total:</strong> ${(product.cost * quantity).toFixed(2)}
          </div>

          <div className="action-buttons">
            <button 
              onClick={addToCart} 
              className="btn btn-primary me-2"
            >
              Add to Cart
            </button>
            <button 
              onClick={goBack} 
              className="btn btn-secondary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}