import { useState, useEffect } from 'react';
import { Search as SearchIcon, Star, Heart, X } from 'lucide-react';
import { colors, serif } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore, products } from './store';

export default function HiFiSearch() {
  const { navigate, route, addToCart, isWishlisted, toggleWishlist } = useStore();

  const getInitialQuery = () => {
    const queryIndex = route.indexOf('?');
    if (queryIndex === -1) return '';
    const params = new URLSearchParams(route.slice(queryIndex + 1));
    return params.get('q') || '';
  };

  const [query, setQuery] = useState(getInitialQuery);

  useEffect(() => {
    setQuery(getInitialQuery());
  }, [route]);

  const q = query.toLowerCase().trim();
  const results = q
    ? products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keyIngredients.some(i => i.toLowerCase().includes(q))
      )
    : [];

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      <div className="px-6 py-3 text-xs border-b" style={{ borderColor: colors.beige, color: colors.roseGold }}>
        <button onClick={() => navigate('/')} className="hover:underline">Home</button> / <span style={{ color: colors.charcoal }}>Search</span>
      </div>

      {/* Search bar */}
      <div className="px-6 py-8 border-b" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-light mb-4 text-center" style={{ fontFamily: serif, color: colors.softBlack }}>Search Products</h1>
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.roseGold }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search by name, category, or ingredient..."
              className="w-full border rounded-full pl-12 pr-10 py-3 text-sm focus:outline-none"
              style={{ borderColor: colors.beige, color: colors.charcoal, backgroundColor: colors.white }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={16} style={{ color: colors.charcoal }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-8">
        {q && (
          <p className="text-sm mb-6" style={{ color: colors.charcoal }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}

        {q && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm mb-2" style={{ color: colors.roseGold }}>No products found.</p>
            <p className="text-xs mb-6" style={{ color: colors.charcoal }}>Try a different keyword or browse all products.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
            >
              View All Products
            </button>
          </div>
        )}

        {!q && (
          <div className="text-center py-16">
            <SearchIcon size={32} style={{ color: colors.beigeDark }} className="mx-auto mb-4" />
            <p className="text-sm" style={{ color: colors.charcoal }}>Start typing to search our collection.</p>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(p => {
            const isOos = p.availability === 'out_of_stock';
            const wished = isWishlisted(p.id);
            return (
              <div key={p.id} className="group rounded-xl border overflow-hidden transition-shadow hover:shadow-md" style={{ borderColor: colors.beige, backgroundColor: colors.white }}>
                <div className="relative h-48 cursor-pointer overflow-hidden" style={{ backgroundColor: colors.beigeLight }} onClick={() => navigate(`/product/${p.id}`)}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: colors.ivory }}
                  >
                    <Heart size={14} style={{ color: wished ? colors.roseGold : colors.beigeDark, fill: wished ? colors.roseGold : 'none' }} />
                  </button>
                </div>
                <div className="px-4 pt-3 pb-4 cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                  <p className="text-sm font-medium leading-snug" style={{ color: colors.softBlack }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: colors.roseGold }}>{p.category}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={11} fill={colors.champagne} style={{ color: colors.champagne }} />
                    <span className="text-xs" style={{ color: colors.charcoal }}>{p.rating} ({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium" style={{ color: colors.charcoal }}>${p.price}</span>
                    {!isOos && (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p.id, p.sizes[0]); }}
                        className="text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colors.roseGold, color: colors.white }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
