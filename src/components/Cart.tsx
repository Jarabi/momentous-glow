import { Minus, Plus, Lock, ArrowRight, Truck, RotateCcw, ShoppingBag } from 'lucide-react';
import { colors, serif, formatKes } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore } from './store';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, navigate } = useStore();

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxRate = 0.08;
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + tax;
  const freeShippingThreshold = 6500;
  const shippingProgress = Math.min((cartSubtotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - cartSubtotal, 0);

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
        <AnnouncementBar />
        <NavBar />
        <div className="text-center py-20 px-6">
          <ShoppingBag size={48} className="mx-auto mb-6" style={{ color: colors.beigeDark }} />
          <h1 className="text-2xl font-light mb-3" style={{ fontFamily: serif, color: colors.softBlack }}>Your cart is empty</h1>
          <p className="text-sm mb-8" style={{ color: colors.charcoal }}>Discover our clean, effective skincare range.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
            style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
          >
            Shop Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      <div className="px-6 py-8">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>Shopping Bag</p>
        <h1 className="text-3xl font-light mb-6" style={{ fontFamily: serif, color: colors.softBlack }}>Your Cart ({cart.length} items)</h1>

        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Line items */}
          <div className="flex-1">
            {/* Free shipping progress */}
            <div className="rounded-lg p-4 mb-6 flex items-center gap-4" style={{ backgroundColor: colors.beigeLight }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.roseGold }}>
                <Truck size={18} style={{ color: colors.white }} />
              </div>
              <div className="flex-1">
                {remaining > 0 ? (
                  <p className="text-sm font-medium" style={{ color: colors.charcoal }}>Add {formatKes(remaining)} more for free shipping!</p>
                ) : (
                  <p className="text-sm font-medium" style={{ color: '#4A7C59' }}>You've unlocked free shipping!</p>
                )}
                <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.beige }}>
                  <div className="h-2 rounded-full transition-all duration-500" style={{ backgroundColor: colors.roseGold, width: `${shippingProgress}%` }} />
                </div>
              </div>
            </div>

            {cart.map(({ product, quantity }) => {
              const imgSrc = product.image || product.image_url;
              return (
                <div key={product.id} className="flex gap-4 py-5 border-b" style={{ borderColor: colors.beige }}>
                  <div
                    className="h-24 w-24 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: colors.beige }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p
                          className="text-sm font-medium cursor-pointer hover:opacity-70"
                          style={{ color: colors.softBlack }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: colors.roseGold }}>{product.type || product.category}</p>
                      </div>
                      <p className="text-sm font-medium" style={{ color: colors.charcoal }}>{formatKes(product.price * quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded" style={{ borderColor: colors.beige }}>
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-3 py-2">
                          <Minus size={12} style={{ color: colors.charcoal }} />
                        </button>
                        <span className="px-3 py-2 border-x text-sm" style={{ borderColor: colors.beige, color: colors.charcoal }}>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          className="px-3 py-2 disabled:opacity-40"
                        >
                          <Plus size={12} style={{ color: colors.charcoal }} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(product.id)} className="text-xs hover:underline" style={{ color: colors.roseGold }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={() => navigate('/products')} className="mt-6 text-sm hover:opacity-70" style={{ color: colors.roseGold }}>
              ← Continue Shopping
            </button>

            <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: colors.charcoal }}>
              <span className="flex items-center gap-1.5"><Lock size={12} style={{ color: colors.roseGold }} /> Secure checkout</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={12} style={{ color: colors.roseGold }} /> Free 30-day returns</span>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-6 md:mt-0 md:w-80 flex-shrink-0">
            <div className="rounded-lg p-6 border" style={{ borderColor: colors.beige, backgroundColor: colors.beigeLight }}>
              <p className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: colors.charcoal }}>Order Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: colors.charcoal }}>Subtotal ({cart.length} items)</span>
                  <span style={{ color: colors.charcoal }}>{formatKes(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.charcoal }}>Estimated Shipping</span>
                  <span style={{ color: colors.roseGold, fontWeight: 500 }}>FREE</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.charcoal }}>Estimated Tax</span>
                  <span style={{ color: colors.charcoal }}>{formatKes(tax)}</span>
                </div>
              </div>
              <hr className="my-5" style={{ borderColor: colors.beige }} />
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.softBlack }}>Total</span>
                <span className="text-xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>{formatKes(total)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-5 rounded py-3 text-sm font-medium tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
              >
                Checkout <ArrowRight size={14} />
              </button>
              <div className="mt-4 flex justify-center gap-2">
                {['VISA', 'MC', 'M-Pesa', 'Card'].map((p) => (
                  <div key={p} className="border rounded px-2 py-1 text-xs" style={{ borderColor: colors.beige, color: colors.roseGold }}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}