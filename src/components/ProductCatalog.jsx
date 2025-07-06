import React, { useEffect, useState } from "react";

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
         'https://real-time-amazon-data.p.rapidapi.com/influencer-profile?influencer_name=tastemade&country=US',
      
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "5a7456ba40msh1d8a1673153a702p17c13ajsn8be768989851",
              "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
            },
          
          }
         
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
           
        }
        const data = await response.json();
        // Assuming the products are in data.products or similar structure
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-xl">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-xl">Error: {error}</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-xl">
        No products available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-28 h-28 object-cover rounded-xl mb-4"
            />
          )}
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
            {product.name}
          </h3>
          <p className="text-gray-600 text-center mb-2">
            {product.description}
          </p>
          <p className="text-blue-600 font-extrabold mb-4 text-2xl">
            Price: ${product.price}
          </p>

          <div className="flex flex-row w-full gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                               text-white font-semibold py-2 px-4 rounded-xl shadow hover:shadow-xl 
                               transition-all duration-300 transform hover:scale-105 focus:outline-none 
                               focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Buy Now
            </button>

            <button
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 
                               text-white font-semibold py-2 px-4 rounded-xl shadow hover:shadow-xl 
                               transition-all duration-300 transform hover:scale-105 focus:outline-none 
                               focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCatalog;
