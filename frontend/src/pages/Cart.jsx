import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Freedom Graphic Tee",
      category: "Tops",
      price: 85,
      size: "M",
      quantity: 2,
      image: "https://framerusercontent.com/images/TITuLcYSx53fInKnsoSGfE8Xuw.jpg"
    },
    {
      id: 2,
      name: "Freedom Track Pants",
      category: "Bottoms", 
      price: 195,
      size: "L",
      quantity: 1,
      image: "https://framerusercontent.com/images/WCPUxU8le7cGYEMic8GQuKrQTLI.jpg"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <ShoppingBag size={64} className="mx-auto mb-8 text-gray-600" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-white text-black px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-6 border border-gray-800">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-900 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Size: {item.size}</span>
                    <span>${item.price}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/shop')}
              className="text-white hover:text-gray-300 transition-colors underline"
            >
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 space-y-6">
              <h3 className="text-xl font-bold">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-xs text-gray-400 p-3 bg-gray-800">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              <button className="w-full bg-white text-black py-4 px-6 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                <span>Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-xs text-gray-400 space-y-2">
                <p>• Secure checkout</p>
                <p>• Free returns within 30 days</p>
                <p>• Customer support available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;