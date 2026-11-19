import { useState } from 'react';
import { Check, Lock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { colors, serif } from './theme';
import { AnnouncementBar } from './shared';
import { useStore, getProduct } from './store';

type Step = 1 | 2 | 3 | 4 | 5;

export default function HiFiCheckout() {
  const { cart, cartSubtotal, navigate } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const steps = ['Contact', 'Shipping', 'Method', 'Payment', 'Review'];
  const taxRate = 0.08;
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + tax;

  if (orderComplete) {
    return (
      <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
        <AnnouncementBar />
        <div className="max-w-md mx-auto text-center py-20 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#4A7C59' }}>
            <Check size={32} style={{ color: colors.white }} />
          </div>
          <h1 className="text-3xl font-light mb-3" style={{ fontFamily: serif, color: colors.softBlack }}>Order Confirmed!</h1>
          <p className="text-sm mb-8" style={{ color: colors.charcoal }}>
            Thank you for your purchase. A confirmation email has been sent to your inbox. Your order will ship within 1–2 business days.
          </p>
          <div className="rounded-lg p-4 mb-8" style={{ backgroundColor: colors.beigeLight }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: colors.roseGold }}>Order Number</p>
            <p className="text-lg font-medium" style={{ color: colors.softBlack }}>#MG-{Math.floor(Math.random() * 90000 + 10000)}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
            style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
        <AnnouncementBar />
        <div className="text-center py-20 px-6">
          <h1 className="text-2xl font-light mb-4" style={{ fontFamily: serif, color: colors.softBlack }}>Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="text-sm uppercase tracking-widest hover:opacity-70" style={{ color: colors.roseGold }}>
            Shop Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />

      <header className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: colors.beige }}>
        <button onClick={() => navigate('/')} className="text-center">
          <p className="text-lg font-semibold tracking-[0.2em]" style={{ fontFamily: serif, color: colors.softBlack }}>MOMENTOUS</p>
          <p className="text-xs tracking-[0.4em] uppercase -mt-0.5" style={{ color: colors.roseGold }}>GLOW</p>
        </button>
        <span className="text-xs flex items-center gap-1.5" style={{ color: colors.roseGold }}>
          <Lock size={12} /> SECURE CHECKOUT
        </span>
      </header>

      {/* Step indicator */}
      <div className="px-6 py-6 border-b" style={{ borderColor: colors.beige }}>
        <div className="flex justify-center gap-2 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={i + 1 < step ? { backgroundColor: colors.roseGold, color: colors.white } : i + 1 === step ? { border: `2px solid ${colors.roseGold}`, color: colors.roseGold } : { border: `2px solid ${colors.beige}`, color: colors.beigeDark }}>
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-sm" style={{ color: i + 1 === step ? colors.softBlack : i + 1 < step ? colors.charcoal : colors.beigeDark }}>{s}</span>
              {i < steps.length - 1 && <div className="w-6 h-px" style={{ backgroundColor: colors.beige }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 flex flex-col md:flex-row md:gap-12 max-w-5xl mx-auto">
        {/* Form area */}
        <div className="flex-1">
          {step === 1 && <ContactStep />}
          {step === 2 && <ShippingStep />}
          {step === 3 && <MethodStep />}
          {step === 4 && <PaymentStep />}
          {step === 5 && <ReviewStep />}

          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: colors.beige }}>
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: colors.roseGold }}>
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: colors.roseGold }}>
                <ArrowLeft size={14} /> Back to Cart
              </button>
            )}
            {step < 5 ? (
              <button onClick={() => setStep((step + 1) as Step)} className="flex items-center gap-2 px-6 py-3 rounded text-sm font-medium tracking-widest uppercase hover:opacity-90 transition-opacity" style={{ backgroundColor: colors.softBlack, color: colors.ivory }}>
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={() => setOrderComplete(true)} className="px-8 py-3 rounded text-sm font-medium tracking-widest uppercase hover:opacity-90 transition-opacity" style={{ backgroundColor: colors.roseGold, color: colors.white }}>
                Place Order
              </button>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-6 md:mt-0 md:w-80 flex-shrink-0">
          <div className="rounded-lg p-5 border" style={{ borderColor: colors.beige, backgroundColor: colors.beigeLight }}>
            <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: colors.charcoal }}>Order Summary</p>
            {cart.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3 py-3 border-b" style={{ borderColor: colors.beige }}>
                  <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: colors.beige }}>
                    <span className="text-xs" style={{ color: colors.roseGoldDark }}>[Img]</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: colors.softBlack }}>{product.name}</p>
                    <p className="text-xs" style={{ color: colors.roseGold }}>{item.size} × {item.quantity}</p>
                  </div>
                  <p className="text-sm" style={{ color: colors.charcoal }}>${(product.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: colors.charcoal }}>Subtotal</span><span style={{ color: colors.charcoal }}>${cartSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span style={{ color: colors.charcoal }}>Shipping</span><span style={{ color: colors.roseGold, fontWeight: 500 }}>FREE</span></div>
              <div className="flex justify-between"><span style={{ color: colors.charcoal }}>Tax</span><span style={{ color: colors.charcoal }}>${tax.toFixed(2)}</span></div>
              <hr style={{ borderColor: colors.beige }} className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: colors.softBlack }}>Total</span>
                <span className="font-medium" style={{ color: colors.softBlack }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs" style={{ color: colors.charcoal }}>
            <p className="flex items-center gap-2"><Lock size={12} style={{ color: colors.roseGold }} /> 256-bit SSL encrypted</p>
            <p className="flex items-center gap-2"><Check size={12} style={{ color: colors.roseGold }} /> Free 30-day returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: colors.charcoal }}>{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C89B7B] transition-colors"
        style={{ borderColor: colors.beige, color: colors.charcoal }}
        placeholder={placeholder || label}
      />
    </div>
  );
}

function ContactStep() {
  return (
    <div>
      <h2 className="text-xl font-light mb-5" style={{ fontFamily: serif, color: colors.softBlack }}>Contact Information</h2>
      <div className="space-y-4">
        <Field label="Email address" placeholder="you@example.com" type="email" />
        <label className="flex items-center gap-2 text-sm" style={{ color: colors.charcoal }}>
          <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: colors.roseGold }} />
          Email me with news and exclusive offers
        </label>
      </div>
    </div>
  );
}

function ShippingStep() {
  return (
    <div>
      <h2 className="text-xl font-light mb-5" style={{ fontFamily: serif, color: colors.softBlack }}>Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" />
        <Field label="Last name" />
        <div className="col-span-2"><Field label="Address" /></div>
        <Field label="City" />
        <Field label="State" />
        <Field label="ZIP code" />
        <Field label="Phone" type="tel" />
      </div>
    </div>
  );
}

function MethodStep() {
  const methods = [
    { name: 'Standard', desc: '5-7 business days', price: 'FREE' },
    { name: 'Express', desc: '2-3 business days', price: '$9.99' },
    { name: 'Overnight', desc: 'Next business day', price: '$24.99' },
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <h2 className="text-xl font-light mb-5" style={{ fontFamily: serif, color: colors.softBlack }}>Shipping Method</h2>
      <div className="space-y-3">
        {methods.map((m, i) => (
          <label
            key={m.name}
            className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all"
            style={{ borderColor: i === selected ? colors.roseGold : colors.beige, backgroundColor: i === selected ? colors.beigeLight : 'transparent' }}
          >
            <input type="radio" name="method" checked={i === selected} onChange={() => setSelected(i)} className="hidden" />
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: colors.roseGold }}>
              {i === selected && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.roseGold }} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: colors.softBlack }}>{m.name}</p>
              <p className="text-xs" style={{ color: colors.roseGold }}>{m.desc}</p>
            </div>
            <span className="text-sm font-medium" style={{ color: m.price === 'FREE' ? colors.roseGold : colors.charcoal }}>{m.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PaymentStep() {
  const [method, setMethod] = useState('Card');
  return (
    <div>
      <h2 className="text-xl font-light mb-5" style={{ fontFamily: serif, color: colors.softBlack }}>Payment</h2>
      <div className="flex gap-3 mb-5 flex-wrap">
        {['Apple Pay', 'Google Pay', 'PayPal', 'Card'].map(p => (
          <button
            key={p}
            onClick={() => setMethod(p)}
            className="border rounded-lg px-4 py-2 text-sm transition-all"
            style={method === p ? { borderColor: colors.roseGold, backgroundColor: colors.beigeLight, color: colors.softBlack } : { borderColor: colors.beige, color: colors.charcoal }}
          >
            {p}
          </button>
        ))}
      </div>
      {method === 'Card' && (
        <div className="space-y-4">
          <Field label="Card number" placeholder="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry date" placeholder="MM / YY" />
            <Field label="CVV" placeholder="123" />
          </div>
        </div>
      )}
      {method !== 'Card' && (
        <div className="rounded-lg p-8 text-center" style={{ backgroundColor: colors.beigeLight }}>
          <p className="text-sm" style={{ color: colors.charcoal }}>You'll be redirected to {method} to complete your purchase securely.</p>
        </div>
      )}
    </div>
  );
}

function ReviewStep() {
  const rows = [
    { label: 'Contact', value: 'alex@example.com' },
    { label: 'Ship to', value: '123 Main St, New York, NY 10001' },
    { label: 'Method', value: 'Standard (5-7 days) — FREE' },
    { label: 'Payment', value: 'Visa ending in 4242' },
  ];
  return (
    <div>
      <h2 className="text-xl font-light mb-5" style={{ fontFamily: serif, color: colors.softBlack }}>Review Your Order</h2>
      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between border-b pb-3" style={{ borderColor: colors.beige }}>
            <span className="text-sm" style={{ color: colors.roseGold }}>{r.label}</span>
            <span className="text-sm text-right" style={{ color: colors.charcoal }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg p-4" style={{ backgroundColor: colors.beigeLight }}>
        <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.roseGold }} />
        <p className="text-xs" style={{ color: colors.charcoal }}>
          By placing your order, you agree to Momentous Glow's Terms of Service and Privacy Policy. Your order is final and non-refundable except as stated in our 30-day return policy.
        </p>
      </div>
    </div>
  );
}
