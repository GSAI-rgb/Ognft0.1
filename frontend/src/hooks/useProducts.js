import { useState, useEffect, useMemo } from 'react';
import { shopify, useMockDataIfShopifyUnavailable } from '../lib/shopify';
import { mockProducts } from '../data/mock';

// Custom hook for seamless product data management
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Try Shopify Storefront API first
        let productData = await useMockDataIfShopifyUnavailable(
          () => shopify.getProducts(50),
          []
        );
        
        // If no products from Storefront API, try direct JSON fallback
        if (!productData || productData.length === 0) {
          try {
            console.log('🔄 Loading products from direct integration...');
            const response = await fetch('/products.json');
            if (response.ok) {
              const directProducts = await response.json();
              console.log(`✅ Loaded ${directProducts.length} products from direct integration`);
              productData = directProducts;
            } else {
              throw new Error('Failed to load direct products');
            }
          } catch (directError) {
            console.warn('⚠️ Direct integration failed, using mock data:', directError.message);
            productData = mockProducts.map(product => ({
              ...product,
              badges: [...(product.badges || []), 'NEW', 'REBEL DROP']
            }));
          }
        }
        
        setProducts(productData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load products:', err);
        // Final fallback to enhanced mock data
        setProducts(mockProducts.map(product => ({
          ...product,
          badges: [...(product.badges || []), 'NEW', 'REBEL DROP']
        })));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error, refetch: () => window.location.reload() };
};

// Get single product with Shopify integration
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Try to get from Shopify first, fallback to mock
        const productData = await useMockDataIfShopifyUnavailable(
          () => shopify.getProduct(productId),
          mockProducts.find(p => p.id === parseInt(productId))
        );
        
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  return { product, loading, error };
};

// Filter products hook with enhanced functionality
export const useFilteredProducts = (category, filter) => {
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filtering - Enhanced for our product structure
    if (category && category !== 'all' && category !== 'accessories') {
      filtered = filtered.filter(p => 
        p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    } else if (category === 'accessories') {
      // Special handling for accessories - include Hats, Wallet, Slippers
      filtered = filtered.filter(p => 
        p.category && ['hats', 'wallet', 'slippers'].includes(p.category.toLowerCase())
      );
    }

    // Badge/Special filtering
    if (filter) {
      switch (filter) {
        case 'new-arrivals':
          filtered = filtered.filter(p => p.badges.includes('NEW'));
          break;
        case 'best-sellers':
          filtered = filtered.filter(p => p.badges.includes('BEST SELLER'));
          break;
        case 'sale':
          filtered = filtered.filter(p => p.badges.includes('SALE'));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, category, filter]);

  return { 
    products: filteredProducts, 
    allProducts: products,
    loading, 
    error 
  };
};

// Cart management hook
export const useCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const addToCart = async (product, variant, quantity = 1) => {
    setLoading(true);
    try {
      // For demo mode, simulate cart addition
      if (process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN === 'demo-token-12345') {
        const newItem = {
          id: `${product.id}-${variant.id || 'default'}`,
          product,
          variant,
          quantity,
          price: product.price
        };
        
        setCart(prevCart => {
          const existingItemIndex = prevCart.items.findIndex(item => item.id === newItem.id);
          let newItems;
          
          if (existingItemIndex >= 0) {
            newItems = [...prevCart.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            newItems = [...prevCart.items, newItem];
          }
          
          const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return { items: newItems, total };
        });
        
        console.log('🎭 Demo: Added to cart', newItem);
        return { success: true };
      }
      
      // Real Shopify integration would go here
      return { success: true };
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total };
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total };
    });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    loading,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export default useProducts;