import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Menu } from "lucide-react";

import { Button, Badge, Sheet, SheetContent, SheetTrigger } from "@/components/ui/shadcn";
import { getCartItemCount } from "@/mock";

// NOTE: This header is 100% frontend-only and reads cart count from the mocked
// state in src/mock.ts, which persists to localStorage. There is no backend.

export interface HeaderProps {
  onOpenCart: () => void;
}

interface NavItem {
  label: string;
  path: string;
}

// Fallback NAV_LINKS; in a fuller app this could be imported from a routes module.
const NAV_LINKS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const linkUnderlineVariants = {
  initial: { width: 0, opacity: 0 },
  hover: { width: "100%", opacity: 1 },
};

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const location = useLocation();
  const [cartCount, setCartCount] = React.useState<number>(() => getCartItemCount());

  // Polling the mock state for simplicity; in a larger app we'd subscribe
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setCartCount(getCartItemCount());
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-[#f3e6d9]/95 backdrop-blur border-b border-[#d2bba3] text-[#2b211a] sticky top-0 z-40">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#3f2a23] focus:text-[#fdf7ef] focus:rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b56a3c]"
      >
        Skip to content
      </a>

      <div className="w-full px-6 lg:px-12">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between py-4 gap-4">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b56a3c] rounded-full pr-2 -ml-1"
            aria-label="Nishant Waters home"
          >
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#b56a3c] to-[#e0c3a3] group-hover:scale-y-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl tracking-[0.22em] uppercase font-semibold text-[#3f2a23] leading-tight">
                NISHANT
              </span>
              <span className="text-[0.76rem] tracking-[0.3em] uppercase text-[#7b5b43]">
                WATERS
              </span>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm tracking-[0.18em] uppercase"
            aria-label="Primary"
          >
            {NAV_LINKS.map(link => {
              const active = isActivePath(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    [
                      "relative pb-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-[#b56a3c] rounded-none",
                      "transition-colors duration-200",
                      (active || isActive)
                        ? "text-[#3f2a23]"
                        : "text-[#8b6a52] hover:text-[#3f2a23]",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <span className="inline-flex flex-col items-center">
                      <span>{link.label}</span>
                      <motion.span
                        className="h-[1px] bg-[#b56a3c] mt-1"
                        variants={linkUnderlineVariants}
                        initial="initial"
                        animate={active || isActive ? "hover" : "initial"}
                        whileHover="hover"
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart button desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCart}
              className="hidden sm:inline-flex items-center gap-2 border-[#d2bba3] text-[#3f2a23] bg-[#fdf7ef]/70 hover:bg-[#e9d7c3] hover:border-[#b56a3c] rounded-full px-4 py-1.5 text-xs tracking-[0.18em] uppercase transition-colors duration-200"
              aria-label={cartCount > 0 ? `Open cart with ${cartCount} items` : "Open cart"}
            >
              <span className="relative flex items-center">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 min-w-[1.2rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#b56a3c] text-[0.65rem] font-medium text-[#fdf7ef] border border-[#3f2a23]/20 shadow-sm"
                  >
                    {cartCount}
                  </Badge>
                )}
              </span>
              <span className="hidden md:inline">Cart</span>
            </Button>

            {/* Mobile menu + cart */}
            <div className="flex items-center gap-1 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenCart}
                aria-label={cartCount > 0 ? `Open cart with ${cartCount} items` : "Open cart"}
                className="relative rounded-full text-[#3f2a23] hover:bg-[#e9d7c3]"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1.5 -right-1.5 min-w-[1.2rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-[#b56a3c] text-[0.65rem] font-medium text-[#fdf7ef] border border-[#3f2a23]/20 shadow-sm"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-[#3f2a23] hover:bg-[#e9d7c3]"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[260px] sm:w-[300px] bg-[#f7ebdf] border-r border-[#d2bba3] text-[#2b211a] px-6 pt-10 flex flex-col gap-6"
                  aria-label="Mobile navigation"
                >
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs tracking-[0.28em] uppercase text-[#aa7e57]">Navigate</span>
                    <span className="text-base font-semibold tracking-[0.18em] uppercase text-[#3f2a23]">
                      Nishant Waters
                    </span>
                  </div>

                  <nav className="flex flex-col gap-3" aria-label="Primary mobile">
                    {NAV_LINKS.map(link => {
                      const active = isActivePath(link.path);
                      return (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          className={({ isActive }) =>
                            [
                              "text-sm tracking-[0.18em] uppercase py-1.5 border-b",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b56a3c]",
                              active || isActive
                                ? "border-[#b56a3c] text-[#3f2a23]"
                                : "border-transparent text-[#8b6a52] hover:text-[#3f2a23] hover:border-[#d2bba3]",
                            ].join(" ")
                          }
                        >
                          {link.label}
                        </NavLink>
                      );
                    })}
                  </nav>

                  <div className="mt-auto pt-4 text-xs text-[#8b6a52] tracking-[0.16em] uppercase">
                    Crafted as a mock, client-side only experience.
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;