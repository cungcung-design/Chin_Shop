import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from "../../libs/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const GUEST_CART_KEY = "cart";

/**
 * Normalises a cart line into one shape regardless of source.
 *
 * Server lines carry a subdocument `_id` (needed for the update/remove
 * endpoints) and a populated `productId`. Guest lines, stored in
 * localStorage, only have the product id.
 */
const normalizeServerItem = (item) => ({
  itemId: item._id,
  productId: item.productId?._id || item.productId,
  product: item.productId && item.productId._id ? item.productId : null,
  quantity: item.quantity,
  color: item.color || "",
  size: item.size || "",
  imageUrl:
    item.productId?.colors?.find((c) => c.color === item.color)?.image ||
    item.productId?.imageUrl?.[0] ||
    "",
});

const readGuestCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    return stored.map((item) => ({
      itemId: null,
      productId: item.productId?._id || item.productId,
      product: null,
      quantity: item.quantity || 1,
      color: item.color || "",
      size: item.size || "",
      imageUrl: item.imageUrl || "",
    }));
  } catch (err) {
    console.error("Could not read the saved cart:", err);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  /** Pull the authoritative cart from the API (logged-in users only). */
  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCart();
      setCart((data.items || []).map(normalizeServerItem));
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // On login the server cart becomes the source of truth; on logout fall back
  // to the guest cart held in localStorage.
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart(readGuestCart());
    }
  }, [user, refreshCart]);

  // Persist guest carts only. A logged-in cart already lives in MongoDB, and
  // mirroring it here is what previously let the two copies drift apart.
  useEffect(() => {
    if (user) return;
    localStorage.setItem(
      GUEST_CART_KEY,
      JSON.stringify(
        cart.map(({ productId, quantity, color, size, imageUrl }) => ({
          productId,
          quantity,
          color,
          size,
          imageUrl,
        }))
      )
    );
  }, [cart, user]);

  /** Add an item. Sends exactly one request — callers must not also call the API. */
  const addItemToCart = async (
    productId,
    quantity = 1,
    color = "",
    size = "",
    imageUrl = ""
  ) => {
    if (!user) throw new Error("User must be logged in to add items to cart.");

    const updated = await apiAddToCart(productId, quantity, color, size);
    // Trust the server's response rather than guessing the merged quantity.
    setCart((updated.items || []).map(normalizeServerItem));
  };

  /** Change a line's quantity, persisting it for logged-in users. */
  const updateCartItem = async (item, quantity) => {
    if (quantity < 1) return;

    if (user && item.itemId) {
      const updated = await apiUpdateCartItem(item.itemId, quantity);
      setCart((updated.items || []).map(normalizeServerItem));
      return;
    }

    setCart((prev) =>
      prev.map((line) =>
        line.productId === item.productId &&
        line.color === item.color &&
        line.size === item.size
          ? { ...line, quantity }
          : line
      )
    );
  };

  /** Remove a line, persisting it for logged-in users. */
  const removeCartItem = async (item) => {
    if (user && item.itemId) {
      const updated = await apiRemoveCartItem(item.itemId);
      setCart((updated.items || []).map(normalizeServerItem));
      return;
    }

    setCart((prev) =>
      prev.filter(
        (line) =>
          !(
            line.productId === item.productId &&
            line.color === item.color &&
            line.size === item.size
          )
      )
    );
  };

  /**
   * Clears the local view of the cart. The backend already empties the stored
   * cart when an order is created, so no extra request is needed.
   */
  const clearCart = () => {
    setCart([]);
    if (!user) localStorage.removeItem(GUEST_CART_KEY);
  };

  // Total units, not number of lines — what a cart badge should show.
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addItemToCart,
        removeCartItem,
        updateCartItem,
        clearCart,
        refreshCart,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
