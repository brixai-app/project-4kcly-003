import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { OrderSummaryPanel } from "../components/checkout/OrderSummaryPanel";
import { Button } from "../components/ui/Button";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const createOrder = useOrderStore((s) => s.createOrder);

  useEffect(() => {
    if (items.length === 0) {
      // If cart empty, keep user here but show fallback instead of redirect
    }
  }, [items.length]);

  const handlePlaceOrder = async (values: {
    name: string;
    email: string;
    address: string;
    phone: string;
  }) => {
    const order = createOrder(values);
    clearCart();
    navigate(`/order-confirmation?id=${order.id}`);
  };

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] px-6 sm:px-10 lg:px-16 xl:px-24 py-12">
      <header className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="tracking-[0.22em] text-xs uppercase text-[#A89F91]">
            Final details
          </p>
          <h1 className="font-['Playfair_Display'] text-3xl">Checkout</h1>
        </div>
        <p className="text-xs text-[#6A6A6A] max-w-xs text-right">
          We simulate orders using browser storage only. No payment is processed
          and no information leaves your device.
        </p>
      </header>

      {!hasItems ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-dashed border-[#D5CEC2] rounded-3xl bg-white/50 py-16 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="font-['Playfair_Display'] text-xl mb-2">
            Your cart is empty.
          </p>
          <p className="text-sm text-[#555] max-w-md mb-4">
            Add at least one custom bottle to continue. You can always refine
            label details on the product pages.
          </p>
          <Button
            asChild
            className="bg-[#004D40] text-[#FAF9F6] hover:bg-[#026457] rounded-full px-6 py-3 text-sm"
          >
            <Link to="/shop">Return to shop</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CheckoutForm onSubmit={handlePlaceOrder} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
          >
            <OrderSummaryPanel />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;