import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-black border-l-2 border-red-500 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-500/30">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="text-red-500" size={24} />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Arsenal ({itemCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 text-lg mb-2">Your arsenal is empty</p>
              <p className="text-gray-500 text-sm">Add some weapons to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-900/50 border border-red-500/20 rounded-lg p-4">
                  {/* Product Image & Info */}
                  <div className="flex space-x-4">
                    <img
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded bg-gray-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {item.selectedVariant?.size && `Size: ${item.selectedVariant.size}`}
                        {item.selectedVariant?.color && ` • Color: ${item.selectedVariant.color}`}
                      </p>
                      <p className="text-red-500 font-bold text-lg mt-1">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3 bg-black/50 rounded-lg border border-red-500/30">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-bold px-2 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Checkout */}
        {items.length > 0 && (
          <div className="border-t border-red-500/30 p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 text-lg">Total:</span>
              <span className="text-2xl font-bold text-red-500">₹{total.toFixed(2)}</span>
            </div>
            
            <button className="w-full bg-red-500 text-white py-4 px-6 font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-red-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 border-2 border-red-400">
              Proceed to Checkout
            </button>
            
            <p className="text-center text-gray-400 text-xs mt-3">
              Secure checkout • Free shipping on orders above ₹1000
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;