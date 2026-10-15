import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Sparkles, ArrowRight, ArrowLeft, ChevronDown, ChevronRight, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import mockData, { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  showSurfaceRibbons?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  description: string;
}

export interface HeaderSearchSuggestion {
  id: string;
  label: string;
  type: 'product' | 'category' | 'action';
  path?: string;
  meta?: string;
}

export interface SearchFieldProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export interface SearchSuggestionListProps {
  query?: string;
  suggestions?: HeaderSearchSuggestion[];
  isOpen?: boolean;
  onSelectSuggestion?: (suggestion: HeaderSearchSuggestion) => void;
  onClose?: () => void;
}

export interface MobileNavSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  navItems?: NavItem[];
  onNavigate?: (path: string) => void;
}

export function useDebouncedValue<T>(value: T, delay: number = 320): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      window.clearTimeout(handle);
    };
  }, [value, delay]);

  return debounced;
}

export function useIsScrolled(threshold: number = 4): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY ?? 0;
      setIsScrolled(offset > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

export function BrandLockup() {
  const navigate = useNavigate();

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <button
      type="button"
      onClick={handleNavigateHome}
      className="group flex items-center gap-3 rounded-full border border-[#e7d6c6]/80 bg-[#fff7ee]/80 px-3 py-1.5 text-left shadow-sm backdrop-blur-sm transition hover:border-[#007a8a]/40 hover:bg-[#fff7ee]"
    >
      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#e7d6c6]/80 bg-[#f5e9dc]">
        <img
          crossOrigin="anonymous"
          src="https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
          alt="Nishant Waters brand texture"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/15" />
      </div>
      <div className="flex flex-col">
        <span className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
          Nishant Waters
        </span>
        <span className="font-['Lora'] text-[11px] text-[#6b625a]">
          Custom-labeled hydration atelier
        </span>
      </div>
      <span className="ml-0.5 flex items-center rounded-full bg-[#007a8a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition group-hover:bg-[#006674]">
        <Sparkles className="mr-1 h-3 w-3" />
        Since 2024
      </span>
    </button>
  );
}

export function SearchField({
  value = '',
  placeholder = 'Search waters, occasions, flavor moods…',
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  className,
}: SearchFieldProps) {
  const [internalValue, setInternalValue] = useState<string>(value);
  const debouncedValue = useDebouncedValue<string>(internalValue, 260);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue === value) return;
    onChange?.(debouncedValue);
  }, [debouncedValue, onChange, value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value ?? '';
      setInternalValue(next);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const submitValue = internalValue.trim();
        if (submitValue.length > 0) {
          onSubmit?.(submitValue);
        }
      }
      if (event.key === 'Escape') {
        (event.currentTarget as HTMLInputElement | null)?.blur();
      }
    },
    [internalValue, onSubmit]
  );

  return (
    <div
      className={cn(
        'relative flex-1 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee]/90 px-3 py-1.5 shadow-sm backdrop-blur-sm transition focus-within:border-[#007a8a] focus-within:shadow-md',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center justify-center">
        <Search className="h-4 w-4 text-[#6b625a]" />
      </div>
      <input
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="h-8 w-full border-none bg-transparent pl-8 pr-8 font-['Lora'] text-xs text-[#333333] placeholder:text-[#b1a79d] focus:outline-none"
      />
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <span className="rounded-full bg-[#f5e9dc] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#6b625a]">
          Press Enter
        </span>
      </div>
    </div>
  );
}

export function SearchSuggestionList({
  query = '',
  suggestions = [],
  isOpen = false,
  onSelectSuggestion,
  onClose,
}: SearchSuggestionListProps) {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (suggestion: HeaderSearchSuggestion) => {
      if (suggestion.path) {
        navigate(suggestion.path);
      }
      onSelectSuggestion?.(suggestion);
      onClose?.();
    },
    [navigate, onClose, onSelectSuggestion]
  );

  const visibleSuggestions = useMemo(() => {
    if (!isOpen) return [];
    return suggestions.slice(0, 8);
  }, [isOpen, suggestions]);

  return (
    <AnimatePresence>
      {isOpen && visibleSuggestions.length > 0 && (
        <motion.div
          key="header-search-suggestions"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute left-0 right-0 top-full z-30 mt-2 origin-top rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] shadow-xl shadow-black/5"
        >
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <span className="font-['DM_Sans'] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b625a]">
              Curated for “{query}”
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full bg-[#f5e9dc] px-2 py-0.5 text-[10px] font-medium text-[#6b625a] transition hover:bg-[#e7d6c6]"
            >
              <ArrowUpRightMini />
              Dismiss
            </button>
          </div>
          <div className="grid grid-cols-1 gap-0.5 border-t border-dashed border-[#e7d6c6]/80">
            {visibleSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="group flex items-center justify-between px-3 py-2 text-left transition hover:bg-[#f5e9dc]/80"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5e9dc] text-[#007a8a]">
                    {item.type === 'product' && (
                      <BottleGlyph className="h-3.5 w-3.5" />
                    )}
                    {item.type === 'category' && (
                      <Gauge className="h-3.5 w-3.5" />
                    )}
                    {item.type === 'action' && (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-['DM_Sans'] text-xs text-[#333333]">
                      {item.label}
                    </span>
                    {item.meta && (
                      <span className="truncate font-['Lora'] text-[11px] text-[#6b625a]">
                        {item.meta}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-2">
                  <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b625a] md:inline">
                    {item.type === 'product' && 'View details'}
                    {item.type === 'category' && 'Browse edit'}
                    {item.type === 'action' && 'Jump'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#b1a79d] transition group-hover:translate-x-0.5 group-hover:text-[#007a8a]" />
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-['Lora'] text-[10px] text-[#6b625a]">
              Use arrow keys and Enter to move through water stories.
            </span>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 rounded-full bg-[#007a8a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-[#006674]"
            >
              Open full shop
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ArrowUpRightMini() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 text-[#6b625a]"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M4 3h5v5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8l5-5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottleGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-4 w-4 text-[#007a8a]', className)}
      viewBox="0 0 16 32"
      fill="none"
    >
      <rect
        x="4"
        y="6"
        width="8"
        height="20"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="5.25"
        y="7.25"
        width="5.5"
        height="7.5"
        rx="2.75"
        fill="currentColor"
        opacity="0.22"
      />
      <path
        d="M6.5 3.5h3A.5.5 0 0 1 10 4v1.5a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 6 5.5V4a.5.5 0 0 1 .5-.5Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function MobileNavSheet({
  isOpen = false,
  onClose,
  navItems = [],
  onNavigate,
}: MobileNavSheetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
      onNavigate?.(path);
      onClose?.();
    },
    [navigate, onClose, onNavigate]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.32 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.aside
            key="mobile-nav-sheet"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[78vw] max-w-sm flex-col border-l border-[#e7d6c6] bg-[#fff7ee] shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <div className="flex flex-col">
                <span className="font-['DM_Sans'] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                  Navigation
                </span>
                <span className="font-['Lora'] text-[11px] text-[#6b625a]">
                  Drift between stories, shop, and design.
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#f5e9dc] text-[#6b625a] shadow-sm transition hover:bg-[#e7d6c6]"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative flex-1 overflow-y-auto border-t border-dashed border-[#e7d6c6]/80">
              <nav className="flex flex-col">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        'group flex items-center justify-between px-4 py-3 text-left transition',
                        isActive
                          ? 'bg-[#f5e9dc]'
                          : 'hover:bg-[#f5e9dc]/80 active:bg-[#f5e9dc]'
                      )}
                    >
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'font-["DM_Sans"] text-sm tracking-[0.16em] text-[#6b625a]',
                            isActive && 'font-semibold text-[#333333]'
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="mt-0.5 max-w-xs font-['Lora'] text-[11px] text-[#6b625a]">
                          {item.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-3">
                        {isActive && (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#007a8a]">
                            Now
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-[#b1a79d] transition group-hover:translate-x-0.5 group-active:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="border-t border-[#e7d6c6] bg-[#f5e9dc] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-['DM_Sans'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                    Bespoke labels
                  </span>
                  <span className="font-['Lora'] text-[11px] text-[#6b625a]">
                    Start with a blank canvas or guided template.
                  </span>
                </div>
                <Link
                  to="/design"
                  onClick={() => {
                    onClose?.();
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#007a8a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#006674]"
                >
                  Open Designer
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Header({
  className,
  showSearch = true,
  showSurfaceRibbons = true,
}: HeaderProps) {
  const { pathname } = useLocation();
  const isScrolled = useIsScrolled(8);
  const navigate = useNavigate();
  const { getTotalQuantity, openCart, state } = useCart();

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [hasInteractedWithSearch, setHasInteractedWithSearch] =
    useState<boolean>(false);

  const cartQuantity = getTotalQuantity();
  const debouncedSearchQuery = useDebouncedValue<string>(searchQuery, 260);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: 'Home',
        path: '/',
        description: 'Editorial stories in motion, our world of water.',
      },
      {
        label: 'Shop',
        path: '/shop',
        description: 'Curated bottles, flavors and formats.',
      },
      {
        label: 'Design',
        path: '/design',
        description: 'Label atelier with real-time bottle preview.',
      },
      {
        label: 'About',
        path: '/about',
        description: 'The origin, craft, and philosophy of Nishant Waters.',
      },
      {
        label: 'Contact',
        path: '/contact',
        description: 'Concierge studio for collaborations and orders.',
      },
    ],
    []
  );

  const searchSuggestions: HeaderSearchSuggestion[] = useMemo(() => {
    const trimmed = debouncedSearchQuery.trim().toLowerCase();
    if (!trimmed) return [];

    const matchedProducts: HeaderSearchSuggestion[] = (products ?? [])
      .filter((product: Product) => {
        const nameMatch = product.name.toLowerCase().includes(trimmed);
        const collectionMatch = product.collection
          .toLowerCase()
          .includes(trimmed);
        const categoryMatch = product.category
          .toLowerCase()
          .includes(trimmed);
        const tagMatch = product.meta?.tags?.some((tag: string) =>
          tag.toLowerCase().includes(trimmed)
        );
        return nameMatch || collectionMatch || categoryMatch || tagMatch;
      })
      .slice(0, 4)
      .map((product: Product) => ({
        id: product.id as unknown as string,
        label: product.name,
        type: 'product' as const,
        path: `/product/${product.meta?.slug ?? product.id}`,
        meta: `${product.collection} • from ${mockData.appConfig?.theme?.accentText ?? '₹'}${
          product.startingAtPrice?.amount ?? product.basePrice?.amount ?? 0
        }`,
      }));

    const matchedCategories: HeaderSearchSuggestion[] =
      (mockData.categories ?? [])
        .filter((category) => {
          const nameMatch = category.name.toLowerCase().includes(trimmed);
          const descMatch = category.description
            .toLowerCase()
            .includes(trimmed);
          const tagMatch = category.tagline.toLowerCase().includes(trimmed);
          return nameMatch || descMatch || tagMatch;
        })
        .slice(0, 3)
        .map((category) => ({
          id: category.id as unknown as string,
          label: category.name,
          type: 'category' as const,
          path: `/shop?category=${encodeURIComponent(category.slug)}`,
          meta: category.tagline,
        }));

    const actions: HeaderSearchSuggestion[] = [];
    if ('wedding'.includes(trimmed)) {
      actions.push({
        id: 'intent-wedding',
        label: 'Plan elevated wedding hydration',
        type: 'action',
        path: '/design?wedding=true',
        meta: 'Templates tuned for ceremonies, sangeets, and receptions.',
      });
    }
    if ('corporate'.includes(trimmed) || 'office'.includes(trimmed)) {
      actions.push({
        id: 'intent-corporate',
        label: 'Curate office & corporate gifting waters',
        type: 'action',
        path: '/shop?category=corporate',
        meta: 'Signature and bespoke collections for brand-first hydration.',
      });
    }

    if (
      'sparkling'.includes(trimmed) ||
      'still'.includes(trimmed) ||
      'mineral'.includes(trimmed)
    ) {
      actions.push({
        id: 'intent-profile',
        label: 'Filter by hydration profile',
        type: 'action',
        path: `/shop?profile=${encodeURIComponent(trimmed)}`,
        meta: 'Use filters to dial in still, sparkling, mineral and more.',
      });
    }

    return [...matchedProducts, ...matchedCategories, ...actions];
  }, [debouncedSearchQuery]);

  const isSearchListOpen =
    isSearchFocused && hasInteractedWithSearch && searchSuggestions.length > 0;

  const handleSearchSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    },
    [navigate]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      return;
    }
  }, []);

  const handleSuggestionSelect = useCallback(
    (_suggestion: HeaderSearchSuggestion) => {
      setIsSearchFocused(false);
    },
    []
  );

  const handleCartClick = useCallback(() => {
    openCart();
  }, [openCart]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileNavOpen((prev) => !prev);
  }, []);

  const isOnCheckout = pathname.startsWith('/checkout');

  const headerSurfaceClasses = useMemo(
    () =>
      cn(
        'pointer-events-auto sticky top-0 z-30 w-full',
        'backdrop-blur-md',
        isScrolled ? 'shadow-md shadow-black/5' : 'shadow-none'
      ),
    [isScrolled]
  );

  const headerInnerClasses = useMemo(
    () =>
      cn(
        'relative mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 md:px-6 lg:px-8',
        'rounded-b-[22px]',
        'border-x border-b border-[#e7d6c6]/90',
        'bg-[#f5e9dc]/90'
      ),
    []
  );

  const showRibbons = showSurfaceRibbons && !isOnCheckout;

  const primaryNav = (
    <nav className="hidden items-center gap-1 lg:flex">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'group relative inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              'transition',
              isActive
                ? 'bg-[#fff7ee] text-[#333333]'
                : 'text-[#6b625a] hover:bg-[#fff7ee]/80'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className="font-['DM_Sans'] text-[11px] uppercase tracking-[0.18em]">
                {item.label}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="header-active-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-[#007a8a]/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const secondaryMeta = (
    <div className="hidden items-center gap-3 md:flex">
      <div className="hidden items-center gap-1 rounded-full bg-[#fff7ee]/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b625a] md:inline-flex">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#007a8a] text-[9px] font-semibold text-white">
          {state?.meta?.itemCount ?? 0}
        </span>
        In cart
      </div>
      <div className="hidden h-6 w-px bg-[#e7d6c6] md:block" />
      <div className="hidden flex-col md:flex">
        <span className="font-['DM_Sans'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
          Hydration status
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e7d6c6]">
            <div className="h-full w-2/3 bg-[#007a8a]" />
          </div>
          <span className="font-['Lora'] text-[10px] text-[#6b625a]">
            Studio in slow pour
          </span>
        </div>
      </div>
    </div>
  );

  const cartBadge = (
    <div className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#007a8a] px-0.5 text-[9px] font-semibold text-white shadow-sm">
      {cartQuantity > 99 ? '99+' : cartQuantity}
    </div>
  );

  return (
    <header className={cn(headerSurfaceClasses, className)}>
      {showRibbons && (
        <div className="relative mx-auto flex w-full max-w-7xl items-stretch justify-between gap-6 px-4 pt-3 md:px-6 lg:px-8">
          <div className="hidden h-6 flex-1 items-center overflow-hidden rounded-full border border-dashed border-[#e7d6c6] bg-[#fff7ee]/90 px-3 text-[10px] text-[#6b625a] sm:flex">
            <div className="mr-2 inline-flex h-4 items-center rounded-full bg-[#007a8a]/8 px-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#007a8a]">
              {mockData.homeHeroCopy?.eyebrow ?? 'Hydration, edited'}
            </div>
            <p className="hidden whitespace-nowrap font-['Lora'] text-[10px] md:block">
              {mockData.homeHeroCopy?.subtitle ??
                'High-context water for weddings, ateliers and hospitality moments.'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <span className="rounded-full bg-[#fff7ee] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6b625a]">
              Hydration, edited
            </span>
          </div>
          <div className="hidden h-6 items-center gap-2 text-[10px] text-[#6b625a] sm:flex">
            <span className="rounded-full bg-[#fff7ee] px-2 py-1 font-['DM_Sans'] text-[9px] font-semibold uppercase tracking-[0.2em]">
              Ships from Mumbai
            </span>
            <span className="font-['Lora'] text-[10px]">
              {state?.priceSummary?.currency ?? 'INR'} • lead times from{' '}
              {state?.shippingMethods?.[0]?.leadTimeDaysMin ?? 5} days
            </span>
          </div>
        </div>
      )}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={headerInnerClasses}
      >
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee]/80 text-[#6b625a] shadow-sm transition hover:bg-[#f5e9dc] lg:hidden"
            onClick={handleMobileMenuToggle}
            aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileNavOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
          <BrandLockup />
        </div>
        {showSearch && (
          <div className="relative hidden flex-1 items-center px-3 sm:flex">
            <SearchField
              value={searchQuery}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onFocus={() => {
                setIsSearchFocused(true);
                setHasInteractedWithSearch(true);
              }}
              onBlur={() => {
                window.setTimeout(() => {
                  setIsSearchFocused(false);
                }, 100);
              }}
            />
            <SearchSuggestionList
              query={debouncedSearchQuery}
              suggestions={searchSuggestions}
              isOpen={isSearchListOpen}
              onSelectSuggestion={handleSuggestionSelect}
              onClose={() => setIsSearchFocused(false)}
            />
          </div>
        )}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee]/80 text-[#6b625a] shadow-sm transition hover:bg-[#f5e9dc] md:inline-flex"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {primaryNav}
          {secondaryMeta}
          <button
            type="button"
            onClick={() => navigate('/design')}
            className="hidden items-center gap-1.5 rounded-full border border-[#007a8a]/40 bg-[#007a8a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#006674] md:inline-flex"
          >
            <span>Open Designer</span>
            <Sparkles className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCartClick}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#007a8a]/60 bg-[#007a8a] text-white shadow-sm transition hover:bg-[#006674]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartQuantity > 0 && cartBadge}
          </button>
        </div>
      </motion.div>
      {showSearch && (
        <div className="flex items-center px-4 pb-3 pt-1 sm:hidden md:px-6 lg:px-8">
          <SearchField
            value={searchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            onFocus={() => {
              setIsSearchFocused(true);
              setHasInteractedWithSearch(true);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                setIsSearchFocused(false);
              }, 100);
            }}
          />
        </div>
      )}
      <MobileNavSheet
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={navItems}
        onNavigate={() => setMobileNavOpen(false)}
      />
    </header>
  );
}

export default Header;