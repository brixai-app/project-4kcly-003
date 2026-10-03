import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingBag, ChevronDown, Search } from 'lucide-react';
import { categories } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  className?: string;
}

function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { totals, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [drawerKey, setDrawerKey] = React.useState<number>(0);

  const itemCount = totals?.itemCount ?? 0;

  const isActivePath = (path: string) => location?.pathname === path;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = search?.trim() ?? '';
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
    setMobileOpen(false);
  };

  const handleCartClick = () => {
    setDrawerKey((k) => k + 1);
    openCart();
  };

  const navLinkBase =
    'text-sm font-medium tracking-wide uppercase transition-colors';
  const navLinkActive = 'text-emerald-300';
  const navLinkInactive = 'text-[#a7d7c4] hover:text-emerald-200';

  const categoryItems = categories ?? [];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b border-[#244337] bg-[#0b1411]/80 backdrop-blur-xl',
          className,
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#244337] text-[#ecfdf5] hover:bg-[#14241e] sm:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 text-black shadow-lg shadow-emerald-500/30">
                <span className="text-xl font-semibold leading-none">N</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg font-semibold tracking-tight text-[#ecfdf5]">
                  Nishant Waters
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#a7d7c4]">
                  Custom Bottled Atelier
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 sm:flex">
            <Link
              to="/"
              className={cn(
                navLinkBase,
                isActivePath('/') ? navLinkActive : navLinkInactive,
              )}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={cn(
                navLinkBase,
                isActivePath('/shop') ? navLinkActive : navLinkInactive,
              )}
            >
              Shop
            </Link>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    navLinkBase,
                    'inline-flex items-center gap-1',
                    navLinkInactive,
                  )}
                >
                  Collections
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                sideOffset={8}
                className="min-w-[180px] rounded-xl border border-[#244337] bg-[#14241e] p-1 shadow-xl"
              >
                {categoryItems.map((cat) => (
                  <DropdownMenu.Item
                    key={cat}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-[#ecfdf5] outline-none hover:bg-[#0b1411]"
                    onSelect={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                  >
                    {cat}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden max-w-xs flex-1 items-center rounded-full border border-[#244337] bg-[#0b1411] px-3 py-1.5 text-sm text-[#ecfdf5] sm:flex"
            >
              <Search className="mr-2 h-4 w-4 text-[#a7d7c4]" />
              <input
                aria-label="Search bottles"
                className="h-6 flex-1 bg-transparent text-xs outline-none placeholder:text-[#4b6b5a]"
                placeholder="Search bottles, flavors, or glass..."
                value={search}
                onChange={(e) => setSearch(e.target.value ?? '')}
              />
            </form>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-[#244337] bg-[#14241e] text-[#ecfdf5] transition hover:border-emerald-500 hover:text-emerald-300"
              onClick={handleCartClick}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.2rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-black">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#244337] bg-[#0b1411] px-4 pb-4 pt-2 sm:hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="mb-3 flex items-center rounded-full border border-[#244337] bg-[#0b1411] px-3 py-1.5 text-sm text-[#ecfdf5]"
            >
              <Search className="mr-2 h-4 w-4 text-[#a7d7c4]" />
              <input
                aria-label="Search bottles"
                className="h-6 flex-1 bg-transparent text-xs outline-none placeholder:text-[#4b6b5a]"
                placeholder="Search bottles, flavors, or glass..."
                value={search}
                onChange={(e) => setSearch(e.target.value ?? '')}
              />
            </form>
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-2 py-2 text-sm font-medium uppercase tracking-[0.18em]',
                  isActivePath('/') ? 'bg-[#14241e] text-emerald-300' : 'text-[#ecfdf5]',
                )}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-2 py-2 text-sm font-medium uppercase tracking-[0.18em]',
                  isActivePath('/shop')
                    ? 'bg-[#14241e] text-emerald-300'
                    : 'text-[#ecfdf5]',
                )}
              >
                Shop All
              </Link>
              <div className="mt-1 border-t border-[#244337] pt-2">
                <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#4b6b5a]">
                  Collections
                </p>
                {categoryItems.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      navigate(`/shop?category=${encodeURIComponent(cat)}`);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[#a7d7c4] hover:bg-[#14241e]"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <CartDrawer key={drawerKey} />
    </>
  );
}

export { Header };
export default Header;