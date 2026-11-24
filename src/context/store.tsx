import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  skin_concerns: string[];
  description: string;
  ingredients: string;
  price: number;
  stock_quantity: number;
  in_stock: boolean;
  image_url: string;
};

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  joinWaitlist: (productId: number, email: string, phone?: string) => Promise<string>;
  refreshProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.in_stock) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock_quantity) }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock_quantity) }
          : item
      )
    );
  };

  const joinWaitlist = async (productId: number, email: string, phone?: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/api/products/${productId}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone }),
    });
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.error || 'Could not join waiting list');
    }
    return payload.message;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        error,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        joinWaitlist,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const userStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};