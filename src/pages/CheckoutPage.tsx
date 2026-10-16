import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  cartItems as getCartItems,
  cartTotal,
  clearCart,
  createOrder,
  CartItem,
} from '@/mock';

interface CheckoutPageProps {
  cart: CartItem[];
  onClearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onClearCart }) => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customer.name || customer.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters.';
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!customer.address || customer.address.trim().length === 0) {
      e.address = 'Address is required.';
    }
    if (customer.phone && !/^\d+$/.test(customer.phone)) {
      e.phone = 'Phone must contain digits only.';
    }
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 12) {
      e.cardNumber = 'Enter a valid card number.';
    }
    if (!payment.expiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(payment.expiry)) {
      e.expiry = 'Use MM/YY format.';
    }
    if (!payment.cvv || payment.cvv.length < 3) {
      e.cvv = 'CVV must be at least 3 digits.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        customerInfo: customer,
      });
      clearCart();
      onClearCart();
      setCompletedOrderId(order.id);
      setSubmitting(false);
      toast.success('Order placed successfully!', {
        description: 'A confirmation has been mocked for this demo checkout.',
      });
    }, 900);
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    setPayment((prev) => ({ ...prev, cardNumber: groups.join(' ') }));
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    setPayment((prev) => ({ ...prev, expiry: formatted }));
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 4);
    setPayment((prev) => ({ ...prev, cvv: digits }));
  };

  const subtotal = cartTotal();
  const items = getCartItems();

  return (
    <div className="min-h-screen bg-[#FFF5E1]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700/70 font-['Inter']">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#333333] font-['Playfair_Display']">
              Finalise your pour
            </h1>
          </div>
          <p className="max-w-md text-sm text-neutral-700 font-['Inter']">
            This checkout is fully mocked for the Nishant Waters preview. No cards are charged, but every detail behaves as in a real experience.
          </p>
        </div>

        {completedOrderId ? (
          <div className="mt-6 max-w-xl rounded-2xl border border-amber-200 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#333333] font-['Playfair_Display']">Thank you.</h2>
            <p className="mt-2 text-sm text-neutral-700 font-['Inter']">
              Your order <span className="font-mono text-xs">#{completedOrderId.slice(0, 8)}</span> has been placed in this demo environment.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 rounded-full bg-[#A0522D] px-5 py-2 text-xs font-medium text-[#FFF5E1] shadow-md focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#FFF5E1]"
            >
              Return home
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start"
          >
            {/* Left column */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-[#333333] font-['Inter']">Contact & delivery</h2>
                <div className="mt-4 grid gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                      Name
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                      Address
                    </label>
                    <textarea
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-[#333333] font-['Inter']">Mock payment</h2>
                <p className="mt-1 text-xs text-neutral-600 font-['Inter']">
                  This is a front-end only simulation. Use any details – no real payment is processed.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                      Card number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={payment.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                      placeholder="4242 4242 4242 4242"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                        Expiry
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={payment.expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                        placeholder="MM/YY"
                      />
                      {errors.expiry && (
                        <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 font-['Inter']">
                        CVV
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        value={payment.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-[#333333] shadow-sm focus:border-[#CBA135] focus:outline-none focus:ring-2 focus:ring-[#CBA135]"
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-xs text-red-600 font-['Inter']">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column - order summary */}
            <aside className="space-y-4">
              <section className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-[#333333] font-['Inter']">Order summary</h2>
                <div className="mt-4 space-y-3">
                  {items.length === 0 ? (
                    <p className="text-xs text-neutral-600 font-['Inter']">Your cart is currently empty.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-3 border-b border-amber-100 pb-3 last:border-b-0">
                        <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          <img
                            src={(item as any).thumbnail ?? item.productId}
                            alt={(item as any).name ?? item.productId}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-xs font-['Inter']">
                          <p className="font-medium text-[#333333]">{(item as any).name ?? 'Custom Bottle'}</p>
                          <p className="mt-0.5 text-neutral-600">
                            {item.selectedSize} • {item.selectedBottleColor}
                          </p>
                          {item.customLabel && (
                            <p className="mt-0.5 text-[11px] text-neutral-500">
                              Label: “{item.customLabel.customText}”
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs font-medium text-[#333333] font-['Inter']">
                          <p>${item.price.toFixed(2)}</p>
                          <p className="mt-0.5 text-[11px] text-neutral-500">× {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 border-t border-amber-100 pt-3 text-sm font-['Inter']">
                  <div className="flex items-center justify-between text-neutral-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#333333]">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={submitting || items.length === 0}
                className="flex w-full items-center justify-center rounded-full bg-[#A0522D] px-6 py-3 text-sm font-medium text-[#FFF5E1] shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#FFF5E1]"
              >
                {submitting ? 'Placing order…' : 'Place order'}
              </motion.button>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;