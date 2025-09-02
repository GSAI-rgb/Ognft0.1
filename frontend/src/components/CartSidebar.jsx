import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, itemCount } = useCart();

  if (!isOpen) return null;

  // Calculate totals using same logic as Cart page
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar - Using exact Cart page design */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-black border-l border-gray-800 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header - Same as Cart page */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Your Arsenal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Cart Items - Exact same design as Cart page */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="text-gray-600 mb-6" size={64} />
                <h3 className="text-xl font-semibold mb-2 text-white">Your arsenal is empty</h3>
                <p className="text-gray-400 mb-8">Ready to gear up? Add some weapons to your arsenal.</p>
                <button
                  onClick={() => {
                    navigate('/shop');
                    onClose();
                  }}
                  className="bg-white text-black py-3 px-6 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Cart Items Grid - Same layout as Cart page */}
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-6 border border-gray-800">
                      {/* Product Image - Same as Cart page */}
                      <div className="w-24 h-24 bg-gray-900 overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info - Same as Cart page */}
                      <div className="flex-grow">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          {item.selectedVariant?.category || 'OG MERCH'}
                        </p>
                        <h3 className="text-lg font-medium mb-2 text-white">{item.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {item.selectedVariant?.size && <span>Size: {item.selectedVariant.size}</span>}
                          {item.selectedVariant?.color && <span>Color: {item.selectedVariant.color}</span>}
                          <span>₹{item.price}</span>
                        </div>
                      </div>

                      {/* Quantity Controls - Same as Cart page */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-600 hover:border-white transition-colors flex items-center justify-center text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button - Same as Cart page */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  {/* Continue Shopping - Same as Cart page */}
                  <button
                    onClick={() => {
                      navigate('/shop');
                      onClose();
                    }}
                    className="text-white hover:text-gray-300 transition-colors underline"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Order Summary - Exact same as Cart page */}
                <div className="bg-gray-900 p-6 space-y-6">
                  <h3 className="text-xl font-bold text-white">Order Summary</h3>
                  
                  <div className="space-y-3 text-sm text-white">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-gray-400 p-3 bg-gray-800">
                      Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}

                  <button 
                    className="w-full bg-white text-black py-4 px-6 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                    onClick={() => {
                      // Navigate to Shopify checkout or cart page
                      navigate('/cart');
                      onClose();
                    }}
                  >
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;