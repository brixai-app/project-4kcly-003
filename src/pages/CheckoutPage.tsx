import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageTransition } from "../components/layout/PageTransition";
import { Container } from "../components/layout/Container";
import { ShippingForm } from "../components/checkout/ShippingForm";
import { PaymentForm } from "../components/checkout/PaymentForm";
import { OrderSummaryPanel } from "../components/checkout/OrderSummaryPanel";
import { useCartStore } from "../state/cartStore";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { tokens } from "../theme/tokens";

// Simple mock RequireAuth wrapper inside page (no HOC file here)

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useOrderStore((s) => s.createOrder);

  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!user || !user.isLoggedIn) {
    return (
      <PageTransition>
        <Container className="py-20">
          <div className="max-w-md rounded-[12px] bg-[color:var(--nw-panel)] p-8 text-[color:var(--nw-ink)] shadow">
            <h1
              className="font-heading text-2xl"
              style={{ fontFamily: tokens.fonts.heading }}
            >
              Sign in to continue
            </h1>
            <p
              className="mt-3 text-sm text-[color:var(--nw-ink-soft)]"
              style={{ fontFamily: tokens.fonts.body }}
            >
              Checkout is part of the mock experience and requires a mock account so
              we can attribute orders to a user profile.
            </p>
            <button
              type="button"
              onClick={() => navigate("/auth?redirect=/checkout")}
              className="mt-5 inline-flex w-full justify-center rounded-[999px] bg-[color:var(--nw-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--nw-bg)] shadow-sm hover:bg-[color:var(--nw-accent-strong)]"
            >
              Go to login / signup
            </button>
          </div>
        </Container>
      </PageTransition>
    );
  }

  const handleSubmit = () => {
    if (!shipping.name || !shipping.address || !shipping.email) {
      toast.error("Please complete the shipping details.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!payment.cardName || !payment.cardNumber || !payment.expiry || !payment.cvv) {
      toast.error("Please fill in all payment fields.");
      return;
    }

    if (!/^\d{16}$/.test(payment.cardNumber.replace(/\s+/g, ""))) {
      toast.error("Card number should be 16 digits (mock only).");
      return;
    }

    if (!/^\d{3,4}$/.test(payment.cvv)) {
      toast.error("Enter a valid CVV (mock only).");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const order = createOrder({
        userId: user.id,
        items: cartItems,
        totalPrice: total,
        shippingAddress: shipping.address,
        paymentStatus: "paid",
        email: shipping.email,
        name: shipping.name,
      });

      clearCart();
      setSubmitting(false);
      toast.success("Mock order placed successfully.");
      navigate("/checkout/confirmation", { state: { orderId: order.id } });
    }, 900);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[color:var(--nw-bg)] pb-16 pt-8 md:pt-10">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.9fr)]">
          <section className="space-y-6">
            <header>
              <h1
                className="font-heading text-2xl text-[color:var(--nw-ink)] sm:text-3xl"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Checkout
              </h1>
              <p
                className="mt-2 text-sm text-[color:var(--nw-ink-soft)]"
                style={{ fontFamily: tokens.fonts.body }}
              >
                All details here remain in your browser only. This is a fully mocked
                flow built on top of mock cart items and a mock order store.
              </p>
            </header>

            <div className="space-y-5">
              <ShippingForm value={shipping} onChange={setShipping} />
              <PaymentForm value={payment} onChange={setPayment} />
            </div>
          </section>

          <aside className="space-y-4">
            <OrderSummaryPanel
              submitting={submitting}
              onSubmit={handleSubmit}
            />
            <p className="text-[10px] text-[color:var(--nw-ink-soft)]">
              This is a no-risk environment. Card details are validated only on
              pattern and never sent to any server.
            </p>
          </aside>
        </Container>
      </main>
    </PageTransition>
  );
};

export default CheckoutPage;