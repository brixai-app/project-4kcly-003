import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { PageTransition } from "../components/layout/PageTransition";
import { Container } from "../components/layout/Container";
import { useOrderStore } from "../state/orderStore";
import { tokens } from "../theme/tokens";
import { Price } from "../components/ui/Price";
import { products } from "../mock";

interface LocationState {
  orderId?: string;
}

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const orders = useOrderStore((s) => s.orders);

  const order = React.useMemo(() => {
    if (state.orderId) {
      return orders.find((o) => o.id === state.orderId) ?? orders[0];
    }
    return orders[0];
  }, [orders, state.orderId]);

  if (!order) {
    return (
      <PageTransition>
        <Container className="py-20">
          <div className="max-w-md rounded-[12px] bg-[color:var(--nw-panel)] p-8 text-[color:var(--nw-ink)] shadow">
            <h1
              className="font-heading text-2xl"
              style={{ fontFamily: tokens.fonts.heading }}
            >
              No recent order found.
            </h1>
            <p
              className="mt-3 text-sm text-[color:var(--nw-ink-soft)]"
              style={{ fontFamily: tokens.fonts.body }}
            >
              This confirmation view relies on a mocked order store persisted in your
              browser. It looks like there isn&apos;t an order to show right now.
            </p>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="mt-5 inline-flex w-full justify-center rounded-[999px] bg-[color:var(--nw-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--nw-bg)] hover:bg-[color:var(--nw-accent-strong)]"
            >
              Browse bottles
            </button>
          </div>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-[color:var(--nw-bg)] pb-16 pt-8 md:pt-10">
        <Container className="space-y-8">
          <section className="flex flex-col gap-4 rounded-[12px] bg-[color:var(--nw-panel)] p-6 text-[color:var(--nw-ink)] shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-[color:var(--nw-olive-soft)] p-2">
                <CheckCircle2 className="h-6 w-6 text-[color:var(--nw-olive-strong)]" />
              </div>
              <div>
                <h1
                  className="font-heading text-xl sm:text-2xl"
                  style={{ fontFamily: tokens.fonts.heading }}
                >
                  Order confirmed (mock)
                </h1>
                <p
                  className="mt-2 text-sm text-[color:var(--nw-ink-soft)]"
                  style={{ fontFamily: tokens.fonts.body }}
                >
                  Thank you for exploring Nishant Waters. This order exists only inside
                  your local mock store—no payment has been processed.
                </p>
                <p className="mt-2 text-xs text-[color:var(--nw-ink-soft)]">
                  Order ID: <span className="font-mono text-[color:var(--nw-ink)]">{order.id}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center gap-2 rounded-[999px] bg-[color:var(--nw-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--nw-bg)] hover:bg-[color:var(--nw-accent-strong)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue browsing
            </button>
          </section>

          <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr),minmax(0,0.9fr)]">
            <div className="space-y-4 rounded-[12px] bg-[color:var(--nw-panel)] p-5 shadow-sm">
              <h2
                className="font-heading text-sm text-[color:var(--nw-ink)]"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Items
              </h2>
              <ul className="divide-y divide-[color:var(--nw-border-soft)]">
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <li
                      key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex gap-3 py-3 text-sm"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px] bg-[color:var(--nw-bg)]">
                        {product && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-[color:var(--nw-ink)]">
                            {product ? product.name : "Bottle"}
                          </p>
                          <p className="mt-1 text-[11px] text-[color:var(--nw-ink-soft)]">
                            {item.selectedSize} • <span style={{ color: item.selectedColor }}>label tone</span>
                          </p>
                          {item.customLabelDesign && (
                            <p className="mt-1 text-[10px] text-[color:var(--nw-ink-soft)]">
                              Custom label with {item.customLabelDesign.elements.length} element
                              {item.customLabelDesign.elements.length === 1 ? "" : "s"}.
                            </p>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--nw-ink-soft)]">
                          <span>Qty {item.quantity}</span>
                          <Price value={item.unitPrice * item.quantity} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-4 rounded-[12px] bg-[color:var(--nw-panel)] p-5 shadow-sm">
              <h2
                className="font-heading text-sm text-[color:var(--nw-ink)]"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Order details
              </h2>
              <div className="space-y-2 text-sm text-[color:var(--nw-ink-soft)]">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-medium text-[color:var(--nw-olive-strong)]">
                    {order.paymentStatus === "paid" ? "Paid (mock)" : order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <Price value={order.totalPrice} className="font-semibold" />
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-[color:var(--nw-ink-soft)]">
                <p className="text-[color:var(--nw-ink)]">Shipping to</p>
                <p>{order.name}</p>
                <p>{order.shippingAddress}</p>
                <p className="text-xs">{order.email}</p>
              </div>

              <p className="mt-4 text-[10px] text-[color:var(--nw-ink-soft)]">
                This confirmation leverages a mocked order store persisted in
                localStorage. When a real backend is introduced, this page can be wired
                to live order data without altering the visual composition.
              </p>
            </div>
          </section>
        </Container>
      </main>
    </PageTransition>
  );
};

export default OrderConfirmationPage;