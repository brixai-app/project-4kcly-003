import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Toaster } from 'sonner';
import { Section, BodyText } from './ui';
import { CartDrawer } from './CartDrawer';
import { calculateCartTotals, CartItem, subscribeToCart } from '@/mock';

export const AppLayout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToCart(setCart);
    return unsubscribe;
  }, []);

  const { totalItems } = calculateCartTotals(cart);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-[#FAF9F6]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm transition-colors hover:bg-white"
          >
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[#0E4D5B] to-[#7A9E7E]" />
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-['Merriweather']">
                Crafted Hydration
              </div>
              <div className="text-sm font-semibold text-slate-900 font-['Poppins']">
                Nishant Waters
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-6 text-sm font-['Merriweather']">
            <Link
              to="/"
              className={
                'relative pb-1 transition-colors ' +
                (isActive('/')
                  ? 'text-[#0E4D5B] after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-5 after:rounded-full after:bg-[#FF6F61]'
                  : 'text-slate-600 hover:text-slate-900')
              }
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={
                'relative pb-1 transition-colors ' +
                (isActive('/shop')
                  ? 'text-[#0E4D5B] after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-5 after:rounded-full after:bg-[#FF6F61]'
                  : 'text-slate-600 hover:text-slate-900')
              }
            >
              Shop
            </Link>
          </nav>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#0E4D5B] text-[#FAF9F6] shadow-md transition-colors hover:bg-[#0b3b45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4D5B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#FF6F61] px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-[#FAF9F6]">
        <Section subtle className="py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 font-['Merriweather']">
                Nishant Waters
              </div>
              <BodyText className="mt-1 max-w-md text-xs sm:text-sm">
                Custom-labeled water bottles for launches, weddings, wellness studios, and every moment that
                deserves to feel considered. Built as a mock, client-only MVP with no real payments.
              </BodyText>
            </div>
            <div className="space-y-2 text-xs sm:text-sm font-['Merriweather'] text-slate-600">
              <div className="flex gap-4">
                <span className="font-semibold text-slate-800">Contact</span>
                <a
                  href="mailto:hello@nishantwaters.com"
                  className="hover:text-[#0E4D5B]"
                >
                  hello@nishantwaters.com
                </a>
              </div>
              <div className="flex gap-3">
                <a href="#" className="hover:text-[#0E4D5B]">
                  Instagram
                </a>
                <a href="#" className="hover:text-[#0E4D5B]">
                  Pinterest
                </a>
                <a href="#" className="hover:text-[#0E4D5B]">
                  Behance
                </a>
              </div>
            </div>
          </div>
        </Section>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};