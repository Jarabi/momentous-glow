import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';

export type Product = {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  keyIngredients: string[];
  availability: Availability;
  stockCount?: number;
  sizes: string[];
  badge?: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 'glow-boost-serum',
    name: 'Glow Boost Vitamin C Serum',
    category: 'Serums',
    type: '15ml / 30ml / 50ml',
    price: 42,
    originalPrice: 58,
    rating: 4.8,
    reviews: 312,
    description: 'A potent brightening serum with 15% L-ascorbic acid to visibly fade dark spots, even skin tone, and shield against oxidative stress.',
    keyIngredients: ['Vitamin C 15%', 'Hyaluronic Acid', 'Ferulic Acid'],
    availability: 'in_stock',
    sizes: ['15ml', '30ml', '50ml'],
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hydrating-barrier-cream',
    name: 'Hydrating Barrier Cream',
    category: 'Moisturisers',
    type: '50ml',
    price: 36,
    rating: 4.7,
    reviews: 198,
    description: 'A rich, nourishing moisturizer that repairs and strengthens the skin barrier, locking in hydration for up to 72 hours.',
    keyIngredients: ['Ceramide NP', 'Shea Butter', 'Niacinamide'],
    availability: 'in_stock',
    sizes: ['50ml'],
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'daily-spf-50',
    name: 'Daily SPF 50 Moisturiser',
    category: 'Sun Care',
    type: 'Light Tint',
    price: 44,
    rating: 4.9,
    reviews: 245,
    description: 'A lightweight, lightly tinted daily moisturiser with broad-spectrum SPF 50 protection. Blurs imperfections while defending skin all day.',
    keyIngredients: ['Zinc Oxide', 'Avobenzone', 'Peptide Complex'],
    availability: 'low_stock',
    stockCount: 4,
    sizes: ['Light Tint', 'Medium Tint', 'Deep Tint'],
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'radiance-eye-cream',
    name: 'Radiance Eye Cream',
    category: 'Eye Care',
    type: '15ml',
    price: 38,
    rating: 4.6,
    reviews: 156,
    description: 'Targets dark circles, puffiness, and fine lines around the delicate eye area with a caffeine and peptide-rich formula.',
    keyIngredients: ['Caffeine', 'Retinyl Palmitate', 'Collagen Peptides'],
    availability: 'in_stock',
    sizes: ['15ml'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'overnight-renewal-oil',
    name: 'Overnight Renewal Oil',
    category: 'Serums',
    type: '30ml',
    price: 52,
    rating: 4.8,
    reviews: 289,
    description: 'A luxurious facial oil that works overnight to restore suppleness, reduce fine lines, and leave skin visibly plumped by morning.',
    keyIngredients: ['Rosehip Oil', 'Bakuchiol', 'Squalane'],
    availability: 'in_stock',
    sizes: ['30ml'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gentle-foaming-cleanser',
    name: 'Gentle Foaming Cleanser',
    category: 'Cleansers',
    type: '150ml',
    price: 28,
    rating: 4.5,
    reviews: 412,
    description: "A pH-balanced, sulphate-free foam cleanser that removes makeup and impurities without stripping the skin's natural moisture.",
    keyIngredients: ['Aloe Vera', 'Panthenol', 'Green Tea Extract'],
    availability: 'in_stock',
    sizes: ['150ml'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pore-refining-toner',
    name: 'Pore Refining Toner',
    category: 'Toners',
    type: '200ml',
    price: 32,
    rating: 4.4,
    reviews: 178,
    description: 'An exfoliating toner with 7% AHA/BHA blend to refine pores, smooth texture, and promote cell turnover for clearer-looking skin.',
    keyIngredients: ['Glycolic Acid 5%', 'Salicylic Acid 2%', 'Witch Hazel'],
    availability: 'out_of_stock',
    sizes: ['200ml'],
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'brightening-mask',
    name: 'Brightening Mask',
    category: 'Treatments',
    type: '50ml',
    price: 48,
    rating: 4.7,
    reviews: 134,
    description: 'A weekly treatment mask with kaolin clay and vitamin C derivatives to absorb excess oil, brighten dullness, and reveal a luminous complexion.',
    keyIngredients: ['Kaolin Clay', 'Vitamin C Derivative', 'Turmeric Extract'],
    availability: 'low_stock',
    stockCount: 6,
    sizes: ['50ml'],
    image: 'https://images.unsplash.com/photo-1567928257065-ee95e55e09be?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'soothing-recovery-gel',
    name: 'Soothing Recovery Gel',
    category: 'Moisturisers',
    type: '30ml',
    price: 34,
    rating: 4.6,
    reviews: 167,
    description: 'A fast-absorbing gel that instantly calms redness, inflammation, and sensitivity — ideal after exfoliation or sun exposure.',
    keyIngredients: ['Centella Asiatica', 'Allantoin', 'Beta-Glucan'],
    availability: 'in_stock',
    sizes: ['30ml'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

type StoreContextType = {
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  cartSubtotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  route: string;
  navigate: (path: string) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  const addToCart = useCallback((productId: string, size: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, size, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => {
    const product = getProduct(i.productId);
    return sum + (product ? product.price * i.quantity : 0);
  }, 0);

  return (
    <StoreContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, cartSubtotal, wishlist, toggleWishlist, isWishlisted, route, navigate }}>
      {children}
    </StoreContext.Provider>
  );
}
