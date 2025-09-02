import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { useProduct, useFilteredProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { mockInstagramPosts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useProduct(id);
  const { addToCart, loading: cartLoading } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [expandedSections, setExpandedSections] = useState({
    materials: false,
    care: false,
    shipping: false
  });
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  useEffect(() => {
    if (product) {
      // Reset selections when product changes
      setSelectedImage(0);
      setSelectedSize(product.sizes?.[2] || 'M'); // Default to middle size
      setSelectedColor(product.colors?.[0]?.name || 'White');
    }
  }, [product]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get related products using the hook
  const { products: allProducts } = useFilteredProducts('all', null);
  
  const relatedProducts = allProducts.filter(p => 
    p.category === product?.category && p.id !== product?.id
  ).slice(0, 6);

  const collectionProducts = allProducts.filter(p => 
    p.collection === product?.collection && p.id !== product?.id
  ).slice(0, 3);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    const selectedVariant = {
      size: selectedSize,
      color: selectedColor,
      id: `${product.id}-${selectedSize}-${selectedColor}`
    };
    
    const result = await addToCart(product, selectedVariant, 1);
    
    if (result && result.success) {
      setCartSidebarOpen(true);
    } else {
      // Show sidebar anyway to allow user to see cart
      setCartSidebarOpen(true);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <button 
              onClick={() => navigate('/shop')} 
              className="text-[var(--color-text)] hover:text-gray-300 underline"
            >
              Return to Shop
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/shop" className="hover:text-white transition-colors uppercase tracking-wider">
            SHOP
          </Link>
          <span>/</span>
          <Link 
            to={`/shop/category/${product.category.toLowerCase()}`} 
            className="hover:text-white transition-colors uppercase tracking-wider"
          >
            {product.category.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-white uppercase tracking-wider">{product.name.toUpperCase()}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Shows FIRST on mobile, right side on desktop */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-900 overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-white' : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details - Shows SECOND on mobile, left side on desktop */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Product Title - OG Style */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold font-headline uppercase tracking-wider leading-none mb-6">
                {product.name.replace('GRAPHIC TEE', 'Graphic Tee — Scene')} {product.id.toString().padStart(3, '0')}
              </h1>
              <div className="text-lg text-gray-300 leading-relaxed mb-4"
                   dangerouslySetInnerHTML={{ __html: product.description || 'Premium OG merchandise for true fans. Crafted with precision and designed for warriors.' }}>
              </div>
              {/* Telugu accent line */}
              <p className="text-base text-[var(--color-gold)] font-medium mb-8">
                Owning this tee = Owning a piece of the Hungry Cheetah fight scene (హంగ్రీ చీతా సన్నివేశం).
              </p>
            </div>

            {/* Price and Add to Arsenal - MOVED UP */}
            <div className="bg-black/20 border border-red-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-4xl lg:text-5xl font-bold text-red-500">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full bg-red-500 text-white py-4 px-8 font-bold text-lg uppercase tracking-wider hover:bg-red-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-lg border-2 border-red-400"
              >
                {cartLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Adding to Arsenal...
                  </>
                ) : (
                  'ADD TO ARSENAL'
                )}
              </button>
            </div>

            {/* Materials Only - Simplified */}
            <div className="border-t border-gray-800 pt-6">
              <div className="border-b border-gray-800">
                <button
                  onClick={() => toggleSection('materials')}
                  className="w-full flex items-center justify-between py-4 text-left font-medium uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <span>Materials & Details</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${expandedSections.materials ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.materials && (
                  <div className="pb-4 text-gray-300 text-sm space-y-2">
                    <p>• Premium cotton, battle-tested</p>
                    <p>• Screen printed graphics</p>
                    <p>• DVV Entertainment official merchandise</p>
                    <p>• Free shipping on orders above ₹1000</p>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection with OG hover glow */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-[var(--color-red)] bg-[var(--color-red)] text-white shadow-[0_0_15px_rgba(193,18,31,0.6)]'
                        : 'border-[var(--color-steel)] hover:border-[var(--color-red)] hover:shadow-[0_0_10px_rgba(193,18,31,0.4)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection with OG hover glow */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider">Color</h3>
              <div className="flex space-x-3">
                {product.colors?.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`px-4 py-2 border text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                      selectedColor === color.name
                        ? 'border-[var(--color-red)] bg-[var(--color-red)] text-white shadow-[0_0_15px_rgba(193,18,31,0.6)]'
                        : 'border-[var(--color-steel)] hover:border-[var(--color-red)] hover:shadow-[0_0_10px_rgba(193,18,31,0.4)]'
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Guide */}
            <div>
              <button className="flex items-center space-x-2 text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                <span>Size Guide</span>
                <ExternalLink size={16} />
              </button>
            </div>


          </div>
        </div>

        {/* From This Arsenal */}
        {collectionProducts.length > 0 && (
          <div className="mt-20 border-t border-[var(--color-steel)] pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-headline uppercase tracking-wider">From This Arsenal</h2>
              <Link 
                to={`/shop?filter=collection&value=${product.collection}`}
                className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors"
              >
                {product.collection}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionProducts.map((collectionProduct) => (
                <ProductCard key={collectionProduct.id} product={collectionProduct} />
              ))}
            </div>
          </div>
        )}

        {/* You May Also Arm With */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-[var(--color-steel)] pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-headline uppercase tracking-wider">You May Also Arm With</h2>
              <Link 
                to={`/shop/category/${product.category.toLowerCase()}`}
                className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors"
              >
                {product.category}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Fan Army Wall Preview */}
        <div className="mt-20 border-t border-[var(--color-steel)] pt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-headline uppercase tracking-wider mb-4">Fan Army Wall</h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Wear it. Tag #OGTribe → Join the wall.
            </p>
            <p className="text-[var(--color-gold)] font-medium mb-6">
              Every fit tells a story. Every story builds the legend (ప్రతి కథ ఒక పురాణం నిర్మిస్తుంది).
            </p>
            <Link 
              to="/fan-wall" 
              className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors"
            >
              Join the Wall
            </Link>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {mockInstagramPosts.slice(0, 20).map((image, index) => (
              <div key={index} className="aspect-square bg-[var(--color-steel)] overflow-hidden group cursor-pointer border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors">
                <img
                  src={image}
                  alt={`Fan Army post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;