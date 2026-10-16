import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Section, H1, InputField, MotionButton } from '@/components/ui';
import {
  getCartItems,
  getCartTotal,
  EMAIL_REGEX,
  createOrder,
  clearCart,
  type ShippingInfo,
  type PaymentInfo,
} from '@/mock';

const emptyShipping: ShippingInfo = {
  name: '',
  address: '',
  email: '',
};

const emptyPayment: PaymentInfo = {
  cardHolder: '',
  cardLast4: '',
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [shipping, setShipping] = React.useState<ShippingInfo>(emptyShipping);
  const [payment, setPayment] = React.useState<PaymentInfo>(emptyPayment);
  const [cardNumber, setCardNumber] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const cartItems = getCartItems();
  const total = getCartTotal();

  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop', { replace: true });
    }
  }, [cartItems.length, navigate]);

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const shippingErrors = {
    name: !shipping.name.trim() ? 'Name is required' : undefined,
    address: !shipping.address.trim() ? 'Address is required' : undefined,
    email: !shipping.email.trim()
      ? 'Email is required'
      : !EMAIL_REGEX.test(shipping.email)
      ? 'Enter a valid email address'
      : undefined,
  };

  const cardError =
    cardNumber.replace(/\s+/g, '').length < 12 ? 'Card number is too short' : undefined;

  const hasErrors =
    Object.values(shippingErrors).some(Boolean) || !cardNumber || Boolean(cardError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Object.keys(shipping).forEach(markTouched);
    markTouched('card');
    if (hasErrors) {
      toast.error('Please fix the form errors');
      return;
    }

    setSubmitting(true);
    try {
      const fakeLast4 = cardNumber.replace(/\s+/g, '').slice(-4);
      const order = await createOrder({
        cart: cartItems,
        shippingInfo: shipping,
        paymentInfo: { ...payment, cardLast4: fakeLast4 },
      });
      clearCart();
      toast.success('Order placed', {
        description: 'We are preparing your mock confirmation.',
      });
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong submitting your order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pb-16 pt-6 md:pt-10">
      <Section className="grid gap-10 rounded-[2.5rem] bg-[#FAF9F6] px-4 py-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:px-8 md:py-10">
        <form onSubmit={handleSubmit} className="space-y-8" aria-label="Checkout form">
          <header className="space-y-2">
            <H1 className="text-[#0E4D5B]">Checkout</H1>
            <p className="text-sm font-['Merriweather'] text-slate-700">
              This is a fully mocked checkout — no real payments or network requests. Your data stays in
              this browser session.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold font-['Poppins'] uppercase tracking-[0.2em] text-[#7A9E7E]">
              Shipping details
            </h2>
            <InputField
              label="Full name"
              value={shipping.name}
              onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
              onBlur={() => markTouched('name')}
              error={touched.name ? shippingErrors.name : undefined}
              placeholder="Who should we ship to?"
            />
            <InputField
              label="Address"
              value={shipping.address}
              onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
              onBlur={() => markTouched('address')}
              error={touched.address ? shippingErrors.address : undefined}
              placeholder="Street, city, country"
            />
            <InputField
              label="Email"
              type="email"
              value={shipping.email}
              onChange={e => setShipping(s => ({ ...s, email: e.target.value }))}
              onBlur={() => markTouched('email')}
              error={touched.email ? shippingErrors.email : undefined}
              placeholder="We will send a mock confirmation here"
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold font-['Poppins'] uppercase tracking-[0.2em] text-[#7A9E7E]">
              Payment (mock only)
            </h2>
            <InputField
              label="Cardholder name"
              value={payment.cardHolder}
              onChange={e => setPayment(p => ({ ...p, cardHolder: e.target.value }))}
              placeholder="Name on card"
            />
            <InputField
              label="Card number"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              onBlur={() => markTouched('card')}
              error={touched.card ? cardError : undefined}
              placeholder="0000 0000 0000 0000 (mocked)"
            />
            <p className="text-xs font-['Merriweather'] text-slate-600">
              No real transaction is created. We only keep the last 4 digits in mock state to show on the
              confirmation page.
            </p>
          </section>

          <MotionButton
            type="submit"
            disabled={submitting || cartItems.length === 0}
            className="w-full rounded-full bg-[#FF6F61] py-3 text-sm font-semibold font-['Poppins'] text-[#FAF9F6] shadow-md hover:bg-[#e76356] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Placing your mock order...' : 'Place order'}
          </MotionButton>
        </form>

        <aside className="space-y-4 rounded-3xl bg-[#D9CBB6]/50 p-5 md:p-6">
          <h2 className="text-sm font-semibold font-['Poppins'] uppercase tracking-[0.2em] text-[#7A9E7E]">
            Order summary
          </h2>
          <div className="space-y-4 max-h-[22rem] overflow-y-auto pr-1">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3 rounded-2xl bg-white/60 p-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-[#D9CBB6]/60">
                  <img
                    src={item.productId && '' /* product lookup can be wired here if needed */}
                    alt={item.customLabel.text}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between text-xs font-['Merriweather']">
                  <div>
                    <p className="font-semibold text-[#0E4D5B]">Custom bottle</p>
                    <p className="text-slate-700">Qty {item.quantity}</p>
                    <p className="mt-1 text-[0.7rem] text-slate-600">
                      Label: "{item.customLabel.text}" • {item.customLabel.font}
                    </p>
                  </div>
                  <p className="text-right text-xs text-slate-800">
                    {/* Price display can be enhanced using calculateItemPrice if desired */}
                    x{item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#D9CBB6] pt-4 text-sm font-['Merriweather'] text-slate-800">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
              <span>Shipping</span>
              <span>Included in mock</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-base font-semibold text-[#0E4D5B]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </Section>
    </main>
  );
};

export default CheckoutPage;