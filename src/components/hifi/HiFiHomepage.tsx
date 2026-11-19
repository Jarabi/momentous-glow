import { Play, ArrowRight, Star, Instagram } from 'lucide-react';
import { colors, serif } from './theme';
import { AnnouncementBar, NavBar, ValueProps, Newsletter, Footer } from './shared';
import { useStore, products, type Product } from './store';

function ProductCard({ product }: { product: Product }) {
  const { navigate, addToCart } = useStore();
  const isOos = product.availability === 'out_of_stock';
  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="h-56 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 relative overflow-hidden" style={{ backgroundColor: colors.beige }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {isOos && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,248,240,0.7)' }}>
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded" style={{ backgroundColor: colors.charcoal, color: colors.ivory }}>Sold Out</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium" style={{ color: colors.softBlack }}>{product.name}</p>
        <p className="text-xs" style={{ color: colors.roseGold }}>{product.type}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} fill={colors.champagne} style={{ color: colors.champagne }} />
          <span className="text-xs" style={{ color: colors.charcoal }}>{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium" style={{ color: colors.charcoal }}>${product.price}</span>
            {product.originalPrice && <span className="text-xs line-through" style={{ color: colors.beigeDark }}>${product.originalPrice}</span>}
          </div>
          {!isOos && (
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product.id, product.sizes[0]); }}
              className="text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.roseGold, color: colors.white }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const categoryImages: Record<string, string> = {
  'Skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  'Makeup': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  'Bundles & Sets': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80',
  'New Arrivals': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
};

const ugcImages = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=300&q=80',
];

export default function HiFiHomepage() {
  const { navigate } = useStore();
  const bestsellers = products.filter(p => p.badge === 'Bestseller' || p.rating >= 4.7).slice(0, 4);

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: colors.beige }}>
        <div className="px-6 py-16 md:px-16 md:py-24 md:flex md:items-center">
          <div className="md:max-w-lg text-center md:text-left z-10">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: colors.roseGold }}>New Collection · Spring 2026</p>
            <h1 className="font-light leading-tight mb-6 text-3xl md:text-5xl" style={{ fontFamily: serif, color: colors.softBlack }}>
              Your Skin,<br />
              <em style={{ color: colors.roseGold }}>Luminous</em>
            </h1>
            <p className="leading-relaxed mb-8 text-sm max-w-sm mx-auto md:mx-0" style={{ color: colors.charcoal }}>
              Scientifically formulated skincare that celebrates natural radiance. Clean ingredients, visible results.
            </p>
            <div className="flex gap-3 flex-col items-center md:flex-row md:items-start">
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
              >
                Shop Now
              </button>
              <button className="border px-8 py-3 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-2" style={{ borderColor: colors.roseGold, color: colors.roseGold }}>
                <Play size={12} fill="currentColor" /> Watch Film
              </button>
            </div>
          </div>
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
              alt="Hero Skincare"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <ValueProps />

      {/* Category Tiles */}
      <section className="px-6 py-12" style={{ backgroundColor: colors.ivory }}>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>Explore</p>
          <h2 className="text-2xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>Shop by Category</h2>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {['Skincare', 'Makeup', 'Bundles & Sets', 'New Arrivals'].map(cat => (
            <div key={cat} className="group cursor-pointer rounded-lg overflow-hidden" onClick={() => navigate(cat === 'Skincare' ? '/products?category=Serums' : cat === 'Makeup' ? '/products?category=Treatments' : cat === 'New Arrivals' ? '/products?category=New Arrivals' : '/products')}>
              <div className="h-44 overflow-hidden relative" style={{ backgroundColor: colors.beige }}>
                <img src={categoryImages[cat]} alt={cat} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <p className="text-center mt-3 text-sm font-medium" style={{ color: colors.charcoal }}>{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-6 py-12" style={{ backgroundColor: colors.beigeLight }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>Loved by many</p>
            <h2 className="text-2xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>Bestsellers</h2>
          </div>
          <button onClick={() => navigate('/products?category=Bestsellers')} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ color: colors.charcoal }}>
            Shop All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-6 py-16 flex flex-col gap-6 md:flex-row md:gap-12 md:items-center" style={{ backgroundColor: colors.ivory }}>
        <div className="h-64 md:w-1/2 md:h-80 rounded-lg overflow-hidden" style={{ backgroundColor: colors.beige }}>
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
            alt="Our Story"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: colors.roseGold }}>Our Story</p>
          <h2 className="text-3xl font-light mb-4" style={{ fontFamily: serif, color: colors.softBlack }}>
            Beauty rooted in <em style={{ color: colors.roseGold }}>science</em>
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: colors.charcoal }}>
            We believe skincare should be clean, effective, and luxurious. Every formula is dermatologist-tested and crafted with sustainably sourced ingredients that deliver visible results.
          </p>
          <button onClick={() => navigate('/contact')} className="border px-6 py-3 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ borderColor: colors.roseGold, color: colors.roseGold }}>
            Learn More →
          </button>
        </div>
      </section>

      {/* Press */}
      <section className="px-6 py-10 border-y" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
        <p className="text-center text-xs uppercase tracking-[0.3em] mb-6" style={{ color: colors.roseGold }}>As Seen In</p>
        <div className="flex justify-around flex-wrap gap-6">
          {['VOGUE', 'ELLE', 'ALLURE', "HARPER'S BAZAAR", 'COSMOPOLITAN'].map(l => (
            <span key={l} className="text-lg font-light tracking-widest" style={{ fontFamily: serif, color: colors.roseGoldDark }}>{l}</span>
          ))}
        </div>
      </section>

      {/* UGC */}
      <section className="px-6 py-12" style={{ backgroundColor: colors.ivory }}>
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>Share Your Glow</p>
          <h2 className="text-2xl font-light flex items-center justify-center gap-2" style={{ fontFamily: serif, color: colors.softBlack }}>
            <Instagram size={18} style={{ color: colors.roseGold }} /> @momentousglow
          </h2>
        </div>
        <div className="grid gap-2 grid-cols-3 md:grid-cols-6">
          {ugcImages.map((imgUrl, i) => (
            <div key={i} className="aspect-square rounded overflow-hidden" style={{ backgroundColor: colors.beige }}>
              <img src={imgUrl} alt={`UGC ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
