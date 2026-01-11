import { useState, useEffect } from 'react';
import CartContext from './CartContext';

const CART_STORAGE_KEY = 'pizza_cart';

export default function CartProvider({ children }) {
  // Initialize cart from local storage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from local storage:', error);
      return [];
    }
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to local storage:', error);
    }
  }, [cart]);

  const addToCart = (pizza) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === pizza.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...pizza, quantity: 1 }];
    });
  };

  const updateCartQuantity = (pizzaId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== pizzaId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === pizzaId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    // Clear cart from local storage
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from local storage:', error);
    }
  };

  const value = {
    cart,
    addToCart,
    updateCartQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
