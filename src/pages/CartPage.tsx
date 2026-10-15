import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CartSummary } from "../components/cart/CartSummary";
import { Button } from "../components/ui/Button";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] px-6 sm:px-10 lg:px-16 xl:px-24 py-12">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="tracking-[0.22em] text-xs uppercase text-[#A89F91]">
            Your selection
          </p>
          <h1 className="font-['Playfair_Display'] text-3xl">Cart</h1>
        </div>
        {items.length > 0 && (
          <p className="text-xs text-[#6A6A6A]">
            Quantities and label notes are saved in this browser.
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-dashed border-[#D5CEC2] rounded-3xl bg-white/50 py-16 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="font-['Playfair_Display'] text-xl mb-2">
            Your cart is feeling minimalist.
          </p>
          <p className="text-sm text-[#555] max-w-md mb-4">
            Start with a silhouette from the collection, then return to refine
            your label. We&apos;ll keep your details locally as you explore.
          </p>
          <Button
            asChild
            className="bg-[#004D40] text-[#FAF9F6] hover:bg-[#026457] rounded-full px-6 py-3 text-sm"
          >
            <Link to="/shop">Browse the collection</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] gap-10 items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
          <div className="lg:sticky lg:top-24">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;