import { useState, useEffect } from "react";
import Card from "../ui/Card"; 
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const apiHost = import.meta.env.VITE_APP_HOST || "http://localhost:3000";
  const apiUrl = `${apiHost}/api/products/all`; 

  
  useEffect(() => {
    async function fetchUserSession() {
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
    }

    fetchUserSession();
  }, [apiHost]);

  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts(null);
      }
    }

    fetchData();
  }, []);

  
  async function handleLogout() {
    const response = await fetch(`${apiHost}/api/users/logout`, {
      method: "POST",
      credentials: "include", 
    });

    if (response.ok) {
      window.location.href = "/"; 
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h1>Products:</h1>
        {user ? (
          <div className="d-flex align-items-center">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="btn btn-outline-danger ms-2">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        products.map((product, index) => (
          <Card key={index} product={product} showLinks={true} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </>
  );
}
