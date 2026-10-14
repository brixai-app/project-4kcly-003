import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import type { Address, PaymentMethod } from '@/types';

export function Checkout() {
  const { items, totals, placeOrder, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<Address>({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setShipping(prev => ({ ...prev, [field]: e.target.value }));
    };

  const isValid = () => {
    if (!shipping.fullName.trim()) return false;
    if (!shipping.line1.trim()) return false;
    if (!shipping.city.trim()) return false;
    if (!shipping.state.trim()) return false;
    if (!shipping.postalCode.trim()) return false;
    if (!shipping.country.trim()) return false;
    return items.length > 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      toast.error('Please complete shipping details and ensure cart is not empty.');
      return;
    }
    setSaving(true);
    try {
      const payment = {
        method,
        last4: method === 'card' ? '4242' : undefined,
        provider: method !== 'card' ? method.toUpperCase() : 'VISA',
      };
      const order = placeOrder({
        shippingAddress: shipping,
        billingAddress: shipping,
        payment,
        notes: notes.trim() || undefined,
      });
      if (!order) {
        toast.error('Unable to place order. Please try again.');
        setSaving(false);
        return;
      }
      clearCart();
      toast.success('Order placed. A confirmation has been generated.');
      navigate('/order-confirmation');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error('Something went wrong while placing your order.');
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: totals.currency ?? 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-[#F7F1E8] text-[#141310]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <section className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <header className="border-b border-[#DED5C8] pb-4">
              <p className="text-xs tracking-[0.3em] uppercase text-[#5D584F]">
                Secure Checkout
              </p>
              <h1 className="mt-2 text-4xl md:text-5xl font-light tracking-tight">
                Delivery details
              </h1>
              <p className="mt-2 text-sm text-[#5D584F] max-w-xl">
                Nishant Waters bottles are packed in recyclable materials and dispatched
                within 48 hours from our Mumbai atelier.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Full Name
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.fullName}
                    onChange={() => handleChange('fullName')}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Address Line
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.line1}
                    onChange={() => handleChange('line1')}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Address Line 2 (optional)
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.line2 ?? ''}
                    onChange={() => handleChange('line2')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    City
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.city}
                    onChange={() => handleChange('city')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    State / Region
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.state}
                    onChange={() => handleChange('state')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Postal Code
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.postalCode}
                    onChange={() => handleChange('postalCode')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Country
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.country}
                    onChange={() => handleChange('country')}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Phone (for courier updates)
                  </label>
                  <input
                    className="mt-1 w-full rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                    value={shipping.phone ?? ''}
                    onChange={() => handleChange('phone')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                  Order Notes
                </label>
                <textarea
                  className="mt-1 w-full min-h-[96px] rounded-[16px] border border-[#DED5C8] bg-[#FFFFFF]/70 px-4 py-3 text-sm outline-none focus:border-[#0E4A3A]"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ritual timing, gifting note, concierge instructions..."
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5D584F] mb-3">
                  Payment
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['card', 'upi', 'netbanking', 'wallet'] as PaymentMethod[]).map(
                    option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMethod(option)}
                        className={`rounded-[16px] border px-3 py-2 text-xs uppercase tracking-[0.18em] ${
                          method === option
                            ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                            : 'border-[#DED5C8] bg-white text-[#5D584F]'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
                <p className="mt-2 text-[11px] text-[#5D584F]">
                  All payments are processed securely. Card details are never stored.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#DED5C8]">
                <p className="text-xs text-[#5D584F]">
                  By placing your order you agree to our terms and atelier lead times.
                </p>
                <button
                  type="submit"
                  disabled={!isValid() || saving}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-[#0E4A3A] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
                >
                  {saving ? 'Placing Order...' : 'Place Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
          <aside className="col-span-12 lg:col-span-5 space-y-6 lg:pl-6">
            <div className="rounded-[24px] border border-[#DED5C8] bg-white/80 p-6 space-y-4">
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                Order Summary
              </h2>
              <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
                {items.length === 0 && (
                  <p className="text-sm text-[#5D584F]">
                    Your cart is empty. Return to the atelier to curate your bottles.
                  </p>
                )}
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">x{item.quantity}</p>
                      <p className="text-xs text-[#5D584F]">
                        {item.personalizationSummary ?? 'Custom-labeled bottle'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.unitPrice.amount * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#5D584F]">Subtotal</dt>
                  <dd>{formatCurrency(totals.subtotal ?? 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5D584F]">Shipping</dt>
                  <dd>{formatCurrency(totals.shipping ?? 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5D584F]">Tax</dt>
                  <dd>{formatCurrency(totals.tax ?? 0)}</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DED5C8]">
                  <dt className="text-xs font-semibold tracking-[0.2em] uppercase">
                    Total
                  </dt>
                  <dd className="text-base font-semibold">
                    {formatCurrency(totals.total ?? 0)}
                  </dd>
                </div>
              </dl>
              <p className="text-[11px] text-[#5D584F]">
                Complimentary hand-inspected quality control on all Nishant Waters
                consignments.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Checkout;