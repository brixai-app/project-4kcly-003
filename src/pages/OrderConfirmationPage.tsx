import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";
import { MotionFadeIn, MotionSlideUp } from "../components/ui/Motion";
import { Divider } from "../components/ui/Divider";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const OrderConfirmationPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { orders } = useOrderStore();

  const orderIdFromQuery = query.get("orderId");
  const location = useLocation() as any;
  const orderFromState = location.state?.order ?? null;

  const order = useMemo(() => {
    if (orderFromState) return orderFromState;
    if (orderIdFromQuery) {
      return orders.find((o) => o.id === orderIdFromQuery) ?? null;
    }
    return null;
  }, [orderFromState, orderIdFromQuery, orders]);

  const hasOrder = !!order;

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] px-6 py-12 sm:px-10 lg:px-20 lg:py-16">
      <MotionFadeIn>
        <SectionHeading
          eyebrow={hasOrder ? "Order Confirmed" : "No Recent Order"}
          title={
            hasOrder
              ? "Thank you for choosing Nishant Waters"
              : "We couldn\'t find your order"
          }
          align="left"
        />
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#4A4A4A]">
          {hasOrder
            ? "Your bespoke bottles are now in motion. Below is a summary of your order together with an estimate of when to expect your delivery. All data is stored only in this browser as part of our mock experience."
            : "It appears there is no recent order associated with this session. Orders in this MVP are stored only in your current browser and are not persisted across devices."}
        </p>
      </MotionFadeIn>

      {!hasOrder && (
        <div className="mt-8">
          <Button variant="primary" onClick={() => navigate("/shop")}> 
            Return to the collection
          </Button>
        </div>
      )}

      {hasOrder && order && (
        <section className="mt-10 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-start">
          <MotionSlideUp className="space-y-6 bg-[#F3F1EB] border border-[#DDD6C5] rounded-3xl p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                  Order ID
                </p>
                <p className="font-mono text-sm mt-1 bg-white/60 rounded-full px-3 py-1 inline-flex items-center">
                  {order.id}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs tracking-[0.22em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                  Estimated Arrival
                </p>
                <p className="text-sm text-[#2B2B2B]">
                  Between 3–6 business days
                </p>
                <p className="text-xs text-[#7A7368]">
                  Crafted to order, packaged with care.
                </p>
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <h2 className="font-[\"Playfair Display\",_serif] text-lg sm:text-xl">
                Order overview
              </h2>
              <ul className="space-y-4 text-sm">
                {order.cartItems.map((item) => (
                  <li
                    key={`${item.productId}-${item.selectedSize}-${item.selectedBottleColor}-${item.labelDesign.text}`}
                    className="flex flex-col gap-2 border border-[#E2DBCE] rounded-2xl p-4 bg-[#FAF9F6]"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-medium text-[#2B2B2B]">
                          {item.productName ?? "Custom bottle"}
                        </p>
                        <p className="text-xs text-[#7A7368] mt-1">
                          {item.selectedSize} • {item.selectedBottleColor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#2B2B2B]">
                          {item.quantity} x {item.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-[#7A7368]">
                          Subtotal {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-dashed border-[#E2DBCE] mt-2 pt-2">
                      <div className="text-xs text-[#7A7368] space-y-1 max-w-xs">
                        <p className="uppercase tracking-[0.22em] text-[10px] text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                          Label Design
                        </p>
                        <p>
                          "{item.labelDesign.text}" in {item.labelDesign.font} with icon {item.labelDesign.icon}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#7A7368]">
                        <span
                          className="inline-block h-5 w-5 rounded-full border border-[#DDD6C5]"
                          style={{ backgroundColor: item.labelDesign.color }}
                          aria-hidden="true"
                        />
                        <span>Label accent tone</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </MotionSlideUp>

          <MotionFadeIn className="space-y-6">
            <div className="bg-[#F3F1EB] border border-[#DDD6C5] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <h2 className="font-[\"Playfair Display\",_serif] text-lg">
                Delivery & Contact
              </h2>
              <div className="grid gap-4 text-sm text-[#4A4A4A]">
                <div>
                  <p className="font-medium text-[#2B2B2B]">Shipping to</p>
                  <p className="mt-1 whitespace-pre-line">
                    {order.customerInfo.name}
                    {"\n"}
                    {order.customerInfo.address}
                    {"\n"}
                    {order.customerInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#2B2B2B]">Order contact</p>
                  <p className="mt-1">{order.customerInfo.email}</p>
                </div>
                <div>
                  <p className="font-medium text-[#2B2B2B]">Status</p>
                  <p className="mt-1 capitalize">{order.orderStatus}</p>
                  <p className="text-xs mt-1 text-[#7A7368]">
                    This is a simulated status within the Nishant Waters MVP. No
                    real fulfilment or payments occur.
                  </p>
                </div>
              </div>
              <Divider />
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-[#2B2B2B]">Order total</p>
                <p className="font-semibold text-[#004D40]">
                  {order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-[#2B2B2B] text-[#FAF9F6] rounded-3xl p-6 sm:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.35)] space-y-4">
              <p className="text-xs tracking-[0.22em] uppercase text-[#D3C9B8] font-[\"Bodoni Moda\",_serif]">
                What happens next
              </p>
              <p className="font-[\"Playfair Display\",_serif] text-lg leading-snug">
                Your bottles move from concept to crafting.
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1.5 text-[#E8E2D8]">
                <li>Labels are aligned, proofed, and prepared for print.</li>
                <li>Bottles, caps, and finishes are curated for your order.</li>
                <li>Everything is packaged to arrive in impeccable condition.</li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/shop")}
                  className="bg-[#FAF9F6] text-[#004D40] border border-transparent hover:bg-[#F3F1EB]"
                >
                  Continue exploring
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-[#FAF9F6] border border-[#555555] hover:bg-[#3A3A3A]"
                >
                  Return home
                </Button>
              </div>
            </div>
          </MotionFadeIn>
        </section>
      )}
    </main>
  );
};

export default OrderConfirmationPage;