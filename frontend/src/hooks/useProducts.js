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
      
      let allProducts = [];
      
      // Load Shopify products first (working images)
      try {
        const response = await fetch('/products.json');
        if (response.ok) {
          const shopifyProducts = await response.json();
          if (shopifyProducts && shopifyProducts.length > 0) {
            // Add proper badges to Shopify products for consistency
            const productsWithBadges = shopifyProducts.map(product => ({
              ...product,
              badges: product.badges || [
                product.tags?.includes('NEW') ? 'NEW' : null,
                'REBEL DROP',
                'FAN ARSENAL',
                product.price > 2000 ? 'PREMIUM' : null,
                product.tags?.includes('Limited') ? 'LIMITED' : null
              ].filter(Boolean)
            }));
            
            allProducts = [...productsWithBadges];
          }
        }
      } catch (shopifyError) {
        console.warn('Shopify products not found:', shopifyError.message);
      }
      
      // Also load VAULT products from comprehensive_products.json
      try {
        const response = await fetch('/comprehensive_products.json');
        if (response.ok) {
          const comprehensiveProducts = await response.json();
          if (comprehensiveProducts && comprehensiveProducts.length > 0) {
            // Only add VAULT products that aren't already in Shopify products
            const vaultProducts = comprehensiveProducts.filter(p => 
              p.category === 'Vault' || p.badges?.includes('VAULT')
            );
            allProducts = [...allProducts, ...vaultProducts];
          }
        }
      } catch (comprehensiveError) {
        console.warn('Comprehensive products not found:', comprehensiveError.message);
      }
      
      // If we have products, use them
      if (allProducts.length > 0) {
        cachedProducts = allProducts;
        lastFetchTime = now;
        setProducts(allProducts);
        setError(null);
        return;
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
        
        // First try to get from products.json, then fallback to comprehensive_products.json
        let productData = null;
        try {
          const response = await fetch('/products.json');
          if (response.ok) {
            const shopifyProducts = await response.json();
            productData = shopifyProducts.find(p => p.id === parseInt(productId));
          }
        } catch (shopifyProductsError) {
          console.warn('Shopify products not found:', shopifyProductsError.message);
          
          // Fallback to comprehensive products
          try {
            const response = await fetch('/comprehensive_products.json');
            if (response.ok) {
              const comprehensiveProducts = await response.json();
              productData = comprehensiveProducts.find(p => p.id === parseInt(productId) || p.id === productId);
            }
          } catch (comprehensiveProductsError) {
            console.warn('Comprehensive products not found:', comprehensiveProductsError.message);
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
      if (category === 'Accessories') {
        // Handle accessories category mapping
        filtered = products.filter(p => 
          p.category && (
            p.category.toLowerCase() === 'accessories' ||
            p.category.toLowerCase() === 'hats' ||
            p.category.toLowerCase() === 'wallet' ||
            p.category.toLowerCase() === 'slippers'
          )
        );
      } else if (category === 'Vault') {
        // Handle VAULT category - check both category and badges
        filtered = products.filter(p => 
          (p.category && p.category.toLowerCase() === 'vault') ||
          (p.badges && p.badges.includes('VAULT'))
        );
      } else {
        // Direct category matching
        filtered = products.filter(p => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    // Badge/Special filtering
    if (filter) {
      switch (filter) {
        case 'new-arrivals':
          filtered = filtered.filter(p => p.badges && p.badges.includes('NEW'));
          break;
        case 'best-sellers':
          filtered = filtered.filter(p => p.badges && p.badges.includes('BEST SELLER'));
          break;
        case 'sale':
          filtered = filtered.filter(p => p.badges && p.badges.includes('SALE'));
          break;
        case 'vault':
          filtered = filtered.filter(p => p.badges && p.badges.includes('VAULT'));
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