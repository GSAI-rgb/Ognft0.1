import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { addToShopifyCart, getShopifyCheckoutUrl } from '../lib/shopify';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      // CRITICAL FIX: Avoid array spread operators for billion-user scale
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.slice(); // More memory efficient than spread
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
      } else {
        newItems = state.items.concat(action.payload); // More efficient than spread
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  loading: false,
  checkoutUrl: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('axm-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.warn('Failed to load saved cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('axm-cart', JSON.stringify({
      items: state.items,
      total: state.total
    }));
  }, [state.items, state.total]);

  const addToCart = async (product, variant, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const cartItem = {
        id: `${product.id}-${variant?.size || 'default'}-${variant?.color || 'default'}`,
        name: product.name,
        images: product.images,
        selectedVariant: variant,
        quantity,
        price: product.price
      };

      // For now, add directly to local cart (can integrate with Shopify later)
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      console.log('✅ Added to cart:', cartItem);
      return { success: true };
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCheckoutUrl = () => {
    return getShopifyCheckoutUrl(state.cartId);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCheckoutUrl,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;