import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, itemCount, proceedToCheckout } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black font-headline uppercase tracking-wider leading-none mb-4">
            Your Arsenal
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-3xl">
            Ready for battle? Review your weapons and proceed to checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="text-gray-600 mb-8" size={96} />
            <h2 className="text-3xl font-bold mb-4">Your arsenal is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Ready to gear up? Browse our collection and add some weapons to your arsenal.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[var(--color-red)] hover:bg-red-700 text-white py-4 px-8 font-bold uppercase tracking-wider transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-6 p-8 border border-[var(--color-steel)]">
                    <div className="w-32 h-32 bg-gray-900 overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/150x150?text=OG'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150?text=OG';
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                        OG MERCH
                      </p>
                      <h3 className="text-2xl font-bold mb-3">{item.name}</h3>
                      <div className="flex items-center space-x-6 text-[var(--color-text-muted)]">
                        {item.selectedVariant?.size && (
                          <span>Size: <span className="text-white">{item.selectedVariant.size}</span></span>
                        )}
                        <span>Price: <span className="text-white">₹{item.price}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 border border-[var(--color-steel)] hover:border-white transition-colors flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center text-xl font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 border border-[var(--color-steel)] hover:border-white transition-colors flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-6 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-[var(--color-steel)] p-8 sticky top-8">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[var(--color-steel)] pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-[var(--color-red)] hover:bg-red-700 text-white py-4 px-6 font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-3"
                >
                  <span>Order via WhatsApp</span>
                  <ArrowRight size={20} />
                </button>

                <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">🔥 Direct OG Ordering</p>
                  <p className="text-xs text-gray-500">
                    Click above to send your order directly via WhatsApp. We'll confirm details and arrange payment & delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;