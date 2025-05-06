import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(id, quantity);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Items ({totalItems})</h2>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {items.map(item => (
                  <div key={item._id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 sm:ml-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/products/${item._id}`} className="hover:text-indigo-600">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4 text-lg font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            type="button"
                            className="p-2 text-gray-600 hover:text-gray-900"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            type="number"
                            className="w-12 text-center border-0 focus:ring-0"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <button
                            type="button"
                            className="p-2 text-gray-600 hover:text-gray-900"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item._id)}
                          className="text-sm text-red-600 hover:text-red-500 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900 font-medium">₹{totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900 font-medium">
                      {totalPrice >= 50 ? 'Free' : '₹4.99'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax</p>
                    <p className="text-gray-900 font-medium">₹{(totalPrice * 0.07).toFixed(2)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="text-lg font-medium text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(totalPrice + (totalPrice >= 50 ? 0 : 4.99) + (totalPrice * 0.07)).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    We accept all major credit cards and PayPal
                  </p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <svg className="h-8 w-auto text-gray-400" viewBox="0 0 36 24" fill="none">
                      <rect width="36" height="24" rx="4" fill="#EEEEEE" />
                      <path d="M10.5 16.5H13.5L15 9H12L10.5 16.5Z" fill="#4B4B4B" />
                      <path d="M17.25 9C15.75 9 14.25 10.125 13.875 12C13.125 15.375 15.75 16.5 17.25 16.5C18.75 16.5 20.625 15.375 21 12C21.75 10.125 18.75 9 17.25 9Z" fill="#4B4B4B" />
                      <path d="M25.5 9H22.5C22.125 9 21.75 9.375 21.75 9.75L20.25 16.5H23.25L24.75 9.75C24.75 9.375 25.125 9 25.5 9Z" fill="#4B4B4B" />
                    </svg>
                    <svg className="h-8 w-auto text-gray-400" viewBox="0 0 36 24" fill="none">
                      <rect width="36" height="24" rx="4" fill="#EEEEEE" />
                      <path d="M22.5 15C22.5 16.65 21.15 18 19.5 18H13.5C11.85 18 10.5 16.65 10.5 15V9C10.5 7.35 11.85 6 13.5 6H19.5C21.15 6 22.5 7.35 22.5 9V15Z" fill="#4B4B4B" />
                      <path d="M25.5 15C25.5 16.65 24.15 18 22.5 18H19.5C21.15 18 22.5 16.65 22.5 15V9C22.5 7.35 21.15 6 19.5 6H22.5C24.15 6 25.5 7.35 25.5 9V15Z" fill="#767677" />
                    </svg>
                    <svg className="h-8 w-auto text-gray-400" viewBox="0 0 36 24" fill="none">
                      <rect width="36" height="24" rx="4" fill="#EEEEEE" />
                      <path d="M18 15C19.6569 15 21 13.6569 21 12C21 10.3431 19.6569 9 18 9C16.3431 9 15 10.3431 15 12C15 13.6569 16.3431 15 18 15Z" fill="#4B4B4B" />
                      <path d="M25.5 9.75C25.5 9.33579 25.1642 9 24.75 9H23.25C22.8358 9 22.5 9.33579 22.5 9.75V14.25C22.5 14.6642 22.8358 15 23.25 15H24.75C25.1642 15 25.5 14.6642 25.5 14.25V9.75Z" fill="#4B4B4B" />
                      <path d="M13.5 9.75C13.5 9.33579 13.1642 9 12.75 9H11.25C10.8358 9 10.5 9.33579 10.5 9.75V14.25C10.5 14.6642 10.8358 15 11.25 15H12.75C13.1642 15 13.5 14.6642 13.5 14.25V9.75Z" fill="#4B4B4B" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;