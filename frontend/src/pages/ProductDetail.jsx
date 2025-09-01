import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { mockProducts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button 
            onClick={() => navigate('/')} 
            className="text-white hover:text-gray-300 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-900 overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-gray-900 overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-white' : 'border-transparent'
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

          {/* Product Info */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex space-x-2">
              {product.badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                    badge === 'NEW' ? 'bg-white text-black' :
                    badge === 'BEST SELLER' ? 'bg-red-600 text-white' :
                    badge === 'SALE' ? 'bg-green-600 text-white' :
                    'bg-gray-800 text-white'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Product Title and Category */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Premium quality streetwear designed for the modern individual. Crafted with attention to detail and built to last, this piece combines style with functionality for everyday wear.
              </p>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 100% Premium Cotton</li>
                <li>• Regular Fit</li>
                <li>• Pre-shrunk</li>
                <li>• Machine Washable</li>
              </ul>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Size</h3>
              <div className="flex space-x-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border transition-colors ${
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

            {/* Quantity Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-600 hover:border-white transition-colors flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-600 hover:border-white transition-colors flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-white text-black py-4 px-8 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>
              
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full border py-4 px-8 font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-500 bg-opacity-10' 
                    : 'border-gray-600 hover:border-white'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-800 pt-8 space-y-4">
              <div className="text-sm text-gray-400">
                <p>Free shipping on orders over $100</p>
                <p>30-day returns</p>
                <p>Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;