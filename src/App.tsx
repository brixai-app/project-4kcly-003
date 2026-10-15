import React, { createContext, useContext, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import LabelDesignerDrawer from "./components/MainFeature";
import CartDrawer, { CartLineItem } from "./components/SecondaryFeature";
import {
  products,
  aboutEditorial,
  contactContent,
  formatMoney,
  emailRegex,
  saveUserMessage,
  palette,
} from "./mock";

// Cart context (client-only, MOCK state, no backend)
interface CartContextValue {
  items: CartLineItem[];
  addItem: (payload: { productId: string; customLabel?: any | null }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartContext missing");
  return ctx;
};

const AppShell: React.FC = () => {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [designerProductId, setDesignerProductId] = useState<string | null>(null);

  const addItem: CartContextValue["addItem"] = ({ productId, customLabel }) => {
    const product = products.find((p) => p.id === productId)!;
    const newItem: CartLineItem = {
      id: `cart_${Math.random().toString(36).slice(2, 9)}`,
      productId,
      quantity: 1,
      price: product.price,
      customLabel: customLabel || null,
    };
    setItems((prev) => [...prev, newItem]);
    setCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const ctxValue = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clearCart }),
    [items]
  );

  const openDesignerForProduct = (id: string) => {
    setDesignerProductId(id);
    setDesignerOpen(true);
  };

  return (
    <CartContext.Provider value={ctxValue}>
      <div className="min-h-screen bg-[#FFF8F0] text-slate-900 font-inter">
        <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RouteTransitions onCustomize={openDesignerForProduct} />
        </main>
        <footer className="border-t border-amber-200 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <p>
              © {new Date().getFullYear()} Nishant Waters. Crafted with mock data only, no live backend.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-[#D9822B]">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#D9822B]">
                Contact
              </Link>
            </div>
          </div>
        </footer>

        <LabelDesignerDrawer
          open={designerOpen}
          onOpenChange={setDesignerOpen}
          productId={designerProductId}
          onAddToCart={addItem}
        />
        <CartDrawer
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={items}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          clearCart={clearCart}
        />
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            },
          }}
        />
      </div>
    </CartContext.Provider>
  );
};

const RouteTransitions: React.FC<{ onCustomize: (id: string) => void }> = ({
  onCustomize,
}) => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage onCustomize={onCustomize} />
            </PageWrapper>
          }
        />
        <Route
          path="/shop"
          element={
            <PageWrapper>
              <ShopPage onCustomize={onCustomize} />
            </PageWrapper>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageWrapper>
              <ProductPage onCustomize={onCustomize} />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <ContactPage />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <HomePage onCustomize={onCustomize} />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="space-y-8"
  >
    {children}
  </motion.div>
);

// HOME PAGE
const HomePage: React.FC<{ onCustomize: (id: string) => void }> = ({
  onCustomize,
}) => {
  const navigate = useNavigate();
  const featured = products.slice(0, 3);
  return (
    <>
      <section className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-center">
        <div className="space-y-4">
          <p className="text-[11px] tracking-[0.18em] uppercase text-amber-700">
            bespoke bottles • soft rituals
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl text-[#1B3A2D] leading-tight">
            Hydrate Your Style.
          </h1>
          <p className="text-sm sm:text-base text-slate-700 max-w-xl">
            Custom-labeled water bottles that move with you—from studio mornings to golden-hour picnics. Design a label that feels like a quiet love note.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center rounded-full bg-[#1B3A2D] px-5 py-2.5 text-sm font-medium text-[#FFF8F0] shadow-sm hover:bg-[#15402F] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
            >
              Shop now
            </motion.button>
            <button
              type="button"
              onClick={() => onCustomize(featured[0].id)}
              className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
            >
              Start with a label
            </button>
          </div>
        </div>
        <div className="relative h-72 sm:h-80 md:h-96">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-[#FFE3C4] to-[#F9CFA9] shadow-xl overflow-hidden">
            <img
              src={featured[0].images[0]}
              alt={featured[0].name}
              className="h-full w-full object-cover mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur rounded-2xl border border-amber-100 shadow-lg px-3 py-2 text-xs max-w-[60%]">
            <p className="font-playfair text-[#1B3A2D]">
              Labels as keepsakes.
            </p>
            <p className="text-slate-700">
              Add dates, vows, mantras, and little reminders to sip slowly.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-playfair text-xl text-[#1B3A2D]">Featured bottles</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((p, idx) => (
            <motion.article
              key={p.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl overflow-hidden shadow-md border border-amber-100 bg-white ${
                idx === 1 ? "md:translate-y-6" : idx === 2 ? "md:-translate-y-4" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => onCustomize(p.id)}
                className="absolute top-3 right-3 z-10 rounded-full bg-white/90 text-[10px] px-2 py-1 border border-amber-200 shadow-sm hover:bg-amber-50"
              >
                Customize
              </button>
              <img
                src={p.images[0]}
                alt={p.name}
                className="h-40 w-full object-cover"
              />
              <div className="px-3 py-3 space-y-1">
                <h3 className="font-playfair text-sm text-[#1B3A2D] truncate">
                  {p.name}
                </h3>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-sm font-medium text-[#D9822B]">
                  {formatMoney(p.price)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
};

// SHOP PAGE
const ShopPage: React.FC<{ onCustomize: (id: string) => void }> = ({
  onCustomize,
}) => {
  const navigate = useNavigate();
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl text-[#1B3A2D]">Shop bottles</h2>
          <p className="text-sm text-slate-700">
            Asymmetric grid of tactile silhouettes. Tap a bottle to learn more.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        {products.map((p, idx) => (
          <motion.button
            key={p.id}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`group relative text-left rounded-[1.75rem] overflow-hidden shadow-md border border-amber-100 bg-white flex flex-col ${
              idx % 3 === 1 ? "row-span-2" : ""
            }`}
            type="button"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <div className="relative flex-1">
              <img
                src={p.images[0]}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-playfair text-sm mb-1 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-[11px] text-amber-100 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>
            <div className="px-3 py-2 flex items-center justify-between text-xs">
              <span className="font-medium text-[#D9822B]">
                {formatMoney(p.price)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize(p.id);
                }}
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[11px] text-slate-800 hover:bg-amber-50"
              >
                Quick label
              </button>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

// PRODUCT PAGE
const ProductPage: React.FC<{ onCustomize: (id: string) => void }> = ({
  onCustomize,
}) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const { addItem } = useCart();

  return (
    <section className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-start">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 rounded-3xl overflow-hidden border border-amber-100 shadow-md">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-64 sm:h-80 w-full object-cover"
            />
          </div>
          <div className="space-y-3">
            {product.images.slice(1).map((src) => (
              <div
                key={src}
                className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm h-28"
              >
                <img
                  src={src}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700">
          {product.baseBottleType}
        </p>
        <h1 className="font-playfair text-2xl sm:text-3xl text-[#1B3A2D]">
          {product.name}
        </h1>
        <p className="text-sm text-slate-700 max-w-xl">{product.description}</p>
        <p className="text-lg font-medium text-[#D9822B]">
          {formatMoney(product.price)}
        </p>
        <div className="space-y-2">
          <p className="text-xs text-slate-700">Sleeve colors</p>
          <div className="flex gap-2">
            {product.availableColors.map((c) => (
              <span
                key={c}
                className="h-6 w-6 rounded-full border border-amber-200 shadow-inner"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={() => addItem({ productId: product.id })}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-900 border border-amber-300 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
          >
            Add without label
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onCustomize(product.id)}
            className="inline-flex items-center justify-center rounded-full bg-[#1B3A2D] px-5 py-2.5 text-sm font-medium text-[#FFF8F0] shadow-sm hover:bg-[#15402F] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
          >
            Customize your label
          </motion.button>
        </div>
      </div>
    </section>
  );
};

// ABOUT PAGE
const AboutPage: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="relative h-64 sm:h-80 rounded-[2.5rem] overflow-hidden shadow-xl border border-amber-100">
        <img
          src={aboutEditorial.heroImage}
          alt="Nishant Waters studio"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white max-w-md">
          <h1 className="font-playfair text-2xl mb-1">The ritual of refill.</h1>
          <p className="text-xs text-amber-100">
            Every bottle is a small altar to the moments you choose yourself.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {aboutEditorial.sections.map((s) => (
          <article
            key={s.title}
            className="rounded-3xl bg-white border border-amber-100 shadow-sm px-4 py-4 flex flex-col gap-2"
          >
            <h2 className="font-playfair text-base text-[#1B3A2D]">
              {s.title}
            </h2>
            <p className="text-sm text-slate-700">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

// CONTACT PAGE
const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.message.trim()) e.message = "Share a note or question.";
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      e.email = "Enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix contact details.");
      return;
    }
    const saved = saveUserMessage(form);
    toast.success("Message sent (mock).", {
      description: "We log it in memory only—no backend yet.",
    });
    console.log("Mock message stored", saved);
    setForm({ name: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <section className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-start">
      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl bg-white border border-amber-100 shadow-sm px-4 py-4">
        <h1 className="font-playfair text-xl text-[#1B3A2D] mb-1">Say hello.</h1>
        <p className="text-sm text-slate-700 mb-2">{contactContent.intro}</p>
        <div className="space-y-1">
          <label className="text-xs text-slate-700">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full rounded-lg border px-2.5 py-1.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
              errors.name ? "border-red-400" : "border-amber-200 focus:border-[#FF6B61]"
            }`}
          />
          {errors.name && (
            <p className="text-[11px] text-red-500">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-700">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full rounded-lg border px-2.5 py-1.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
              errors.email ? "border-red-400" : "border-amber-200 focus:border-[#FF6B61]"
            }`}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-700">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className={`w-full rounded-lg border px-2.5 py-1.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
              errors.message
                ? "border-red-400"
                : "border-amber-200 focus:border-[#FF6B61]"
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-red-500">{errors.message}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="mt-1 inline-flex items-center justify-center rounded-full bg-[#1B3A2D] px-5 py-2 text-sm font-medium text-[#FFF8F0] shadow-sm hover:bg-[#15402F] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
        >
          Send message
        </motion.button>
      </form>
      <div className="rounded-3xl overflow-hidden border border-amber-100 shadow-md h-64 sm:h-80 bg-amber-50">
        <iframe
          title="Nishant Waters map"
          src={contactContent.mapEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;