import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openDrawer } = useCart();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') ?? '';
    setSearchValue(q);
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    }
    const qs = params.toString();
    navigate(`/shop${qs ? `?${qs}` : ''}`);
    setIsMobileOpen(false);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const navLinkBase =
    'relative text-xs tracking-[0.2em] uppercase transition-colors';
  const navLinkInactive = 'text-[#5F5A55] hover:text-[#1F1F1F]';
  const navLinkActive = 'text-[#1F1F1F]';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-[#E7E1D8] bg-[#F9F6F2]/90 backdrop-blur-md',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between py-4 lg:py-5 gap-4">
          <button
            type="button"
            className="flex items-center gap-2 lg:gap-3"
            onClick={() => handleNav('/')}
          >
            <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full border border-[#E7E1D8] bg-white flex items-center justify-center">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-[#0B3D91]">
                NW
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base lg:text-lg font-light tracking-tight text-[#1F1F1F]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Nishant Waters
              </span>
              <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.28em] text-[#5F5A55]">
                Custom Labeled Hydration
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(navLinkBase, isActive ? navLinkActive : navLinkInactive)
              }
            >
              Home
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#0B3D91] transition-all duration-300 group-hover:w-full" />
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(navLinkBase, isActive ? navLinkActive : navLinkInactive)
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(navLinkBase, isActive ? navLinkActive : navLinkInactive)
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(navLinkBase, isActive ? navLinkActive : navLinkInactive)
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 lg:gap-6">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E7E1D8] bg-white/70"
            >
              <Search className="w-4 h-4 text-[#5F5A55]" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search bottles"
                className="bg-transparent text-xs text-[#1F1F1F] placeholder:text-[#B0AAA3] focus:outline-none"
              />
            </form>

            <button
              type="button"
              onClick={openDrawer}
              className="relative flex items-center justify-center rounded-full border border-[#E7E1D8] bg-white px-2.5 py-1.5 hover:border-[#0B3D91] transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-[#1F1F1F]" />
              {itemCount > 0 && (
                <span className="ml-1 rounded-full bg-[#0B3D91] px-1.5 text-[10px] font-semibold text-white leading-none py-0.5">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-full border border-[#E7E1D8] bg-white p-2"
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-[#1F1F1F]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1F1F1F]" />
              )}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden pb-4 border-t border-[#E7E1D8]">
            <form
              onSubmit={handleSearchSubmit}
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-full border border-[#E7E1D8] bg-white"
            >
              <Search className="w-4 h-4 text-[#5F5A55]" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search bottles"
                className="flex-1 bg-transparent text-xs text-[#1F1F1F] placeholder:text-[#B0AAA3] focus:outline-none"
              />
            </form>
            <div className="mt-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="w-full text-left px-2 py-2 text-xs tracking-[0.2em] uppercase text-[#5F5A55] hover:text-[#1F1F1F]"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => handleNav('/shop')}
                className="w-full text-left px-2 py-2 text-xs tracking-[0.2em] uppercase text-[#5F5A55] hover:text-[#1F1F1F]"
              >
                Shop
              </button>
              <button
                type="button"
                onClick={() => handleNav('/about')}
                className="w-full text-left px-2 py-2 text-xs tracking-[0.2em] uppercase text-[#5F5A55] hover:text-[#1F1F1F]"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                className="w-full text-left px-2 py-2 text-xs tracking-[0.2em] uppercase text-[#5F5A55] hover:text-[#1F1F1F]"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;