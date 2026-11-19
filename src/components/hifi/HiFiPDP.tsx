import { useState } from 'react';
import { Star, Heart, Minus, Plus, ChevronRight, CheckCircle, Clock, Leaf, FlaskConical } from 'lucide-react';
import { colors, serif, formatKes } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore, getProduct, products, type Product } from './store';

function AvailabilityBlock({ status, count }: { status: Product['availability']; count: number }) {
  if (status === 'out_of_stock') {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: '#A85B5B' }}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A85B5B' }} />
        Out of Stock
      </div>
    );
  }
  if (status === 'low_stock') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.champagneDark }}>
          <Clock size={14} /> Only {count} left — order soon
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.beige }}>
          <div className="h-full rounded-full" style={{ backgroundColor: colors.champagne, width: `${(count / 20) * 100}%` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-sm" style={{ color: '#4A7C59' }}>
      <CheckCircle size={14} /> In Stock — ships within 1–2 business days
    </div>
  );
}

function CrossSellCard({ product }: { product: Product }) {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();
  const isOos = product.availability === 'out_of_stock';
  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="h-40 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: colors.beige }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <p className="mt-2 text-sm font-medium" style={{ color: colors.softBlack }}>{product.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm" style={{ color: colors.charcoal }}>{formatKes(product.price)}</span>
        {!isOos && (
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product.id, product.sizes[0]); }}
            className="text-xs px-2 py-1 rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: colors.roseGold, color: colors.white }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export default function HiFiPDP({ productId }: { productId: string }) {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();
  const product = getProduct(productId);
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ backgroundColor: colors.ivory, color: colors.softBlack, minHeight: '60vh' }}>
        <AnnouncementBar />
        <NavBar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-light mb-4" style={{ fontFamily: serif, color: colors.softBlack }}>Product not found</h1>
          <button onClick={() => navigate('/products')} className="text-sm uppercase tracking-widest hover:opacity-70" style={{ color: colors.roseGold }}>
            ← Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOos = product.availability === 'out_of_stock';
  const tabs = ['Description', 'Ingredients', 'How to Use', `Reviews (${product.reviews})`];
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const crossSell = related.length >= 4 ? related : products.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-xs border-b flex items-center gap-1" style={{ borderColor: colors.beige, color: colors.roseGold }}>
        <button onClick={() => navigate('/')} className="hover:underline">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => navigate('/products')} className="hover:underline">Products</button>
        <ChevronRight size={10} />
        <span style={{ color: colors.charcoal }}>{product.name}</span>
      </div>

      <div className="px-6 py-8 flex flex-col md:flex-row md:gap-12">
        {/* Gallery */}
        <div className="md:w-1/2 flex-shrink-0 mb-6 md:mb-0">
          <div className="rounded-lg overflow-hidden flex items-center justify-center h-72 md:h-[28rem]" style={{ backgroundColor: colors.beige }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 mt-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 rounded-lg h-20 overflow-hidden cursor-pointer border-2" style={{ backgroundColor: colors.beigeLight, borderColor: i === 1 ? colors.roseGold : 'transparent' }}>
                <img src={product.image} alt={`${product.name} ${i}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            {product.badge && (
              <span className="text-xs rounded-full px-3 py-1" style={{ backgroundColor: colors.roseGold, color: colors.white }}>{product.badge}</span>
            )}
            <span className="text-xs rounded-full px-3 py-1 border" style={{ borderColor: colors.champagne, color: colors.champagneDark }}>{product.category}</span>
          </div>
          <h1 className="text-2xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>{product.name}</h1>
          <p className="text-sm mt-1" style={{ color: colors.roseGold }}>{product.type}</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= Math.round(product.rating) ? colors.champagne : colors.beige} style={{ color: i <= Math.round(product.rating) ? colors.champagne : colors.beige }} />)}
            </div>
            <span className="text-sm" style={{ color: colors.charcoal }}>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>{formatKes(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm line-through" style={{ color: colors.beigeDark }}>{formatKes(product.originalPrice)}</span>
                <span className="text-xs rounded px-2 py-1" style={{ backgroundColor: colors.champagne, color: colors.softBlack }}>
                  {Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed mt-4" style={{ color: colors.charcoal }}>{product.description}</p>

          <hr className="my-5" style={{ borderColor: colors.beige }} />

          <div className="mb-4">
            <AvailabilityBlock status={product.availability} count={product.stockCount ?? 0} />
          </div>

          {product.sizes.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-medium mb-3" style={{ color: colors.charcoal }}>Size: {selectedSize}</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="border rounded px-4 py-2 text-sm transition-all"
                    style={selectedSize === s ? { backgroundColor: colors.roseGold, borderColor: colors.roseGold, color: colors.white } : { borderColor: colors.beige, color: colors.charcoal }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <div className="flex items-center border rounded" style={{ borderColor: colors.beige }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3" style={{ color: colors.charcoal }}><Minus size={14} /></button>
              <span className="px-4 py-3 border-x text-sm" style={{ borderColor: colors.beige, color: colors.charcoal }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3" style={{ color: colors.charcoal }}><Plus size={14} /></button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOos}
              className="flex-1 rounded text-sm font-medium tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={isOos ? { backgroundColor: colors.beige, color: colors.roseGold, cursor: 'not-allowed' } : { backgroundColor: colors.softBlack, color: colors.ivory }}
            >
              {added ? 'Added!' : isOos ? 'Notify Me' : 'Add to Cart'}
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="border rounded px-4 py-2 hover:opacity-70 transition-opacity" style={{ borderColor: colors.roseGold }}>
              <Heart size={18} style={{ color: isWishlisted(product.id) ? colors.roseGold : 'none', fill: isWishlisted(product.id) ? colors.roseGold : 'none' }} />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {['Dermatologist tested', 'Vegan & cruelty-free', 'Free shipping over KSh 6,500', '30-day returns'].map(t => (
              <p key={t} className="text-xs flex items-center gap-2" style={{ color: colors.charcoal }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.roseGold }} /> {t}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-t" style={{ borderColor: colors.beige }}>
        <div className="flex gap-0 border-b overflow-x-auto" style={{ borderColor: colors.beige }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-5 py-4 text-sm whitespace-nowrap transition-colors"
              style={activeTab === i ? { borderBottom: `2px solid ${colors.roseGold}`, color: colors.softBlack, fontWeight: 500 } : { color: colors.roseGold }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-6 max-w-3xl">
          {activeTab === 0 && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>{product.description}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: colors.roseGold }}>
                  <CheckCircle size={13} /> What it does
                </p>
                <ul className="space-y-2">
                  {product.keyIngredients.map(ing => (
                    <li key={ing} className="flex items-start gap-2 text-sm" style={{ color: colors.charcoal }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.roseGold }} />
                      Formulated with {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: colors.roseGold }}>
                  <Leaf size={13} /> Key Ingredients
                </p>
                <div className="space-y-3">
                  {product.keyIngredients.map(ing => (
                    <div key={ing} className="flex gap-4 p-3 rounded-lg" style={{ backgroundColor: colors.beigeLight }}>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: colors.softBlack }}>{ing}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: colors.roseGold }}>
                  <FlaskConical size={13} /> Full Ingredient List
                </p>
                <p className="text-xs leading-relaxed" style={{ color: colors.charcoal }}>
                  Aqua, {product.keyIngredients.join(', ')}, Glycerin, Phenoxyethanol, Ethylhexylglycerin. Free from parabens, sulfates, and synthetic fragrances.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#4A7C59' }}>Free From</p>
                <div className="flex flex-wrap gap-2">
                  {['Parabens', 'Sulfates', 'Synthetic Fragrance', 'Mineral Oil', 'Phthalates'].map(f => (
                    <span key={f} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#4A7C59', color: '#4A7C59', backgroundColor: '#F0F7F2' }}>{f}-Free</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
              Apply 3-4 drops to clean, dry skin in the morning. Gently press into face and neck. Follow with moisturizer and SPF. Use daily for best results.
            </p>
          )}
          {activeTab === 3 && (
            <div className="space-y-4">
              {[
                { name: 'Sarah M.', rating: 5, text: 'My skin has never looked better. Dark spots are fading and my complexion is so much brighter!' },
                { name: 'Jessica L.', rating: 4, text: 'Great serum, noticed results within two weeks. Wish it came in a larger size.' },
              ].map(r => (
                <div key={r.name} className="border rounded-lg p-4" style={{ borderColor: colors.beige }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: colors.softBlack }}>{r.name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= r.rating ? colors.champagne : colors.beige} style={{ color: i <= r.rating ? colors.champagne : colors.beige }} />)}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: colors.charcoal }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cross-sell */}
      <div className="px-6 py-10 border-t" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
        <p className="text-xs uppercase tracking-[0.3em] mb-6 text-center" style={{ color: colors.roseGold }}>You May Also Like</p>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {crossSell.map(p => <CrossSellCard key={p.id} product={p} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}
