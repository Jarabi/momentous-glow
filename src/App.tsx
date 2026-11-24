import { StoreProvider, useStore } from './components/store';
import Homepage from './components/Homepage';
import PLP from './components/PLP';
import PDP from './components/PDP';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Contact from './components/Contact';
import Search from './components/Search';
import Wishlist from './components/Wishlist';

function Router() {
  const { route } = useStore();

  if (route === '/' || route === '') return <Homepage />;
  if (route.startsWith('/products')) return <PLP />;
  if (route.startsWith('/product/')) {
    const productId = route.replace('/product/', '');
    return <PDP productId={productId} />;
  }
  if (route === '/cart') return <Cart />;
  if (route === '/checkout') return <Checkout />;
  if (route === '/contact') return <Contact />;
  if (route === '/search') return <Search />;
  if (route === '/wishlist') return <Wishlist />;

  return <Homepage />;
}

function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}

export default App;
