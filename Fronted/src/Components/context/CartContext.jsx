import React, { createContext, useState, useEffect, useContext } from "react";
import { addToCart as apiAddToCart } from "../../libs/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);

        const normalizedCart = parsedCart.map((item) => ({
          productId: item.productId?._id || item.productId,
          quantity: item.quantity,
          color: item.color || "",
          size: item.size || "",
          imageUrl: item.imageUrl || "",
        }));

        // Merge duplicates only if productId + color + size match
        const mergedCart = [];
        normalizedCart.forEach((item) => {
          const existing = mergedCart.find(
            (x) =>
              x.productId === item.productId &&
              x.color === item.color &&
              x.size === item.size
          );
          if (existing) existing.quantity += item.quantity;
          else mergedCart.push(item);
        });

        setCart(mergedCart);
      } catch (err) {
        console.error(err);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add Item
  const addItemToCart = async (
    productId,
    quantity = 1,
    color = "",
    size = "",
    imageUrl = ""
  ) => {
    if (!user) throw new Error("User must be logged in to add items to cart.");

    await apiAddToCart(productId, quantity, color, size);

    // Always add as new item, no merging
    setCart([...cart, { productId, quantity, color, size, imageUrl }]);
  };

  // Remove Item
  const removeCartItem = (productId, color = "", size = "") => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color === color &&
            item.size === size
          )
      )
    );
  };

  // Update Item Quantity
  const updateCartItem = (productId, quantity, color = "", size = "") => {
    setCart(
      cart.map((item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        removeCartItem,
        updateCartItem,
        clearCart,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
