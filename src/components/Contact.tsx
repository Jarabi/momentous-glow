import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { colors, serif } from './theme';
import { AnnouncementBar, NavBar, Footer } from './shared';
import { useStore } from './store';

export default function Contact() {
  const { navigate } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) setSent(true);
  };

  return (
    <div style={{ backgroundColor: colors.ivory, color: colors.softBlack }}>
      <AnnouncementBar />
      <NavBar />

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-xs border-b" style={{ borderColor: colors.beige, color: colors.roseGold }}>
        <button onClick={() => navigate('/')} className="hover:underline">Home</button> / <span style={{ color: colors.charcoal }}>Contact</span>
      </div>

      {/* Header */}
      <div className="px-6 py-10 text-center border-b" style={{ backgroundColor: colors.beigeLight, borderColor: colors.beige }}>
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.roseGold }}>We're Here to Help</p>
        <h1 className="text-3xl font-light" style={{ fontFamily: serif, color: colors.softBlack }}>Get in Touch</h1>
        <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: colors.charcoal }}>
          Questions about a product, your order, or your skincare routine? Our team is ready to help.
        </p>
      </div>

      <div className="px-6 py-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div>
          <h2 className="text-lg font-light mb-6" style={{ fontFamily: serif, color: colors.softBlack }}>Contact Details</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.beigeLight }}>
                <Mail size={16} style={{ color: colors.roseGold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: colors.roseGold }}>Email</p>
                <p className="text-sm" style={{ color: colors.charcoal }}>admin@momentousglow.co.ke</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.beigeLight }}>
                <Phone size={16} style={{ color: colors.roseGold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: colors.roseGold }}>Phone</p>
                <p className="text-sm" style={{ color: colors.charcoal }}>0740 770 660</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.beigeLight }}>
                <MessageSquare size={16} style={{ color: colors.roseGold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: colors.roseGold }}>Live Chat</p>
                <p className="text-sm" style={{ color: colors.charcoal }}>Mon–Fri, 9am–6pm</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.beigeLight }}>
                <MapPin size={16} style={{ color: colors.roseGold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: colors.roseGold }}>Address</p>
                <p className="text-sm" style={{ color: colors.charcoal }}>Sabasaba Stalls, 1st Floor, along Moi Avenue in Nairobi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <CheckCircle size={40} style={{ color: '#4A7C59' }} />
              <p className="text-lg font-light mt-4 mb-2" style={{ fontFamily: serif, color: colors.softBlack }}>Message Sent!</p>
              <p className="text-sm" style={{ color: colors.charcoal }}>Thank you, {name}. We'll get back to you within 24 hours.</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-6 px-6 py-3 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-light mb-2" style={{ fontFamily: serif, color: colors.softBlack }}>Send a Message</h2>
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: colors.roseGold }}>Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: colors.beige, color: colors.charcoal, backgroundColor: colors.white }}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: colors.roseGold }}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: colors.beige, color: colors.charcoal, backgroundColor: colors.white }}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: colors.roseGold }}>Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full border rounded px-4 py-3 text-sm focus:outline-none resize-none"
                  style={{ borderColor: colors.beige, color: colors.charcoal, backgroundColor: colors.white }}
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.softBlack, color: colors.ivory }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
