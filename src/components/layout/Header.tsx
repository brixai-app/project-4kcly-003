import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import { AccessibleIconButton } from "../ui/AccessibleIconButton";
import { useCartStore } from "@/state/cartStore";
import { useAuthStore } from "@/state/authStore";
import * as Dialog from "@radix-ui/react-dialog";
import { Divider } from "../ui/Divider";
import Price from "../ui/Price";

// Simple cart drawer here to wire header interactions using existing cart store.

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const activeClass =
  "text-[color:var(--nw-terracotta-deep)] after:block after:h-[2px] after:bg-[color:var(--nw-terracotta-deep)] after:rounded-full after:mt-1";

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { items, totalQuantity, totalPrice, removeItem, updateQuantity } =
    useCartStore();
  const { user, logout } = useAuthStore();

  // Close mobile nav on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleAuthClick = () => {
    if (user?.isLoggedIn) {
      logout();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--nw-border-soft)]/70 bg-[color:var(--nw-page-bg)]/90 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[color:var(--nw-ink-strong)] focus:px-3 focus:py-2 focus:text-sm focus:text-[color:var(--nw-cream)]"
      >
        Skip to content
      </a>
      <Container bleedX className="border-none py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="inline-flex items-baseline gap-1.5 rounded-xl px-2 py-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--nw-olive-soft)] focus-visible:ring-offset-[color:var(--nw-page-bg)]"
            >
              <span className="text-xs uppercase tracking-[0.32em] text-[color:var(--nw-olive-soft)]">
                Nishant
              </span>
              <span className="font-[\"Playfair Display\"] text-lg sm:text-xl text-[color:var(--nw-ink-strong)]">
                Waters
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "relative text-[color:var(--nw-ink-soft)] hover:text-[color:var(--nw-ink-strong)] transition-colors",
                      isActive && activeClass,
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user?.isLoggedIn && (
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--nw-olive-soft)]">
                  Signed in
                </span>
                <span className="text-xs text-[color:var(--nw-ink-soft)] max-w-[12rem] truncate">
                  {user.name || user.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAuthClick}
              className={cn(
                "hidden sm:inline-flex items-center rounded-full border border-[color:var(--nw-border-soft)] bg-[color:var(--nw-cream-soft)] px-3.5 py-1.5 text-xs font-medium tracking-[0.18em] uppercase text-[color:var(--nw-ink-strong)]",
                "transition-colors duration-150 ease-out hover:bg-[color:var(--nw-cream)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--nw-page-bg)] focus-visible:ring-[color:var(--nw-olive-soft)]",
              )}
            >
              {user?.isLoggedIn ? "Sign out" : "Login"}
            </button>

            {/* Cart trigger */}
            <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
              <Dialog.Trigger asChild>
                <AccessibleIconButton
                  aria-label="Open cart"
                  variant="subtle"
                  size="md"
                  className="relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-h-[1.15rem] min-w-[1.15rem] rounded-full bg-[color:var(--nw-coral-bright)] px-1 text-[0.65rem] font-semibold text-[color:var(--nw-cream)] flex items-center justify-center shadow-sm">
                      {totalQuantity}
                    </span>
                  )}
                </AccessibleIconButton>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
                <Dialog.Content asChild>
                  <motion.aside
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[color:var(--nw-cream)] shadow-2xl"
                  >
                    <header className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--nw-border-soft)]/80">
                      <div className="flex flex-col">
                        <Dialog.Title className="font-[\"Playfair Display\"] text-lg text-[color:var(--nw-ink-strong)]">
                          Your ritual in a bottle
                        </Dialog.Title>
                        <Dialog.Description className="text-xs text-[color:var(--nw-ink-soft)]">
                          {totalQuantity > 0
                            ? `Review your ${totalQuantity} curated ${
                                totalQuantity === 1 ? "piece" : "pieces"
                              }`
                            : "Your cart is feeling a little thirsty."}
                        </Dialog.Description>
                      </div>
                      <AccessibleIconButton
                        aria-label="Close cart"
                        size="sm"
                        onClick={() => setCartOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </AccessibleIconButton>
                    </header>

                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                      {items.length === 0 ? (
                        <p className="text-sm text-[color:var(--nw-ink-soft)]">
                          No bottles yet. Start with the <Link
                            to="/shop"
                            onClick={() => setCartOpen(false)}
                            className="underline decoration-[color:var(--nw-terracotta-deep)] decoration-1 underline-offset-4 hover:text-[color:var(--nw-terracotta-deep)]"
                          >
                            shop
                          </Link>
                          .
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {items.map((item) => (
                            <li
                              key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${item.id || "noid"}`}
                              className="rounded-2xl bg-[color:var(--nw-cream-soft)] px-3.5 py-3 shadow-sm border border-[color:var(--nw-border-soft)]/60"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-14 w-10 rounded-xl bg-gradient-to-b from-[color:var(--nw-sand-soft)] to-[color:var(--nw-cream)] shadow-inner" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-[color:var(--nw-ink-strong)]">
                                        {item.productName}
                                      </p>
                                      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--nw-olive-soft)] mt-0.5">
                                        {item.selectedSize} 
                                        <span className="mx-1.5">•</span>
                                        Labelled
                                      </p>
                                    </div>
                                    <AccessibleIconButton
                                      aria-label="Remove from cart"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </AccessibleIconButton>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between gap-3">
                                    <div className="inline-flex items-center rounded-full border border-[color:var(--nw-border-soft)] bg-[color:var(--nw-cream)] px-2 py-1 text-[0.65rem] text-[color:var(--nw-ink-soft)]">
                                      Qty
                                      <select
                                        className="ml-1 bg-transparent outline-none focus-visible:outline-none cursor-pointer"
                                        aria-label="Select quantity"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                                        }
                                      >
                                        {Array.from({ length: 10 }).map((_, idx) => (
                                          <option key={idx + 1} value={idx + 1}>
                                            {idx + 1}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <Price amount={item.lineTotal} small />
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <footer className="border-t border-[color:var(--nw-border-soft)]/80 px-5 py-4 space-y-3 bg-[color:var(--nw-cream-soft)]">
                      <Divider />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[color:var(--nw-ink-soft)]">Subtotal</span>
                        <Price amount={totalPrice} />
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                        className={cn(
                          "w-full rounded-full bg-[color:var(--nw-terracotta-deep)] px-4 py-2.5 text-sm font-semibold text-[color:var(--nw-cream)] shadow-md",
                          "transition-[background-color,box-shadow,transform] duration-150 ease-out",
                          "hover:bg-[color:var(--nw-terracotta-deep)]/90 hover:shadow-lg",
                          "active:scale-[0.97]",
                          items.length === 0 &&
                            "cursor-not-allowed opacity-50 hover:shadow-none hover:bg-[color:var(--nw-terracotta-deep)]",
                        )}
                      >
                        {items.length === 0
                          ? "Cart is empty"
                          : "Begin checkout ritual"}
                      </button>
                    </footer>
                  </motion.aside>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Mobile menu */}
            <div className="md:hidden">
              <AccessibleIconButton
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </AccessibleIconButton>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="mt-3 flex flex-col gap-2 md:hidden"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-2 text-sm text-[color:var(--nw-ink-soft)] hover:bg-[color:var(--nw-cream-soft)] hover:text-[color:var(--nw-ink-strong)]",
                      isActive && "bg-[color:var(--nw-cream-soft)] text-[color:var(--nw-terracotta-deep)]",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleAuthClick}
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-[color:var(--nw-ink-strong)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--nw-cream)]"
              >
                {user?.isLoggedIn ? "Sign out" : "Login / Sign up"}
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

export default Header;