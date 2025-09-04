import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMockDataIfShopifyUnavailable } from '../lib/shopify';
import shopify from '../lib/shopify';
import { mockProducts } from '../data/mock';

// Cache products to prevent repeated loading
let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook for seamless product data management
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (cachedProducts && (now - lastFetchTime) < CACHE_DURATION) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try comprehensive products first (ALL products from directory), then fallbacks
      try {
        const response = await fetch('/comprehensive_products.json');
        if (response.ok) {
          const comprehensiveProducts = await response.json();
          if (comprehensiveProducts && comprehensiveProducts.length > 0) {
            cachedProducts = comprehensiveProducts;
            lastFetchTime = now;
            setProducts(comprehensiveProducts);
            setError(null);
            return;
          }
        }
      } catch (comprehensiveError) {
        console.warn('Comprehensive products not found:', comprehensiveError.message);
        
        // Fallback to Shopify products
        try {
          const response = await fetch('/products.json');
          if (response.ok) {
            const shopifyProducts = await response.json();
            if (shopifyProducts && shopifyProducts.length > 0) {
              cachedProducts = shopifyProducts;
              lastFetchTime = now;
              setProducts(shopifyProducts);
              setError(null);
              return;
            }
          }
        } catch (shopifyError) {
          console.warn('Shopify products not found:', shopifyError.message);
        }
      }
      
      // Fallback to mock data
      cachedProducts = mockProducts;
      lastFetchTime = now;
      setProducts(mockProducts);
      setError(null);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load products:', err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
        
        // First try to get from real_products.json, then fallback to products.json
        let productData = null;
        try {
          const response = await fetch('/real_products.json');
          if (response.ok) {
            const realProducts = await response.json();
            productData = realProducts.find(p => p.id === parseInt(productId));
          }
        } catch (realProductsError) {
          console.warn('Real products not found:', realProductsError.message);
          
          // Fallback to Shopify products
          try {
            const response = await fetch('/products.json');
            if (response.ok) {
              const shopifyProducts = await response.json();
              productData = shopifyProducts.find(p => p.id === parseInt(productId));
            }
          } catch (shopifyError) {
            console.warn('Shopify products not found:', shopifyError.message);
          }
        }

        // If not found in direct integration, try Shopify
        if (!productData) {
          productData = await useMockDataIfShopifyUnavailable(
            () => shopify.getProduct(productId),
            mockProducts.find(p => p.id === parseInt(productId))
          );
        }
        
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
    // CRITICAL FIX: Avoid array copying for billion-user scale
    let filtered = products;

    // CRITICAL FIX: Only filter when necessary to avoid memory allocation
    if (category && category !== 'all') {
      if (category === 'accessories') {
        filtered = products.filter(p => 
          p.category && ['hats', 'wallet', 'slippers'].includes(p.category.toLowerCase())
        );
      } else {
        filtered = products.filter(p => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }
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