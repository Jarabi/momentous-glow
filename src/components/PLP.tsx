import { useState } from 'react';
import { Star, Heart, ChevronDown, SlidersHorizontal, Leaf, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { colors, serif, formatKes } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore, type Availability } from './store';

function AvailabilityBadge({ status }: { status: Availability }) {
  const config = {
    in_stock:     { icon: CheckCircle, label: 'In Stock',     color: '#4A7C59' },
    low_stock:    { icon: Clock,       label: 'Low Stock',    color: colors.champagneDark },
    out_of_stock: { icon: AlertCircle, label: 'Out of Stock', color: '#A85B5B' },
  }[status];
  const Icon = config.icon;
  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: config.color }}>
      <Icon size={11} /> {config.label}
    </span>
  );
}

const categories = ['All', 'Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Eye Care', 'Toners', 'Treatments', 'New Arrivals', 'Bestsellers'];
const sortOptions = ['Best Sellers', 'Price: Low to High', 'Price: High to Low', 'Top Rated'] as const;
type SortOption = typeof sortOptions[number];

export default function PLP() {
  const {
    products,
    loading,
    error,
    refreshProducts,
    navigate,
    addToCart,
    route,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const getInitialCategory = () => {
    const queryIndex = route.indexOf('?');
    if (queryIndex === -1) return 'All';
    const params = new URLSearchParams(route.slice(queryIndex + 1));
    return params.get('category') || 'All';
  };

  const [category, setCategory] = useState(getInitialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('Best Sellers');
  const [sortOpen, setSortOpen] = useState(false);

  let filtered = category === 'All'
    ? products
    : products.filter((p) => {
        if (category === 'New Arrivals') return p.badge === 'New';
        if (category === 'Bestsellers') return p.badge === 'Bestseller';
        return p.category.toLowerCase() === category.toLowerCase();
      });

  switch (sortBy) {
    case 'Price: Low to High':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'Price: High to Low':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case 'Top Rated':
      filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
  }

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-xs border-b" style={{ borderColor: colors.beige, color: colors.roseGold }}>
        <button onClick={() => navigate('/')} className="hover:underline">Home</button> / <span style={{ color: colors.charcoal }}>Products</span>
      </div>

      {/* Page header */}
      <div className="px-6 py-8 border-b" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>
          {category === 'All' ? 'Skincare' : category}
        </p>
        <h1 className="text-3xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>
          {category === 'All' ? 'All Products' : category}
        </h1>
        <p className="text-sm mt-2" style={{ color: colors.charcoal }}>
          Targeted treatments for radiant, healthy skin — {filtered.length} products
        </p>
      </div>

      {/* Category bar */}
      <div className="px-6 py-4 border-b overflow-x-auto" style={{ borderColor: colors.beige }}>
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={
                category === cat
                  ? { backgroundColor: colors.roseGold, color: colors.white }
                  : { backgroundColor: colors.white, color: colors.charcoal, border: `1px solid ${colors.beige}` }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm" style={{ color: colors.charcoal }}>{filtered.length} Products</span>
          <div className="flex items-center gap-2 relative">
            <SlidersHorizontal size={14} style={{ color: colors.roseGold }} />
            <span className="text-sm" style={{ color: colors.charcoal }}>Sort by:</span>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="border rounded px-3 py-1.5 text-sm flex items-center gap-1"
              style={{ borderColor: colors.beige, color: colors.charcoal }}
            >
              {sortBy} <ChevronDown size={12} style={{ color: colors.roseGold }} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg border shadow-lg z-10" style={{ backgroundColor: colors.white, borderColor: colors.beige }}>
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity whitespace-nowrap"
                    style={{ color: opt === sortBy ? colors.roseGold : colors.charcoal }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-sm" style={{ color: colors.charcoal }}>
            Loading skincare catalog...
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#A85B5B' }}>{error}</p>
            <button
              onClick={refreshProducts}
              className="mt-4 px-4 py-2 text-xs uppercase tracking-widest rounded"
              style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const isOos = !p.in_stock || p.availability === 'out_of_stock';
              const status: Availability = p.availability ?? (p.in_stock ? 'in_stock' : 'out_of_stock');
              const imgSrc = p.image || p.image_url;
              const ingredientChips = p.keyIngredients ?? [];

              return (
                <div
                  key={p.id}
                  className="group rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
                  style={{ borderColor: colors.beige, backgroundColor: colors.white }}
                >
                  {/* Image */}
                  <div
                    className="relative h-48 flex items-center justify-center cursor-pointer overflow-hidden"
                    style={{ backgroundColor: colors.beigeLight }}
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: colors.ivory }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                    >
                      <Heart
                        size={14}
                        style={{
                          color: isWishlisted(p.id) ? colors.roseGold : colors.beigeDark,
                          fill: isWishlisted(p.id) ? colors.roseGold : 'none',
                        }}
                      />
                    </div>
                    {isOos && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,248,240,0.7)' }}
                      >
                        <span
                          className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded"
                          style={{ backgroundColor: colors.charcoal, color: colors.ivory }}
                        >
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-4 pt-3 pb-4 cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    <p className="text-sm font-medium leading-snug" style={{ color: colors.softBlack }}>{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: colors.roseGold }}>{p.type || p.category}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={11} fill={colors.champagne} style={{ color: colors.champagne }} />
                      <span className="text-xs" style={{ color: colors.charcoal }}>
                        {p.rating ?? 4.9} ({p.reviews ?? 24})
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed mt-2 line-clamp-2" style={{ color: colors.charcoal }} title={p.description}>
                      {p.description}
                    </p>

                    {ingredientChips.length > 0 && (
                      <div className="mt-2.5">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: colors.roseGold }}>
                          <Leaf size={11} /> Key Ingredients
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ingredientChips.map((ing) => (
                            <span
                              key={ing}
                              className="text-xs px-2 py-1 rounded-full border"
                              style={{ borderColor: colors.beige, color: colors.charcoal, backgroundColor: colors.beigeLight }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium" style={{ color: colors.charcoal }}>{formatKes(p.price)}</span>
                      <AvailabilityBadge status={status} />
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOos) addToCart(p, 1);
                      }}
                      className="w-full py-2 text-xs uppercase tracking-widest font-medium rounded hover:opacity-90 transition-opacity"
                      style={
                        isOos
                          ? { backgroundColor: colors.beige, color: colors.roseGold, cursor: 'not-allowed' }
                          : { backgroundColor: colors.softBlack, color: colors.ivory }
                      }
                      disabled={isOos}
                    >
                      {isOos ? 'Notify Me' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: colors.roseGold }}>No products found in this category.</p>
            <button
              onClick={() => setCategory('All')}
              className="mt-4 text-xs uppercase tracking-widest hover:opacity-70"
              style={{ color: colors.charcoal }}
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}