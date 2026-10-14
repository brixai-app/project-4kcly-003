import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Truck, MapPin, CreditCard, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Product, OrderLineItem } from '@/types';

export function OrderConfirmation() {
  const navigate = useNavigate();
  const { lastOrder } = useCart();
  const [toastFired, setToastFired] = useState(false);

  useEffect(() => {
    if (!lastOrder) return;
    if (toastFired) return;
    toast.success('Order placed successfully!', {
      description: `Order #${lastOrder.number} is now ${lastOrder.status}.`,
    });
    setToastFired(true);
  }, [lastOrder, toastFired]);

  useEffect(() => {
    if (!lastOrder) {
      const t = setTimeout(() => navigate('/shop', { replace: true }), 1200);
      return () => clearTimeout(t);
    }
  }, [lastOrder, navigate]);

  const productMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach(p => {
      map[p.id] = p;
    });
    return map;
  }, []);

  const totals = lastOrder?.totals;
  const currency = totals?.currency ?? 'INR';
  const formatPrice = (amount?: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);

  const renderLine = (item: OrderLineItem) => {
    const product = productMap[item.productId];
    const variant = product?.variants.find(v => v.id === item.variantId);
    const image = product?.heroImage;
    return (
      <div
        key={item.id}
        className="grid grid-cols-12 gap-4 py-4 border-b border-[#DED5C8]/70 last:border-none"
      >
        <div className="col-span-3 sm:col-span-2">
          {image ? (
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#F7F1E8]">
              <img
                src={image.url}
                alt={image.alt ?? product?.name ?? 'Bottle'}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] rounded-xl bg-[#F7F1E8]" />
          )}
        </div>
        <div className="col-span-9 sm:col-span-7 flex flex-col justify-between">
          <div>
            <p className="font-serif text-lg text-[#141310]">{product?.name ?? 'Custom bottle'}</p>
            <p className="mt-1 text-sm text-[#5D584F]">
              {product?.shortDescription ?? product?.description ?? 'Custom labeled water.'}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#5D584F]">
              {product?.meta?.collection ?? product?.category ?? 'Edition'}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#5D584F]">
            {variant?.volumeMl && (
              <span className="rounded-md border border-[#DED5C8] px-2 py-1">
                {variant.volumeMl} ml
              </span>
            )}
            {variant?.finish && (
              <span className="rounded-md border border-[#DED5C8] px-2 py-1 capitalize">
                {variant.finish} finish
              </span>
            )}
            <span className="rounded-md border border-[#DED5C8] px-2 py-1">
              Qty {item.quantity}
            </span>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 sm:text-right flex sm:block justify-between items-end">
          <div className="text-sm text-[#5D584F]">
            <p>Unit</p>
            <p className="font-medium text-[#141310]">
              {formatPrice(item.unitPrice.amount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#5D584F]">Line total</p>
            <p className="font-semibold text-[#141310]">
              {formatPrice(item.unitPrice.amount * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!lastOrder) {
    return (
      <main className="min-h-screen bg-[#F7F1E8] flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[#5D584F]">
              Nishant Waters
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-[#141310]">
              No active order found.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#5D584F] max-w-md">
              Your session has refreshed, but the atelier is ready whenever you are.
              Return to the shop to begin a new composition.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#141310] bg-[#141310] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#0E4A3A] hover:border-[#0E4A3A] transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to shop
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="h-full rounded-3xl overflow-hidden border border-[#DED5C8] bg-white">
              <img
                src="https://images.unsplash.com/photo-1640621774431-3b28204a5510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bHV4dXJ5JTIwYm90dGxlZCUyMHdhdGVyJTIwYnJhbmRpbmclMjBtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMDA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                alt="Editorial bottle still life"
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const shipping = lastOrder.shippingAddress;
  const payment = lastOrder.payment;

  return (
    <main className="min-h-screen bg-[#F7F1E8]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-[#0E4A3A] text-white p-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#5D584F]">
                  Order #{lastOrder.number}
                </p>
                <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[#141310] leading-tight">
                  Your table is set.
                </h1>
                <p className="mt-4 text-sm sm:text-base text-[#5D584F] max-w-xl">
                  We&apos;re hand-preparing your custom-labeled bottles. A confirmation has been
                  sent to your email, and tracking will follow once your order ships.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#DED5C8] bg-white/70 backdrop-blur-sm px-5 py-4 flex flex-wrap gap-6 text-xs sm:text-sm text-[#5D584F]">
              <div>
                <p className="uppercase tracking-[0.18em] text-[0.68rem]">Placed on</p>
                <p className="mt-1 text-[#141310]">
                  {new Date(lastOrder.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.18em] text-[0.68rem]">Status</p>
                <p className="mt-1 capitalize text-[#141310]">{lastOrder.status}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.18em] text-[0.68rem]">Total</p>
                <p className="mt-1 text-[#141310]">{formatPrice(totals?.total)}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#DED5C8] bg-white px-5 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-[#141310]">Bottles in this composition</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                  {lastOrder.items.length} line item
                  {lastOrder.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="mt-4 divide-y divide-[#DED5C8]/70">
                {lastOrder.items.map(renderLine)}
              </div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#5D584F]">
                <div>
                  <p className="uppercase tracking-[0.18em] text-[0.68rem]">Subtotal</p>
                  <p className="mt-1 text-[#141310]">{formatPrice(totals?.subtotal)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em] text-[0.68rem]">Shipping</p>
                  <p className="mt-1 text-[#141310]">{formatPrice(totals?.shipping)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em] text-[0.68rem]">Tax</p>
                  <p className="mt-1 text-[#141310]">{formatPrice(totals?.tax)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em] text-[0.68rem]">Total</p>
                  <p className="mt-1 font-semibold text-[#141310]">
                    {formatPrice(totals?.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#DED5C8] bg-white px-5 sm:px-6 py-5 sm:py-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#F7F1E8] p-2">
                  <Truck className="w-5 h-5 text-[#0E4A3A]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#141310]">Shipping to</h2>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                    {shipping.country}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex items-start gap-3 text-sm text-[#5D584F]">
                <MapPin className="mt-1 w-4 h-4" />
                <div>
                  <p className="font-medium text-[#141310]">{shipping.fullName}</p>
                  <p>{shipping.line1}</p>
                  {shipping.line2 && <p>{shipping.line2}</p>}
                  <p>
                    {shipping.city}, {shipping.state} {shipping.postalCode}
                  </p>
                  {shipping.phone && <p className="mt-1 text-xs">+{shipping.phone}</p>}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[#DED5C8] bg-white px-5 sm:px-6 py-5 sm:py-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#F7F1E8] p-2">
                  <CreditCard className="w-5 h-5 text-[#0E4A3A]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#141310]">Payment</h2>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                    {payment.method}
                  </p>
                </div>
              </div>
              <div className="text-sm text-[#5D584F]">
                <p>
                  {payment.provider && (
                    <span className="font-medium text-[#141310] mr-1">
                      {payment.provider}
                    </span>
                  )}
                  {payment.last4 && <span>•••• {payment.last4}</span>}
                </p>
                <p className="mt-2 text-xs">
                  A detailed tax invoice and receipt have been emailed to you.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#DED5C8] bg-white/80 px-5 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                  Continue the ritual
                </p>
                <p className="mt-2 font-serif text-lg text-[#141310]">
                  Design another label or explore the latest drop.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border border-[#141310]',
                    'bg-[#141310] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white',
                    'hover:bg-[#0E4A3A] hover:border-[#0E4A3A] transition-colors'
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                  Shop collection
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default OrderConfirmation;