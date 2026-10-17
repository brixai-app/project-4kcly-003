import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

import { Button, Sheet, SheetContent, SheetTrigger } from "@/components/ui/shadcn";
import { useCartCount } from "@/mock";

interface HeaderProps {
  onOpenCart: () => void;
}

const navLinks: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/catalog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useCartCount();

  const isActivePath = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-[rgba(148,92,46,0.3)] bg-gradient-to-r from-[#1f1410]/90 via-[#2b211a]/90 to-[#1c1310]/90 text-amber-50">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex h-16 lg:h-20 items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 lg:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c29b] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-[radial-gradient(circle_at_30%_0,#f2c29b,#914b1a)] shadow-md shadow-black/30 flex items-center justify-center"
          >
            <span className="h-5 w-5 rounded-full border border-amber-50/60" />
          </motion.div>

          <div className="flex flex-col items-start leading-tight">
            <span className="text-[1.25rem] leading-none tracking-[0.18em] uppercase text-amber-50 font-semibold">
              Nishant
            </span>
            <span className="text-xs tracking-[0.28em] uppercase text-amber-100/80">
              Waters
            </span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-[0.95rem] tracking-[0.18em] uppercase">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "relative inline-flex items-center pb-0.5 transition-colors duration-200",
                  "text-amber-100/80 hover:text-amber-50",
                  (isActive || isActivePath(link.to)) && "text-amber-50",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {({ isActive }) => (
                <motion.span
                  whileHover={{ y: -1 }}
                  className="inline-flex items-center gap-1"
                >
                  <span>{link.label}</span>
                  <motion.span
                    layoutId={isActive ? `nav-underline-${link.to}` : undefined}
                    className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-[#f2c29b] via-[#d28c45] to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{
                      opacity: isActive || isActivePath(link.to) ? 1 : 0,
                      scaleX: isActive || isActivePath(link.to) ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Cart button */}
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              variant="outline"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 rounded-full border-amber-200/30 bg-[#2b211a]/60 hover:bg-[#2b211a] text-amber-50 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium tracking-[0.18em] uppercase"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 inline-flex min-w-[1.4rem] items-center justify-center rounded-full bg-[#f2c29b] text-[0.7rem] font-semibold leading-none text-[#2b211a] px-1.5 py-[3px] shadow-sm shadow-black/30">
                  {cartCount}
                </span>
              )}
            </Button>
          </motion.div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/30 bg-[#2b211a]/60 text-amber-50 hover:bg-[#2b211a]"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[260px] sm:w-[300px] border-l border-amber-900/40 bg-[#1b1410]/95 backdrop-blur-md px-0 py-0 text-amber-50"
              >
                <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-amber-900/40">
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold tracking-[0.24em] uppercase text-amber-50">
                      Nishant Waters
                    </span>
                    <span className="text-[0.65rem] tracking-[0.24em] uppercase text-amber-200/80">
                      Custom bottled details
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-amber-100 hover:bg-amber-900/40"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <nav className="flex flex-col gap-1 px-3 pt-3 pb-4 text-xs tracking-[0.2em] uppercase">
                  {navLinks.map((link) => {
                    const active = isActivePath(link.to);
                    return (
                      <MobileNavItem key={link.to} to={link.to} active={active} />
                    );
                  })}
                </nav>

                <div className="px-6 pb-6 border-t border-amber-900/40 pt-4 text-[0.7rem] leading-relaxed text-amber-100/80">
                  <p className="mb-2 font-medium tracking-[0.2em] uppercase text-amber-200">
                    Quietly present.
                  </p>
                  <p>
                    Custom-labeled water for hotels, studios, and gatherings where every detail is considered.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

interface MobileNavItemProps {
  to: string;
  active: boolean;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, active }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const selected = isActive || active;
        return [
          "relative flex items-center justify-between rounded-full px-4 py-2 transition-colors duration-200",
          selected
            ? "bg-amber-900/40 text-amber-50"
            : "text-amber-100/80 hover:bg-amber-900/25 hover:text-amber-50",
        ]
          .filter(Boolean)
          .join(" ");
      }}
    >
      {({ isActive }) => {
        const selected = isActive || active;
        return (
          <>
            <motion.span
              className="flex-1"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {to === "/" ? "Home" : to.replace("/", "").replace(/^[a-z]/, (c) => c.toUpperCase())}
            </motion.span>
            {selected && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 h-1.5 w-1.5 rounded-full bg-[#f2c29b] shadow-sm shadow-black/40"
              />
            )}
          </>
        );
      }}
    </NavLink>
  );
};

export default Header;