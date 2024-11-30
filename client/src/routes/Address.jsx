import { useState, useEffect} from 'react';

export default function Address() {

  const [address, setAddress] = useState(null);

  // fetch address from api
  useEffect(() => {
    async function getUserSession() {
      // const url = "http://localhost:3000/api/users/address";
      const apiHost = import.meta.env.VITE_APP_HOST || 'http://localhost:3000';
      const url = `${apiHost}/api/users/session`;  // Construct the full URL
      
      const response = await fetch(url, {
        method: "GET",
        credentials: 'include' // inlcude cookies in request
      });

      if(response.ok) {
        const data = await response.json();
        setAddress(data);
      }
      else {
        // handle error
      }
    }

    getUserSession();
  }, []);

  return (
    <>
      <h1>My Address</h1>
      {
        address && 
        <div>
          Street: {address.street}<br/>
          City: {address.city}<br/>
          Province: {address.province}<br/>
          Country: {address.country}<br/>
          Postal Code: {address.postal_code}<br/>
        </div>
      }
    </>
  )
}


// export default function Address() {
//   return (
//     <div>
//       <h1>Address</h1>
//       <p>This is the Address page</p>
//     </div>
//   );
// }