import React, { useEffect, useState } from "react";

function CartCatalog() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`);
      if (response.ok) {
        const cartItems = await response.json();
        setCart(cartItems);
      } else {
        console.error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleDeleteProduct(productId);
      return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
      const updatedItem = { ...item, quantity: newQuantity };
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        });
        if (response.ok) {
          setCart((prevCart) =>
            prevCart.map(item =>
              item.id === productId ? updatedItem : item
            )
          );
        } else {
          console.error('Failed to update quantity');
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };
 
  const handleBuyNow = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    alert(`Order placed successfully!\nTotal items: ${totalItems}\nTotal price: $${totalPrice.toFixed(2)}`);

    // Clear cart after successful purchase
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCart([]);
      } else {
        console.error('Failed to clear cart after purchase');
      }
    } catch (error) {
      console.error('Error clearing cart after purchase:', error);
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setCart([]);
        } else {
          console.error('Failed to clear cart');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-xl">Loading cart...</p>
        </div>
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to get started!</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cart Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h2>
              <p className="text-gray-600">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-600">Total Price:</p>
                <p className="text-2xl font-bold text-indigo-600">${getTotalPrice().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
            >
              Clear Cart
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <p className="text-indigo-600 font-bold text-lg">${item.price}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CartCatalog;
