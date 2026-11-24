import { Star, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { colors, serif, formatKes } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore } from './store';

export default function Wishlist() {
  const { products, navigate, wishlist, toggleWishlist, addToCart } = useStore();
  const items = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      <div className="px-6 py-3 text-xs border-b" style={{ borderColor: colors.beige, color: colors.roseGold }}>
        <button onClick={() => navigate('/')} className="hover:underline">Home</button> / <span style={{ color: colors.charcoal }}>Wishlist</span>
      </div>

      <div className="px-6 py-8">
        <h1 className="text-3xl font-light mb-2" style={{ fontFamily: serif, color: colors.softBlack }}>My Wishlist</h1>
        <p className="text-sm mb-8" style={{ color: colors.charcoal }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={40} style={{ color: colors.beigeDark }} className="mx-auto mb-4" />
            <p className="text-sm mb-2" style={{ color: colors.roseGold }}>Your wishlist is empty.</p>
            <p className="text-xs mb-6" style={{ color: colors.charcoal }}>Save your favourite products to find them quickly later.</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const isOos = !p.in_stock || p.availability === 'out_of_stock' || p.stock_quantity <= 0;
              const imgSrc = p.image || p.image_url;
              return (
                <div
                  key={p.id}
                  className="group rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
                  style={{ borderColor: colors.beige, backgroundColor: colors.white }}
                >
                  <div
                    className="relative h-48 cursor-pointer overflow-hidden"
                    style={{ backgroundColor: colors.beigeLight }}
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    <img src={imgSrc} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: colors.ivory }}
                    >
                      <Trash2 size={14} style={{ color: colors.roseGold }} />
                    </button>
                  </div>
                  <div className="px-4 pt-3 pb-4">
                    <p
                      className="text-sm font-medium leading-snug cursor-pointer"
                      style={{ color: colors.softBlack }}
                      onClick={() => navigate(`/product/${p.id}`)}
                    >
                      {p.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: colors.roseGold }}>{p.category}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={11} fill={colors.champagne} style={{ color: colors.champagne }} />
                      <span className="text-xs" style={{ color: colors.charcoal }}>
                        {p.rating ?? 4.9} ({p.reviews ?? 24})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium" style={{ color: colors.charcoal }}>{formatKes(p.price)}</span>
                      {!isOos && (
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1.5"
                          style={{ backgroundColor: colors.roseGold, color: colors.white }}
                        >
                          <ShoppingBag size={12} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}