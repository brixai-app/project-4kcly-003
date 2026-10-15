import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Droplet, Menu } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { palette } from "../mock";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/90 backdrop-blur border-b border-amber-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 rounded-full bg-[#1B3A2D] text-[#FFF8F0] items-center justify-center shadow-md">
            <Droplet className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="font-playfair text-lg tracking-wide text-[#1B3A2D]">Nishant Waters</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-800">
              Hydrate Your Style
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative pb-1 transition-colors ${
                  isActive
                    ? "text-[#1B3A2D]"
                    : "text-slate-700 hover:text-[#D9822B]"
                }`
              }
            >
              {({ isActive }) => (
                <span className="inline-flex flex-col items-start">
                  <span>{item.label}</span>
                  <span
                    className={`mt-0.5 h-[2px] rounded-full transition-[width,background-color] duration-200 ${
                      isActive ? "w-5 bg-[#FF6B61]" : "w-0 bg-transparent group-hover:w-5"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex items-center justify-center rounded-full bg-[#1B3A2D] text-[#FFF8F0] h-9 w-9 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[1.15rem] h-5 rounded-full bg-[#FF6B61] text-[10px] font-semibold flex items-center justify-center text-white px-1 shadow">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </motion.button>

          <div className="md:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 h-9 w-9 text-slate-800 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open navigation</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                sideOffset={8}
                className="z-50 rounded-xl border border-amber-200 bg-[#FFF8F0] px-2 py-2 shadow-xl w-40"
              >
                {navItems.map((item) => (
                  <DropdownMenu.Item asChild key={item.to}>
                    <Link
                      to={item.to}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-800 hover:bg-amber-100 focus:bg-amber-100 focus:outline-none"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;