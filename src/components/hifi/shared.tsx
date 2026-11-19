import { useState } from 'react';
import { Search, ShoppingBag, Heart, User, ChevronDown, X, Menu, Phone } from 'lucide-react';
import { colors, serif, navItems, valueProps, footerColumns } from './theme';
import { useStore } from './store';

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-center">
      <p className="text-lg md:text-xl font-semibold tracking-[0.25em]" style={{ fontFamily: serif, color: colors.softBlack }}>MOMENTOUS</p>
      <p className="text-xs tracking-[0.4em] uppercase -mt-0.5" style={{ color: colors.roseGold }}>GLOW</p>
    </button>
  );
}

function CartIcon() {
  const { cartCount, navigate } = useStore();
  return (
    <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
      <ShoppingBag size={18} className="hover:opacity-70 transition-opacity md:!hidden" style={{ color: colors.charcoal }} />
      <ShoppingBag size={16} className="hover:opacity-70 transition-opacity hidden md:block" style={{ color: colors.charcoal }} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: colors.roseGold }}>{cartCount}</span>
      )}
    </div>
  );
}

export function AnnouncementBar() {
  return (
    <div className="text-center py-2 px-4 text-xs tracking-wider" style={{ backgroundColor: colors.softBlack, color: colors.ivory }}>
      Free shipping on orders over $50 · Use code <span className="font-semibold" style={{ color: colors.champagne }}>GLOW10</span> for 10% off
    </div>
  );
}

export function NavBar() {
  const { navigate, isWishlisted } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const categoryNav = (label: string) => {
    if (label === 'Skincare') navigate('/products?category=Serums');
    else if (label === 'Makeup') navigate('/products?category=Treatments');
    else if (label === 'New Arrivals') navigate('/products?category=New Arrivals');
    else if (label === 'Bestsellers') navigate('/products?category=Bestsellers');
    else navigate('/products');
  };

  return (
    <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: colors.ivory, borderColor: colors.beige }}>
      {/* Main nav (desktop) */}
      <div className="hidden md:flex items-center justify-between px-8 py-4">
        <Logo onClick={() => navigate('/')} />
        <div className="flex items-center gap-8">
          <nav className="flex gap-6 text-xs font-medium tracking-wide uppercase items-center" style={{ color: colors.charcoal }}>
            <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity whitespace-nowrap">Home</button>
            <button onClick={() => navigate('/products')} className="hover:opacity-70 transition-opacity whitespace-nowrap">Products</button>
            <button onClick={() => navigate('/checkout')} className="hover:opacity-70 transition-opacity whitespace-nowrap">Checkout</button>
          </nav>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Secondary nav (desktop) */}
      <div className="hidden md:flex items-center justify-between px-8 py-3 border-t" style={{ borderColor: colors.beige }}>
        <nav className="flex gap-6 text-xs font-medium tracking-wide uppercase items-center" style={{ color: colors.charcoal }}>
          {['Skincare', 'Makeup', 'New Arrivals', 'Bestsellers'].map(item => (
            <button key={item} onClick={() => categoryNav(item)} className="flex items-center gap-1 hover:opacity-70 transition-opacity whitespace-nowrap">
              {item}
              {(item === 'Skincare' || item === 'Makeup') && <ChevronDown size={12} />}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(true)} className="hover:opacity-70 transition-opacity"><Search size={16} style={{ color: colors.charcoal }} /></button>
          <button onClick={() => navigate('/contact')} className="hover:opacity-70 transition-opacity"><User size={16} style={{ color: colors.charcoal }} /></button>
          <button onClick={() => navigate('/wishlist')} className="hover:opacity-70 transition-opacity relative">
            <Heart size={16} style={{ color: colors.charcoal }} />
          </button>
          <CartIcon />
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative px-8 py-6" style={{ backgroundColor: colors.ivory }} onClick={(e) => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <Search size={20} style={{ color: colors.roseGold }} />
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  placeholder="Search products, categories, ingredients..."
                  className="flex-1 bg-transparent border-b text-sm focus:outline-none py-2"
                  style={{ borderColor: colors.beige, color: colors.charcoal }}
                />
                <button type="submit" className="text-xs uppercase tracking-widest font-medium px-4 py-2" style={{ backgroundColor: colors.softBlack, color: colors.ivory }}>Search</button>
              </form>
              <button onClick={() => setSearchOpen(false)}><X size={20} style={{ color: colors.charcoal }} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        <button onClick={() => setMobileOpen(true)} className="p-1">
          <Menu size={22} style={{ color: colors.charcoal }} />
        </button>
        <Logo onClick={() => navigate('/')} />
        <div className="flex gap-3 items-center">
          <button onClick={() => setSearchOpen(true)}><Search size={18} style={{ color: colors.charcoal }} /></button>
          <button onClick={() => navigate('/wishlist')}><Heart size={18} style={{ color: colors.charcoal }} /></button>
          <CartIcon />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 p-6 flex flex-col" style={{ backgroundColor: colors.ivory }}>
            <div className="flex justify-between items-center mb-8">
              <Logo onClick={() => { navigate('/'); setMobileOpen(false); }} />
              <button onClick={() => setMobileOpen(false)}><X size={20} style={{ color: colors.charcoal }} /></button>
            </div>
            <nav className="flex flex-col gap-4">
              <button onClick={() => { navigate('/'); setMobileOpen(false); }} className="text-sm font-medium tracking-wide uppercase text-left hover:opacity-70 transition-opacity" style={{ color: colors.charcoal }}>Home</button>
              <button onClick={() => { navigate('/products'); setMobileOpen(false); }} className="text-sm font-medium tracking-wide uppercase text-left hover:opacity-70 transition-opacity" style={{ color: colors.charcoal }}>Products</button>
              <button onClick={() => { navigate('/checkout'); setMobileOpen(false); }} className="text-sm font-medium tracking-wide uppercase text-left hover:opacity-70 transition-opacity" style={{ color: colors.charcoal }}>Checkout</button>
              {['Skincare', 'Makeup', 'New Arrivals', 'Bestsellers'].map(item => (
                <button
                  key={item}
                  onClick={() => { categoryNav(item); setMobileOpen(false); }}
                  className="text-sm font-medium tracking-wide uppercase text-left hover:opacity-70 transition-opacity"
                  style={{ color: colors.charcoal }}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t" style={{ borderColor: colors.beige }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.roseGold }}>Contact</p>
              <button onClick={() => { navigate('/contact'); setMobileOpen(false); }} className="flex items-center gap-2 mb-4">
                <Phone size={14} style={{ color: colors.charcoal }} />
                <span className="text-xs" style={{ color: colors.charcoal }}>1-800-GLOW</span>
              </button>
              <div className="flex gap-4">
                <button onClick={() => { navigate('/contact'); setMobileOpen(false); }}><User size={18} style={{ color: colors.charcoal }} /></button>
                <button onClick={() => { navigate('/wishlist'); setMobileOpen(false); }}><Heart size={18} style={{ color: colors.charcoal }} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function ValueProps() {
  return (
    <section className="border-y overflow-x-auto" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
      <div className="flex min-w-max md:min-w-0">
        {valueProps.map((prop) => (
          <div key={prop} className="flex-1 flex items-center gap-3 px-6 md:px-8 py-4 border-r last:border-r-0 justify-center" style={{ borderColor: colors.beige }}>
            <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0" style={{ borderColor: colors.roseGold }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.roseGold }} />
            </div>
            <span className="text-xs tracking-wide uppercase whitespace-nowrap" style={{ color: colors.charcoal }}>{prop}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  const { navigate } = useStore();

  const footerLinkNav = (colTitle: string, link: string) => {
    if (colTitle === 'Shop') {
      if (link === 'Skincare') return navigate('/products?category=Serums');
      if (link === 'Makeup') return navigate('/products?category=Treatments');
      if (link === 'New Arrivals') return navigate('/products?category=New Arrivals');
      return navigate('/products');
    }
    if (link === 'Contact') return navigate('/contact');
    if (link === 'Returns' || link === 'Shipping' || link === 'FAQ') return navigate('/contact');
    if (link === 'About' || link === 'Journal' || link === 'Sustainability' || link === 'Press') return navigate('/');
    return navigate('/products');
  };

  return (
    <footer className="px-6 md:px-8 py-12" style={{ backgroundColor: colors.softBlack }}>
      <div className="grid gap-8 mb-10 grid-cols-2 md:grid-cols-5">
        <div className="col-span-2">
          <p className="text-lg tracking-[0.3em] uppercase font-light mb-3" style={{ fontFamily: serif, color: colors.ivory }}>MOMENTOUS GLOW</p>
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: colors.beigeDark }}>
            Clean beauty for radiant, healthy skin. Dermatologist tested. Sustainably sourced.
          </p>
        </div>
        {footerColumns.map(col => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: colors.roseGold }}>{col.title}</p>
            <ul className="space-y-2">
              {col.links.map(link => (
                <li key={link}>
                  <button
                    onClick={() => footerLinkNav(col.title, link)}
                    className="text-xs hover:opacity-70 transition-opacity"
                    style={{ color: colors.beigeDark }}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t flex flex-wrap gap-4 justify-between items-center text-xs" style={{ borderColor: '#3a3a3a', color: colors.beigeDark }}>
        <span>© 2026 Momentous Glow. All rights reserved.</span>
        <div className="flex gap-4">
          <a className="hover:opacity-70 cursor-pointer">Privacy Policy</a>
          <a className="hover:opacity-70 cursor-pointer">Terms of Service</a>
          <a className="hover:opacity-70 cursor-pointer">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="px-6 md:px-8 py-14" style={{ backgroundColor: colors.charcoal }}>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: colors.roseGold }}>Stay in the Glow</p>
        <h2 className="font-light mb-4 text-2xl md:text-3xl" style={{ fontFamily: serif, color: colors.ivory }}>
          10% off your first order
        </h2>
        <p className="text-sm mb-8" style={{ color: colors.beigeDark }}>
          Join our community. Be the first to know about new arrivals, exclusive offers, and skincare tips.
        </p>
        {submitted ? (
          <p className="text-sm py-3" style={{ color: colors.champagne }}>Thank you! Check your inbox for a confirmation.</p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            className="flex gap-2 flex-col md:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent border px-4 py-3 text-sm focus:outline-none"
              style={{ borderColor: '#555555', color: colors.ivory }}
            />
            <button
              type="submit"
              className="px-8 py-3 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: colors.roseGold, color: colors.white }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
