import { fetchProducts } from "..";
import React, { useEffect, useState } from "react";

function ProductCard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [addedItems, setAddedItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        if (response.ok) {
          const cartItems = await response.json();
          setCart(cartItems);
        } else {
          console.error('Failed to fetch cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  // Save cart to backend whenever it changes
  // (optional: can be removed if all updates go through API calls)
  // useEffect(() => {
  //   // No localStorage usage anymore
  // }, [cart]);

  const addToCart = async (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        });
        if (response.ok) {
          setCart(prevCart =>
            prevCart.map(item =>
              item.id === product.id ? updatedItem : item
            )
          );
        } else {
          console.error('Failed to update cart item');
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    } else {
      const newItem = { ...product, quantity: 1 };
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (response.ok) {
          const savedItem = await response.json();
          setCart(prevCart => [...prevCart, savedItem]);
        } else {
          console.error('Failed to add cart item');
        }
      } catch (error) {
        console.error('Error adding cart item:', error);
      }
    }

    // Show visual feedback
    setAddedItems(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to E-Commerce
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Items in cart: <span className="font-bold text-indigo-600">{getCartItemCount()}</span>
              </span>
              <button 
                onClick={() => window.location.href = '/cart'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => {
            const isAdded = addedItems.has(product.id);
            const cartItem = cart.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isAdded ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                }`}
              >
                {product.image && (
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {quantity > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {quantity} in cart
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  <p className="text-indigo-600 font-bold text-xl mb-4">${product.price}</p>
                </div>

                {/* Success message */}
                {isAdded && (
                  <div className="mb-3 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold animate-pulse text-center">
                    ✓ Added to cart!
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={isAdded}
                    className={`w-full font-semibold py-3 px-4 rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isAdded 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
                    }`}
                  >
                    {isAdded ? 'Added!' : 'Add to Cart'}
                  </button>

                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
