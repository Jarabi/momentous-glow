export const colors = {
  ivory: '#FFF8F0',
  beige: '#E8DED1',
  beigeLight: '#F0E8DC',
  beigeDark: '#D4C9BA',
  roseGold: '#C89B7B',
  roseGoldLight: '#D9B89A',
  roseGoldDark: '#A87A5B',
  champagne: '#D4AF37',
  champagneLight: '#E5C96B',
  champagneDark: '#B8962E',
  charcoal: '#333333',
  softBlack: '#222222',
  white: '#FFFFFF',
};

export const serif = 'Georgia, "Times New Roman", serif';

export function formatKes(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
}

export const navItems = ['Skincare', 'Makeup', 'Bundles', 'New Arrivals', 'Bestsellers', 'Journal'];

export const valueProps = ['Clean Formula', 'Cruelty Free', 'Dermatologist Tested', 'Sustainably Packaged'];

export const footerColumns = [
  { title: 'Shop', links: ['Skincare', 'Makeup', 'Bundles', 'New Arrivals'] },
  { title: 'Help', links: ['FAQ', 'Contact', 'Returns', 'Shipping'] },
  { title: 'Company', links: ['About', 'Journal', 'Sustainability', 'Press'] },
];
