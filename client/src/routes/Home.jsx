import { useState, useEffect } from "react";
import Card from "../ui/Card"; // Assuming you store the Card in the ui folder

export default function Home() {
  const [products, setProducts] = useState([]);
  const apiHost = import.meta.env.VITE_APP_HOST || "http://localhost:3000";
  const apiUrl = `${apiHost}/api/products/all`; // Assuming your API is fetching products

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

  return (
    <>
      <h1>Products:</h1>
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
