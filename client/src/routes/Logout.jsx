import { useEffect, useState } from "react"

export default function Logout() {
  const [status, setStatus] = useState("Logging out...");
  
  useEffect(() => {
    async function logout() {
      // const url = "http://localhost:3000/api/users/logout";
      const apiHost = import.meta.env.VITE_APP_HOST || 'http://localhost:3000';
      const url = `${apiHost}/api/users/session`;  // Construct the full URL
      
      const response = await fetch(url, {
        method: "POST",
        credentials: 'include' // inlcude cookies in request
      });

      if(response.ok) {        
        setStatus('You are successfully logged out.');
      }
      else {
        setStatus('Error encountered. Try again.');
      }
    }

    logout();
  }, []);

  return (
    <>
      <h1>Logout</h1>
      <p>{ status }</p>
    </>
  )
}