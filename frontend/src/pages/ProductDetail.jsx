import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { useProduct, useFilteredProducts, useCart } from '../hooks/useProducts';
import { mockInstagramPosts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useProduct(id);
  const { addToCart, loading: cartLoading } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');
  const [expandedSections, setExpandedSections] = useState({
    materials: false,
    care: false,
    shipping: false
  });

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
    
    if (result.success) {
      // Show success feedback (you could add a toast notification here)
      console.log('✅ Added to cart successfully');
    } else {
      console.error('❌ Failed to add to cart:', result.error);
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
          {/* Left Side - Product Details */}
          <div className="space-y-8">
            {/* Product Title */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none mb-6">
                {product.name}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Materials */}
              <div className="border-b border-gray-800">
                <button
                  onClick={() => toggleSection('materials')}
                  className="w-full flex items-center justify-between py-4 text-left font-medium uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <span>Materials</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${expandedSections.materials ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.materials && (
                  <div className="pb-4 text-gray-300 text-sm">
                    <p>{product.materials}</p>
                  </div>
                )}
              </div>

              {/* Care */}
              <div className="border-b border-gray-800">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full flex items-center justify-between py-4 text-left font-medium uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <span>Care</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${expandedSections.care ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.care && (
                  <div className="pb-4 text-gray-300 text-sm">
                    <p>{product.care}</p>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border-b border-gray-800">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between py-4 text-left font-medium uppercase tracking-wider hover:text-gray-300 transition-colors"
                >
                  <span>Shipping</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${expandedSections.shipping ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.shipping && (
                  <div className="pb-4 text-gray-300 text-sm">
                    <p>{product.shipping}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-sm font-medium uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider">Color</h3>
              <div className="flex space-x-3">
                {product.colors?.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`px-4 py-2 border text-sm font-medium uppercase tracking-wider transition-colors ${
                      selectedColor === color.name
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 hover:border-white'
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

            {/* Price and Add to Bag */}
            <div className="space-y-6">
              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-400">
                <Link to="/shipping" className="underline hover:text-white transition-colors">
                  shipping
                </Link> calculated at checkout
              </p>
              
              <button className="w-full bg-white text-black py-4 px-8 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors">
                Add to Bag
              </button>
            </div>
          </div>

          {/* Right Side - Product Images */}
          <div className="space-y-6">
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
        </div>

        {/* From This Collection */}
        {collectionProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-800 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold uppercase tracking-wider">from this collection</h2>
              <Link 
                to={`/shop?filter=collection&value=${product.collection}`}
                className="text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
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

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-800 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold uppercase tracking-wider">You may also like</h2>
              <Link 
                to={`/shop/category/${product.category.toLowerCase()}`}
                className="text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
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

        {/* Instagram Feed */}
        <div className="mt-20 border-t border-gray-800 pt-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">Follow Axiom</h2>
            <p className="text-gray-400 mb-6">Wear it your way. Tag us on Instagram for your chance to be featured.</p>
            <a 
              href="https://instagram.com" 
              className="text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              Follow Us
            </a>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {mockInstagramPosts.slice(0, 20).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-900 overflow-hidden group cursor-pointer">
                <img
                  src={image}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;