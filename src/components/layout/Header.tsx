import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import Logo from "./Logo";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems);
  const openCart = useUIStore((s) => s.openCartDrawer);

  const handleCartClick = () => {
    openCart();
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#DDD5C7]/70 bg-[#FAF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="Nishant Waters home" className="flex items-center gap-3">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCartClick}
            className={cn(
              "relative inline-flex items-center justify-center rounded-full border border-[#004D40]/20 bg-white px-3 py-2 text-[#004D40] shadow-sm",
              "transition-colors duration-200 hover:bg-[#004D40] hover:text-[#FAF9F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
            )}
            aria-label={cartCount > 0 ? `View cart with ${cartCount} items` : "View cart"}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="ml-2 text-xs font-medium">{cartCount}</span>
            )}
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#004D40] px-1 text-[10px] font-semibold text-[#FAF9F6]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#A89F91]/40 bg-white p-2 text-[#2B2B2B] transition-colors duration-200 hover:border-[#004D40]/60 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6] md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav
          className="border-t border-[#DDD5C7]/70 bg-[#FAF9F6] px-4 pb-4 pt-2 sm:px-6"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-2 text-sm tracking-wide transition-colors duration-200",
                      "text-[#4A4A4A] hover:bg-[#EDE7DD] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]",
                      isActive && "bg-[#EDE7DD] text-[#004D40] font-medium"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;