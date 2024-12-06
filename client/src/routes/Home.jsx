import { useState, useEffect } from "react";
import Card from "../ui/Card"; // Assuming you store the Card in the ui folder
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const apiHost = import.meta.env.VITE_APP_HOST || "http://localhost:3000";
  const apiUrl = `${apiHost}/api/products/all`; // Assuming your API is fetching products

  // Fetch user session info
  useEffect(() => {
    async function fetchUserSession() {
      const response = await fetch(`${apiHost}/api/users/getSession`, {
        method: "GET",
        credentials: "include", // Include cookies for session
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // Set the logged-in user info
      } else {
        setUser(null); // If no session, user is not logged in
      }
    }

    fetchUserSession();
  }, [apiHost]);

  // Fetch products
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

  // Handle logout
  async function handleLogout() {
    const response = await fetch(`${apiHost}/api/users/logout`, {
      method: "POST",
      credentials: "include", // Include cookies for session
    });

    if (response.ok) {
      window.location.href = "/"; // Redirect to home page
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
