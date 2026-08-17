import { createContext, useState, useEffect, useCallback } from "react";
import { getProducts } from "../../libs/api";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  // Exposed so pages can render spinners / retry buttons instead of silently
  // showing an empty grid when the request is slow or fails.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
        ? data.items
        : [];
      setProducts(list);
      setError("");
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, loading, error, refetch: fetchProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
