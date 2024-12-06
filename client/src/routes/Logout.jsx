import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Logout() {
  const [status, setStatus] = useState("Logging out...");
  const navigate = useNavigate();
  const setIsLoggedIn = useOutletContext(); // Get setIsLoggedIn from Outlet context

  useEffect(() => {
    async function logout() {
      const apiHost = import.meta.env.VITE_APP_HOST || 'http://localhost:3000';
      const url = `${apiHost}/api/users/logout`;  

      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: 'include', // Include cookies to clear session
        });

        if (response.ok) {
          localStorage.removeItem('token'); // Remove token from local storage
          setIsLoggedIn(false); // Update login state in parent component
          setStatus('You have been successfully logged out.');
        } else {
          setStatus('Error logging out. Please try again.');
        }
      } catch (error) {
        setStatus('Network error. Please try again.');
      }
    }

    logout();
  }, []); 

  return (
    <div className="container mt-5">
      <h1>Logout</h1>
      <p>{status}</p>
      <div>
        <button 
          onClick={() => navigate('/login')} 
          className="btn btn-primary me-2"
        >
          Go to Login
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-secondary"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}