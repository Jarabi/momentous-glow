import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';

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
  // Optional UI fields (derived from backend fields when absent)
  originalPrice?: number;
  image?: string;
  keyIngredients?: string[];
  availability?: Availability;
  rating?: number;
  reviews?: number;
  type?: string;
  badge?: string;
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  cartCount: number;
  route: string;
  navigate: (path: string) => void;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  joinWaitlist: (productId: number, email: string, phone?: string) => Promise<string>;
  refreshProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function normalizeProduct(raw: Product): Product {
  const stockQty = Number(raw.stock_quantity ?? 0);
  const availability: Availability =
    stockQty <= 0 ? 'out_of_stock' : stockQty <= 5 ? 'low_stock' : 'in_stock';

  const parsedIngredients = Array.isArray(raw.keyIngredients)
    ? raw.keyIngredients
    : raw.ingredients
      ? raw.ingredients
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 4)
      : [];

  return {
    ...raw,
    price: Number(raw.price),
    stock_quantity: stockQty,
    in_stock: Boolean(raw.in_stock ?? stockQty > 0),
    skin_concerns: Array.isArray(raw.skin_concerns) ? raw.skin_concerns : [],
    image: raw.image || raw.image_url,
    keyIngredients: parsedIngredients,
    availability,
    rating: raw.rating ?? 4.9,
    reviews: raw.reviews ?? 24,
    type: raw.type || raw.category,
    sizes: raw.sizes && raw.sizes.length > 0 ? raw.sizes : ['Standard'],
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [route, setRoute] = useState<string>(() => window.location.pathname + window.location.search);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/products`);
      const rawText = await res.text();

      if (!res.ok) {
        throw new Error(`Request failed (${res.status}): ${rawText.slice(0, 120)}`);
      }

      const data: Product[] = JSON.parse(rawText);
      setProducts(data.map(normalizeProduct));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.in_stock || product.stock_quantity <= 0) return;
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
        cartCount,
        route,
        navigate,
        wishlist,
        toggleWishlist,
        isWishlisted,
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

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};