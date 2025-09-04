import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useFilteredProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { initiateUPIPayment } from '../lib/upi';
import { sendOrderToWhatsApp } from '../lib/wa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SizeChips from '../components/SizeChips';
import Scarcity from '../components/Scarcity';
import TrustChips from '../components/TrustChips';
import CartSidebar from '../components/CartSidebar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useProduct(id);
  const { addToCart, loading: cartLoading } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [bundleItems, setBundleItems] = useState([]);
  const [codEnabled, setCodEnabled] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize('M'); // Most fans pick M
      // Initialize bundle items if product has bundles
      if (product.bundle) {
        setBundleItems(product.bundle.map(item => ({ ...item, selected: false })));
      }
    }
  }, [product]);

  // Mock stock data for size chips
  const mockStock = {
    'XS': 5, 'S': 12, 'M': 18, 'L': 22, 'XL': 9, 'XXL': 4
  };

  const calculateTotal = () => {
    let total = product?.price || 0;
    bundleItems.forEach(item => {
      if (item.selected) total += item.price;
    });
    return total;
  };

  const generateOrderId = () => {
    return `OG${Date.now().toString().slice(-6)}`;
  };

  const handleUPIPayment = () => {
    const orderId = generateOrderId();
    const total = calculateTotal();
    
    const items = [
      {
        title: product.name,
        size: selectedSize,
        quantity: 1,
        price: product.price
      },
      ...bundleItems.filter(item => item.selected).map(item => ({
        title: item.id,
        size: 'Default',
        quantity: 1,
        price: item.price
      }))
    ];

    initiateUPIPayment({
      amount: total,
      orderId,
      items,
      customerInfo: { name: 'Customer' }, // In real app, get from form
      upiId: "ogarmory@paytm",
      merchantName: "OG Armory"
    });
  };

  const handleWhatsAppOrder = () => {
    const orderId = generateOrderId();
    const total = calculateTotal();
    
    const items = [
      {
        title: product.name,
        size: selectedSize,
        quantity: 1,
        price: product.price
      },
      ...bundleItems.filter(item => item.selected).map(item => ({
        title: item.id,
        size: 'Default',
        quantity: 1,
        price: item.price
      }))
    ];

    // In real app, this would open a form to collect customer details
    // For now, we'll use placeholder data
    sendOrderToWhatsApp({
      items,
      total,
      customerInfo: {
        name: 'Customer Name',
        phone: '+919876543210',
        address: 'Customer Address'
      },
      orderId,
      paymentMethod: codEnabled ? 'COD' : 'UPI'
    });
  };

  const handleAddToArsenal = async () => {
    if (!product) return;
    
    const selectedVariant = {
      size: selectedSize,
      id: `${product.id}-${selectedSize}`
    };
    
    const result = await addToCart(product, selectedVariant, 1);
    
    if (result && result.success) {
      setCartSidebarOpen(true);
    } else {
      setCartSidebarOpen(true);
    }
  };

  // Get related products
  const { products: allProducts } = useFilteredProducts('all', null);
  const relatedProducts = allProducts.filter(p => 
    p.category === product?.category && p.id !== product?.id
  ).slice(0, 4);

  if (productLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider">Loading Arsenal...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Product Not Found</h2>
            <button 
              onClick={() => navigate('/shop')} 
              className="text-[var(--color-gold)] hover:text-white underline uppercase tracking-wider"
            >
              Return to Armory
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/shop" className="hover:text-white transition-colors uppercase tracking-wider">
            ARMORY
          </Link>
          <span>/</span>
          <Link 
            to={`/shop?category=${product.category.toLowerCase()}`} 
            className="hover:text-white transition-colors uppercase tracking-wider"
          >
            {product.category.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-white uppercase tracking-wider">{product.name?.toUpperCase()}</span>
        </nav>

        {/* Main Product Layout - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Shows FIRST on mobile */}
          <div className="order-1 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery - Show all 7 images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 7).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-900 overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-[var(--color-red)]' 
                        : 'border-gray-700 hover:border-[var(--color-red)]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Shows SECOND on mobile */}
          <div className="order-2 space-y-8">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges?.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-black tracking-wider uppercase bg-[var(--color-red)] text-white"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Scarcity Indicators */}
            <Scarcity 
              stock={mockStock}
              limited={product.badges?.includes('LIMITED')}
              dropEndTime={product.drop_end}
            />

            {/* Size Selection */}
            <SizeChips
              sizes={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
              stock={mockStock}
              mostPopular="L"
            />

            {/* Bundle Add-ons */}
            {bundleItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-wider">Complete the Arsenal</h3>
                <div className="space-y-3">
                  {bundleItems.map((item, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => {
                          const updated = [...bundleItems];
                          updated[index].selected = e.target.checked;
                          setBundleItems(updated);
                        }}
                        className="w-4 h-4 text-[var(--color-red)] bg-black border-gray-600 rounded focus:ring-[var(--color-red)] focus:ring-2"
                      />
                      <span className="flex-1">{item.id}</span>
                      <span className="font-bold">{formatPrice(item.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <TrustChips />

            {/* COD Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cod-toggle"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4 h-4 text-[var(--color-red)] bg-black border-gray-600 rounded focus:ring-[var(--color-red)] focus:ring-2"
              />
              <label htmlFor="cod-toggle" className="text-sm font-medium">
                Cash on Delivery (COD)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Total */}
              <div className="text-right">
                <span className="text-2xl font-bold">
                  Total: {formatPrice(calculateTotal())}
                </span>
              </div>

              {/* Primary Actions */}
              <div className="grid grid-cols-1 gap-4">
                {!codEnabled && (
                  <button
                    onClick={handleUPIPayment}
                    className="w-full bg-[var(--color-red)] text-white py-4 px-6 font-black uppercase tracking-wider hover:bg-opacity-90 transition-all hover:shadow-[0_0_20px_rgba(193,18,31,0.6)]"
                  >
                    Pay by Any UPI App
                  </button>
                )}
                
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 text-white py-4 px-6 font-black uppercase tracking-wider hover:bg-green-700 transition-all"
                >
                  Buy on WhatsApp
                </button>
                
                <button
                  onClick={handleAddToArsenal}
                  disabled={cartLoading}
                  className="w-full border-2 border-[var(--color-red)] text-[var(--color-red)] py-4 px-6 font-black uppercase tracking-wider hover:bg-[var(--color-red)] hover:text-white transition-all"
                >
                  {cartLoading ? 'Adding...' : 'Add to Arsenal'}
                </button>
              </div>
            </div>

            {/* Product Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {product.description || 'Premium OG merchandise for true fans. Crafted with precision and designed for warriors. Every product is a weapon. Every fan is a soldier.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-4xl font-black uppercase tracking-wider mb-12 text-center">
              More from the Arsenal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartSidebarOpen} 
        onClose={() => setCartSidebarOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;