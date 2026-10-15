import React, { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import {
  products,
  computeCartTotals,
  shippingMethods,
  estimateDeliveryDate,
  formatMoney,
  emailRegex,
  saveOrder,
} from "../mock";
import { toast } from "sonner";

export interface CartLineItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  customLabel?: any | null;
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartLineItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onOpenChange,
  items,
  updateQuantity,
  removeItem,
  clearCart,
}) => {
  const [checkoutView, setCheckoutView] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    exp: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const totals = useMemo(() => computeCartTotals(items), [items]);
  const currentShipping = shippingMethods.find((s) => s.id === shippingMethod)!;

  const validateCheckout = () => {
    const e: Record<string, string> = {};
    if (!shippingInfo.name.trim()) e.name = "Name is required.";
    if (!shippingInfo.address.trim()) e.address = "Address is required.";
    if (!shippingInfo.email.trim() || !emailRegex.test(shippingInfo.email)) {
      e.email = "Enter a valid email.";
    }
    (Object.keys(paymentInfo) as (keyof typeof paymentInfo)[]).forEach((k) => {
      if (!paymentInfo[k].trim()) {
        e[k] = "Required";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onPlaceOrder = () => {
    if (!validateCheckout()) {
      toast.error("Please fix checkout details.");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const orderDate = new Date();
      const deliveryEstimate = estimateDeliveryDate(orderDate);
      const stored = saveOrder({
        cartItems: items,
        shippingInfo,
        shippingMethod,
        paymentInfo,
        orderDate: orderDate.toISOString(),
        deliveryEstimate: deliveryEstimate.toISOString(),
      });
      setPlacing(false);
      toast.success("Order placed (mock).", {
        description: `Arrives around ${deliveryEstimate.toLocaleDateString()}.`,
      });
      clearCart();
      setCheckoutView(false);
      onOpenChange(false);
      console.log("Mock order stored", stored);
    }, 900);
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/30 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </AnimatePresence>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <Dialog.Content asChild>
              <motion.aside
                className="fixed inset-y-0 right-0 w-full sm:w-[420px] md:w-[480px] bg-[#FFF8F0] z-50 shadow-2xl border-l border-amber-200 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-amber-200">
                  <div>
                    <Dialog.Title className="font-playfair text-lg text-[#1B3A2D]">
                      {checkoutView ? "Checkout" : "Your cart"}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-slate-600 mt-0.5">
                      {count === 0
                        ? "Your bottles will live here once you add them."
                        : `${count} item${count !== 1 ? "s" : ""} in your cart.`}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 border border-amber-200 shadow-sm hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF8F0]"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </button>
                  </Dialog.Close>
                </div>

                {!checkoutView && (
                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                    {items.length === 0 && (
                      <p className="text-sm text-slate-600">
                        Nothing here yet. Start by customizing a bottle.
                      </p>
                    )}
                    {items.map((item) => {
                      const product = products.find((p) => p.id === item.productId)!;
                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 rounded-2xl bg-white border border-amber-100 shadow-sm p-3"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-playfair text-sm text-[#1B3A2D] truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {item.customLabel?.text || "Standard bottle"}
                            </p>
                            {item.customLabel && (
                              <p className="text-[11px] text-amber-700 mt-0.5">
                                Custom label included
                              </p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-7 w-7 flex items-center justify-center text-slate-700 disabled:text-slate-400"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-medium text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      Math.min(10, item.quantity + 1)
                                    )
                                  }
                                  disabled={item.quantity >= 10}
                                  className="h-7 w-7 flex items-center justify-center text-slate-700 disabled:text-slate-400"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <p className="text-sm font-medium text-[#D9822B]">
                                {formatMoney(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 mt-1 inline-flex items-center justify-center rounded-full text-slate-500 hover:bg-amber-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {checkoutView && (
                  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                    <section className="rounded-2xl bg-white border border-amber-100 shadow-sm p-3 space-y-3">
                      <p className="text-xs font-medium text-slate-700">
                        Shipping details
                      </p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-700">Full name</label>
                          <input
                            value={shippingInfo.name}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                name: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              errors.name
                                ? "border-red-400"
                                : "border-amber-200 focus:border-[#FF6B61]"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-[11px] text-red-500">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-700">Address</label>
                          <textarea
                            value={shippingInfo.address}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                address: e.target.value,
                              })
                            }
                            rows={2}
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              errors.address
                                ? "border-red-400"
                                : "border-amber-200 focus:border-[#FF6B61]"
                            }`}
                          />
                          {errors.address && (
                            <p className="text-[11px] text-red-500">
                              {errors.address}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-700">Email</label>
                          <input
                            value={shippingInfo.email}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                email: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              errors.email
                                ? "border-red-400"
                                : "border-amber-200 focus:border-[#FF6B61]"
                            }`}
                          />
                          {errors.email && (
                            <p className="text-[11px] text-red-500">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl bg-white border border-amber-100 shadow-sm p-3 space-y-3">
                      <p className="text-xs font-medium text-slate-700">
                        Shipping method
                      </p>
                      <div className="space-y-2">
                        {shippingMethods.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setShippingMethod(m.id)}
                            className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-xs shadow-sm ${
                              shippingMethod === m.id
                                ? "border-[#D9822B] bg-[#FFF8F0]"
                                : "border-amber-200 bg-white hover:bg-amber-50"
                            }`}
                          >
                            <span>{m.label}</span>
                            <span className="font-medium text-[#D9822B]">
                              {formatMoney(m.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-2xl bg-white border border-amber-100 shadow-sm p-3 space-y-3">
                      <p className="text-xs font-medium text-slate-700">
                        Payment (mock only, not processed)
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-700">Name on card</label>
                          <input
                            value={paymentInfo.cardName}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                cardName: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              errors.cardName
                                ? "border-red-400"
                                : "border-amber-200 focus:border-[#FF6B61]"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-700">Card number</label>
                          <input
                            value={paymentInfo.cardNumber}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                cardNumber: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                              errors.cardNumber
                                ? "border-red-400"
                                : "border-amber-200 focus:border-[#FF6B61]"
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-700">Expiry</label>
                            <input
                              value={paymentInfo.exp}
                              onChange={(e) =>
                                setPaymentInfo({
                                  ...paymentInfo,
                                  exp: e.target.value,
                                })
                              }
                              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                                errors.exp
                                  ? "border-red-400"
                                  : "border-amber-200 focus:border-[#FF6B61]"
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-slate-700">CVC</label>
                            <input
                              value={paymentInfo.cvc}
                              onChange={(e) =>
                                setPaymentInfo({
                                  ...paymentInfo,
                                  cvc: e.target.value,
                                })
                              }
                              className={`w-full rounded-lg border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] ${
                                errors.cvc
                                  ? "border-red-400"
                                  : "border-amber-200 focus:border-[#FF6B61]"
                              }`}
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Payment is simulated only; no real charges are made.
                        </p>
                      </div>
                    </section>
                  </div>
                )}

                <div className="border-t border-amber-200 px-4 sm:px-6 py-4 bg-[#FFF3E2] space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Subtotal</span>
                    <span>{formatMoney(totals.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Tax</span>
                    <span>{formatMoney(totals.tax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#1B3A2D]">
                    <span>Total (before shipping)</span>
                    <span>{formatMoney(totals.total)}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {checkoutView ? (
                      <button
                        type="button"
                        disabled={placing}
                        onClick={() => setCheckoutView(false)}
                        className="flex-1 inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF3E2]"
                      >
                        Back to cart
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={items.length === 0}
                        onClick={clearCart}
                        className="flex-1 inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-amber-50 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF3E2]"
                      >
                        Clear cart
                      </button>
                    )}

                    {checkoutView ? (
                      <motion.button
                        whileHover={{ scale: !placing ? 1.03 : 1 }}
                        whileTap={{ scale: !placing ? 0.96 : 1 }}
                        type="button"
                        disabled={placing || items.length === 0}
                        onClick={onPlaceOrder}
                        className="flex-1 inline-flex items-center justify-center rounded-full bg-[#1B3A2D] px-3 py-2 text-xs font-medium text-[#FFF8F0] shadow-sm hover:bg-[#15402F] disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF3E2]"
                      >
                        {placing ? "Placing order…" : "Place order"}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: items.length ? 1.03 : 1 }}
                        whileTap={{ scale: items.length ? 0.96 : 1 }}
                        type="button"
                        disabled={items.length === 0}
                        onClick={() => setCheckoutView(true)}
                        className="flex-1 inline-flex items-center justify-center rounded-full bg-[#1B3A2D] px-3 py-2 text-xs font-medium text-[#FFF8F0] shadow-sm hover:bg-[#15402F] disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF6B61] focus-visible:ring-offset-[#FFF3E2]"
                      >
                        Checkout
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.aside>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CartDrawer;