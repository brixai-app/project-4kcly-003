import React, { useEffect, useMemo, useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { Search, ShoppingBag, ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import DesignPage from '@/pages/DesignPage';
import CheckoutPage from '@/pages/CheckoutPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';
import { CartProvider, useCart } from '@/context/CartContext';
import mockData, { products as mockProducts } from '@/data/mockData';
import {
  ID,
  Product,
  ProductFilterState,
  ProductSortState,
  NishantWatersAppConfig,
  defaultAppConfig,
} from '@/types';

export interface AppShellProps {
  initialConfig?: NishantWatersAppConfig;
}

export interface GlobalSearchState {
  query: string;
  isOpen: boolean;
  source: 'header' | 'global';
}

export interface RouteTransitionWrapperProps {
  children?: React.ReactNode;
}

export interface GlobalQuickSearchProps {
  query?: string;
  isOpen?: boolean;
  onChangeQuery?: (value: string) => void;
  onClose?: () => void;
  onSelectResult?: (path: string) => void;
}

export interface SearchResultItem {
  id: string;
  label: string;
  type: 'product' | 'category' | 'collection' | 'action';
  path: string;
  meta?: string;
}

export interface AppLayoutContextBarProps {
  className?: string;
}

export interface FloatingCartTriggerProps {
  className?: string;
}

const routeVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function useAppConfig(): NishantWatersAppConfig {
  const [config, setConfig] = useState<NishantWatersAppConfig>(() => {
    const fromMock = (mockData?.appConfig ?? null) as NishantWatersAppConfig | null;
    return fromMock ?? defaultAppConfig;
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('nishant-waters:appConfig') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as NishantWatersAppConfig;
        setConfig(prev => ({
          ...prev,
          ...parsed,
        }));
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!config?.enablePersistence) return;
    try {
      window.localStorage.setItem('nishant-waters:appConfig', JSON.stringify(config));
    } catch {
    }
  }, [config]);

  return config;
}

export function useRouteChangeAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const event = {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        timestamp: new Date().toISOString(),
      };
      const queueRaw = window.sessionStorage.getItem('nishant-waters:route-events');
      const queue = queueRaw ? (JSON.parse(queueRaw) as unknown[]) : [];
      queue.push(event);
      if (queue.length > 40) {
        queue.shift();
      }
      window.sessionStorage.setItem('nishant-waters:route-events', JSON.stringify(queue));
    } catch {
    }
  }, [location]);
}

export function buildSearchIndex(products: Product[]): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  products.forEach(product => {
    items.push({
      id: product.id as unknown as string,
      label: product.name,
      type: 'product',
      path: `/product/${product.meta?.slug ?? product.id}`,
      meta: `${product.collection} • ${product.hydrationProfile}`,
    });

    if (product.category) {
      items.push({
        id: `${product.id as unknown as string}-cat`,
        label: `Shop ${product.category} waters`,
        type: 'category',
        path: `/shop?category=${product.category}`,
        meta: 'Category',
      });
    }
  });

  items.push(
    {
      id: 'action-shop-all',
      label: 'Browse all bottles',
      type: 'action',
      path: '/shop',
      meta: 'Action',
    },
    {
      id: 'action-start-design',
      label: 'Open label studio',
      type: 'action',
      path: '/design',
      meta: 'Design',
    },
    {
      id: 'action-contact',
      label: 'Speak with concierge',
      type: 'action',
      path: '/contact',
      meta: 'Support',
    },
  );

  return items;
}

export function filterSearchResults(index: SearchResultItem[], query: string): SearchResultItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return index.slice(0, 8);
  }
  const scored = index
    .map(item => {
      const label = item.label.toLowerCase();
      const meta = item.meta?.toLowerCase() ?? '';
      let score = 0;
      if (label === trimmed) score += 6;
      if (label.startsWith(trimmed)) score += 4;
      if (label.includes(trimmed)) score += 3;
      if (meta.includes(trimmed)) score += 1;
      if (item.type === 'product') score += 1;
      if (item.type === 'action') score -= 1;
      return { item, score };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map(entry => entry.item);
}

export function GlobalQuickSearch({
  query = '',
  isOpen = false,
  onChangeQuery,
  onClose,
  onSelectResult,
}: GlobalQuickSearchProps) {
  const navigate = useNavigate();
  const [internalQuery, setInternalQuery] = useState<string>(query);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const index = useMemo(() => buildSearchIndex(mockProducts ?? []), []);
  const results = useMemo(
    () => filterSearchResults(index, internalQuery),
    [index, internalQuery],
  );

  useEffect(() => {
    setInternalQuery(query);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const handleChange = (value: string) => {
    setInternalQuery(value);
    onChangeQuery?.(value);
  };

  const handleSelect = (path: string) => {
    onSelectResult?.(path);
    navigate(path);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18 } }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
        >
          <motion.div
            className="pointer-events-auto mt-20 w-full max-w-3xl rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] shadow-xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <div className="border-b border-[#e7d6c6] px-4 py-2.5 md:px-5">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#6b625a] uppercase">
                <Search className="h-3.5 w-3.5" />
                <span>Studio-wide search</span>
                <span className="ml-auto text-[10px] opacity-70">
                  Press Esc to close
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#e7d6c6] bg-[#fff7ee] px-3 py-2.5">
                <Search className="h-4 w-4 flex-none text-[#6b625a]" />
                <input
                  value={internalQuery}
                  onChange={event => handleChange(event.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search bottles, flavors, occasions, or try “corporate gifting”"
                  className="w-full bg-transparent text-sm font-medium text-[#333333] outline-none placeholder:text-[#b0a396]"
                />
                <span className="hidden items-center gap-1 rounded-lg border border-[#e7d6c6] px-2 py-1 text-[10px] font-medium text-[#6b625a] md:inline-flex">
                  <span className="rounded-md bg-[#f5e9dc] px-1.5 py-0.5">⌘</span>
                  <span>K</span>
                </span>
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto px-2 py-2 md:px-3 md:py-3">
              {results.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e7d6c6] bg-[#f5e9dc] px-4 py-6 text-sm text-[#6b625a]">
                  <div className="font-semibold text-[#333333]">
                    No matches for “{internalQuery.trim()}”
                  </div>
                  <div className="mt-1">
                    Try searching for an occasion (“wedding”), flavor mood (“citrus”), or open the full shop.
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelect('/shop')}
                    className="mt-3 inline-flex items-center gap-1 rounded-md bg-[#007a8a] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                  >
                    <span>Open Shop</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map(result => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(result.path)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                          'hover:bg-[#f5e9dc]',
                        )}
                      >
                        <div>
                          <div className="font-medium text-[#333333]">
                            {result.label}
                          </div>
                          <div className="mt-0.5 text-xs text-[#6b625a]">
                            {result.meta ?? result.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                          <span>
                            {result.type === 'product'
                              ? 'Product'
                              : result.type === 'category'
                              ? 'Category'
                              : result.type === 'collection'
                              ? 'Collection'
                              : 'Action'}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RouteTransitionWrapper({ children = null }: RouteTransitionWrapperProps) {
  const location = useLocation();
  useRouteChangeAnalytics();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={routeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-[80vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppLayoutContextBar({ className }: AppLayoutContextBarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const cart = useCart();
  const step = cart?.activeCheckoutStep ?? 'details';

  const currentLabel = useMemo(() => {
    if (location.pathname.startsWith('/checkout')) {
      if (step === 'details') return 'Guest details';
      if (step === 'shipping') return 'Shipping';
      if (step === 'review') return 'Review';
      if (step === 'payment') return 'Payment';
      if (step === 'confirmation') return 'Confirmation';
      return 'Checkout';
    }
    if (location.pathname.startsWith('/design')) {
      return 'Label Studio';
    }
    if (location.pathname.startsWith('/shop')) {
      return 'Shop';
    }
    if (location.pathname.startsWith('/product')) {
      return 'Product detail';
    }
    return 'Nishant Waters';
  }, [location.pathname, step]);

  const totalQuantity = cart?.getTotalQuantity() ?? 0;

  return (
    <div
      className={cn(
        'sticky top-0 z-20 border-b border-[#e7d6c6] bg-[#f5e9dc]/95 backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 md:px-8">
        <button
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]"
        >
          <Menu className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {isCollapsed ? 'Show journey' : 'Hide journey'}
          </span>
          <span className="inline sm:hidden">Journey</span>
        </button>
        {!isCollapsed ? (
          <div className="flex flex-1 items-center justify-center gap-4 text-[11px] font-medium text-[#6b625a]">
            <div className="hidden items-center gap-1 md:flex">
              <span className="h-1 w-1 rounded-full bg-[#6b625a]" />
              <span>{currentLabel}</span>
            </div>
            <div className="hidden h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#e7d6c6] to-transparent md:block" />
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#fff7ee] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                Cart {totalQuantity > 0 ? `• ${totalQuantity} units` : 'ready'}
              </span>
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <FloatingCartTrigger />
        </div>
      </div>
    </div>
  );
}

export function FloatingCartTrigger({ className }: FloatingCartTriggerProps) {
  const { openCart, getTotalQuantity } = useCart();
  const quantity = getTotalQuantity();
  const showBadge = quantity > 0;

  return (
    <button
      type="button"
      onClick={() => openCart()}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee] text-[#333333] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <ShoppingBag className="h-4.5 w-4.5" />
      {showBadge ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#007a8a] px-1 text-[10px] font-semibold text-white">
          {quantity}
        </span>
      ) : null}
    </button>
  );
}

export function useGlobalSearchHotkeys(onToggle: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaPressed = isMac ? event.metaKey : event.ctrlKey;
      if (metaPressed && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onToggle]);
}

export function AppShell({ initialConfig }: AppShellProps) {
  const location = useLocation();
  const config = useAppConfig();
  const [searchState, setSearchState] = useState<GlobalSearchState>({
    query: '',
    isOpen: false,
    source: 'global',
  });
  const [productModalState, setProductModalState] = useState<{
    productId?: ID;
    open: boolean;
  }>({
    productId: undefined,
    open: false,
  });

  const effectiveConfig = useMemo<NishantWatersAppConfig>(() => {
    return {
      ...(defaultAppConfig ?? {}),
      ...(config ?? {}),
      ...(initialConfig ?? {}),
    };
  }, [config, initialConfig]);

  useGlobalSearchHotkeys(() => {
    setSearchState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  });

  const handleOpenProductFromAnywhere = (productId: ID) => {
    setProductModalState({
      productId,
      open: true,
    });
  };

  const handleCloseProductModal = () => {
    setProductModalState(prev => ({
      ...prev,
      open: false,
    }));
  };

  const showHeader = !location.pathname.startsWith('/checkout');
  const showFooter = true;

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5e9dc] text-[#333333]"
      style={{
        fontFamily: 'Lora, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {showHeader ? (
        <Header className="z-30" showSearch />
      ) : null}
      <AppLayoutContextBar />
      <main className="flex-1">
        <RouteTransitionWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/design" element={<DesignPage initialState={mockData?.labelDesignerInitialState} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </RouteTransitionWrapper>
      </main>
      {showFooter ? <Footer showNewsletter showSurfaceRibbons /> : null}
      <CartDrawer triggerVariant="icon" showTrigger={false} />
      <ProductDetailModal
        productId={productModalState.productId}
        open={productModalState.open}
        onOpenChange={open =>
          setProductModalState(prev => ({
            ...prev,
            open,
          }))
        }
        onClose={handleCloseProductModal}
        enableDesignCta
      />
      <GlobalQuickSearch
        query={searchState.query}
        isOpen={searchState.isOpen}
        onChangeQuery={value =>
          setSearchState(prev => ({
            ...prev,
            query: value,
          }))
        }
        onClose={() =>
          setSearchState(prev => ({
            ...prev,
            isOpen: false,
          }))
        }
        onSelectResult={() => {
        }}
      />
      <Toaster
        toastOptions={{
          style: {
            background: '#fff7ee',
            borderRadius: 18,
            border: '1px solid #e7d6c6',
            color: '#333333',
            fontFamily:
              'DM Sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        }}
        position="top-right"
      />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center pb-4">
        <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#e7d6c6] bg-[#fff7ee]/95 px-3 py-1.5 shadow-lg">
          <button
            type="button"
            onClick={() =>
              setSearchState(prev => ({
                ...prev,
                isOpen: true,
                source: 'global',
              }))
            }
            className="inline-flex items-center gap-1 rounded-full bg-[#f5e9dc] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b625a]"
          >
            <Search className="h-3 w-3" />
            <span>Search Studio</span>
          </button>
          <FloatingCartTrigger />
          <KeyboardHint />
        </div>
      </div>
      <style>
        {`
          :root {
            --nw-bg: ${effectiveConfig?.theme?.background ?? '#f5e9dc'};
            --nw-surface: ${effectiveConfig?.theme?.surface ?? '#fff7ee'};
            --nw-border: ${effectiveConfig?.theme?.border ?? '#e7d6c6'};
            --nw-text: ${effectiveConfig?.theme?.textPrimary ?? '#333333'};
            --nw-muted: ${effectiveConfig?.theme?.textMuted ?? '#6b625a'};
            --nw-accent: ${effectiveConfig?.theme?.accent ?? '#007a8a'};
            --nw-radius-lg: ${(effectiveConfig?.theme?.radiusLg ?? 18).toString()}px;
          }
          body {
            background-color: var(--nw-bg);
            color: var(--nw-text);
          }
        `}
      </style>
    </div>
  );
}

export function KeyboardHint() {
  const [isMac, setIsMac] = useState<boolean>(false);

  useEffect(() => {
    const platform = navigator.platform.toUpperCase();
    setIsMac(platform.indexOf('MAC') >= 0);
  }, []);

  return (
    <div className="hidden items-center gap-1 rounded-full border border-[#e7d6c6] px-2 py-0.5 text-[10px] font-medium text-[#6b625a] md:flex">
      <span className="rounded-md bg-[#f5e9dc] px-1.5 py-0.5">
        {isMac ? '⌘' : 'Ctrl'}
      </span>
      <span className="rounded-md bg-[#f5e9dc] px-1.5 py-0.5">K</span>
      <span className="ml-1 opacity-80">Search Studio</span>
    </div>
  );
}

export function App() {
  return (
    <React.StrictMode>
      <HashRouter>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </HashRouter>
    </React.StrictMode>
  );
}

export default App;