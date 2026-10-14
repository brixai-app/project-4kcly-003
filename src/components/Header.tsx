import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export interface HeaderProps {
  onSearchChange?: (value: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const [query, setQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemCount = items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearchChange?.(value);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const navLinkClasses = (path: string) =>
    cn(
      'text-sm font-semibold tracking-[0.18em] uppercase transition-colors',
      location.pathname === path
        ? 'text-[#004e89]'
        : 'text-[#4b5a63] hover:text-[#0b1f2a]'
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e6d8c8]/80 bg-[#f4e9dc]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4 lg:px-0">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="flex h-10 w-10 items-center justify-center rounded-[18px] border border-[#e6d8c8] bg-[#fff7ee] shadow-sm"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-[#004e89]">
                NW
              </span>
            </motion.div>
            <div className="hidden flex-col md:flex">
              <span className="font-[Sora] text-xs font-semibold tracking-[0.28em] text-[#4b5a63]">
                NISHANT WATERS
              </span>
              <span className="text-[11px] font-light uppercase tracking-[0.24em] text-[#0b1f2a]">
                Custom-labeled Still & Sparkling
              </span>
            </div>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className={navLinkClasses('/')}>
              Home
            </Link>
            <Link to="/shop" className={navLinkClasses('/shop')}>
              Shop
            </Link>
            <button
              type="button"
              onClick={() => handleNav('/about')}
              className={navLinkClasses('/about')}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className={navLinkClasses('/contact')}
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden items-center rounded-[18px] border border-[#e6d8c8] bg-[#fff7ee] px-3 py-1.5 md:flex">
              <Search className="mr-2 h-4 w-4 text-[#4b5a63]" />
              <input
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search bottles, labels..."
                className="w-40 bg-transparent text-xs font-medium text-[#0b1f2a] placeholder:text-[#4b5a63]/70 focus:outline-none"
              />
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96, y: 0 }}
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-[18px] border border-[#e6d8c8] bg-[#fff7ee] text-[#0b1f2a]"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-md bg-[#004e89] px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </motion.button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[#e6d8c8] bg-[#fff7ee] text-[#0b1f2a] md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#e6d8c8] bg-[#fff7ee] md:hidden"
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
                <div className="flex items-center rounded-[16px] border border-[#e6d8c8] bg-[#f4e9dc]/70 px-3 py-1.5">
                  <Search className="mr-2 h-4 w-4 text-[#4b5a63]" />
                  <input
                    value={query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search bottles, labels..."
                    className="w-full bg-transparent text-xs font-medium text-[#0b1f2a] placeholder:text-[#4b5a63]/70 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/')}
                  className={cn('text-left', navLinkClasses('/'))}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/shop')}
                  className={cn('text-left', navLinkClasses('/shop'))}
                >
                  Shop
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/about')}
                  className={cn('text-left', navLinkClasses('/about'))}
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className={cn('text-left', navLinkClasses('/contact'))}
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

export default Header;