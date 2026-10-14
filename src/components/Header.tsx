import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const { items, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const itemCount = items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    const existing = params.get('q') ?? '';
    setSearch(existing);
  }, [mounted]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      if (search.trim()) {
        params.set('q', search.trim());
      } else {
        params.delete('q');
      }
      navigate(`/shop?${params.toString()}`, { replace: false });
    },
    [navigate, search]
  );

  const handleNav = useCallback(
    (path: string) => {
      setMobileOpen(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <header
      className={cn(
        'w-full border-b border-[#DED5C8] bg-[#F7F1E8]/90 backdrop-blur-sm sticky top-0 z-40',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-3 lg:py-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-[#DED5C8] px-2.5 py-2 text-[#141310]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-3"
        >
          <div className="h-9 w-9 rounded-full border border-[#0E4A3A] flex items-center justify-center bg-white">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#0E4A3A]">
              NW
            </span>
          </div>
          <div className="flex flex-col leading-tight text-left">
            <span className="font-[500] tracking-[0.35em] text-[11px] uppercase text-[#5D584F]">
              Nishant Waters
            </span>
            <span className="text-[11px] text-[#5D584F]">
              Custom Labeled Bottled Water Atelier
            </span>
          </div>
        </button>

        <nav className="hidden lg:flex ml-10 gap-8 text-sm font-medium text-[#5D584F]">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="hover:text-[#141310] transition-colors tracking-[0.18em] uppercase"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('/shop')}
            className="hover:text-[#141310] transition-colors tracking-[0.18em] uppercase"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleNav('/about')}
            className="hover:text-[#141310] transition-colors tracking-[0.18em] uppercase"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('/contact')}
            className="hover:text-[#141310] transition-colors tracking-[0.18em] uppercase"
          >
            Contact
          </button>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-3 lg:gap-4">
          <form
            onSubmit={handleSubmit}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-[#DED5C8] bg-white min-w-[220px] max-w-sm w-full"
          >
            <Search className="w-4 h-4 text-[#5D584F]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search still, sparkling, infused..."
              className="flex-1 bg-transparent text-sm text-[#141310] placeholder:text-[#B2A89A] focus:outline-none"
            />
          </form>

          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center justify-center rounded-full border border-[#DED5C8] bg-white px-3 py-2 text-[#141310] hover:bg-[#F0E7DA] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="ml-1 text-xs font-semibold">{itemCount}</span>
            )}
          </button>

          <CartDrawer triggerClassName="hidden" />
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#DED5C8] bg-[#F7F1E8]">
          <div className="px-6 pt-3 pb-4 space-y-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#DED5C8] bg-white w-full"
            >
              <Search className="w-4 h-4 text-[#5D584F]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search collection..."
                className="flex-1 bg-transparent text-sm text-[#141310] placeholder:text-[#B2A89A] focus:outline-none"
              />
            </form>
            <div className="flex flex-col gap-2 text-sm font-medium text-[#5D584F]">
              <NavLink
                to="/"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-2 tracking-[0.2em] uppercase',
                    isActive && 'text-[#141310]'
                  )
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-2 tracking-[0.2em] uppercase',
                    isActive && 'text-[#141310]'
                  )
                }
              >
                Shop
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-2 tracking-[0.2em] uppercase',
                    isActive && 'text-[#141310]'
                  )
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-2 tracking-[0.2em] uppercase',
                    isActive && 'text-[#141310]'
                  )
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;