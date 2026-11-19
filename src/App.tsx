import { StoreProvider, useStore } from './components/hifi/store';
import HiFiHomepage from './components/hifi/HiFiHomepage';
import HiFiPLP from './components/hifi/HiFiPLP';
import HiFiPDP from './components/hifi/HiFiPDP';
import HiFiCart from './components/hifi/HiFiCart';
import HiFiCheckout from './components/hifi/HiFiCheckout';
import HiFiContact from './components/hifi/HiFiContact';
import HiFiSearch from './components/hifi/HiFiSearch';
import HiFiWishlist from './components/hifi/HiFiWishlist';

function Router() {
  const { route } = useStore();

  if (route === '/' || route === '') return <HiFiHomepage />;
  if (route.startsWith('/products')) return <HiFiPLP />;
  if (route.startsWith('/product/')) {
    const productId = route.replace('/product/', '');
    return <HiFiPDP productId={productId} />;
  }
  if (route === '/cart') return <HiFiCart />;
  if (route === '/checkout') return <HiFiCheckout />;
  if (route === '/contact') return <HiFiContact />;
  if (route === '/search') return <HiFiSearch />;
  if (route === '/wishlist') return <HiFiWishlist />;

  return <HiFiHomepage />;
}

function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}

export default App;
