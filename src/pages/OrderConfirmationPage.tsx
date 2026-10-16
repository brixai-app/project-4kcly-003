import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { MotionButton, Card, H1, H2, Section, Badge } from '@/components/ui';
import {
  getOrderById,
  formatCurrency,
  type Order,
  type CartItem,
} from '@/mock';

const OrderItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#FAF9F6] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-start gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#D9CBB6] to-[#FAF9F6] shadow-inner">
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="h-16 w-8 rounded-full border-2 border-[#0E4D5B]/20 bg-white shadow-md"
              aria-hidden
            >
              <div className="mt-2 h-8 w-full rounded-full border-b border-[#0E4D5B]/10 bg-[#FAF9F6]" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[#0E4D5B]">{item.productName}</p>
          <p className="text-sm text-[#4B5563]">Qty: {item.quantity}</p>
          {item.customLabel && (
            <div className="mt-1 inline-flex flex-wrap items-center gap-2 text-xs text-[#374151]">
              <span className="rounded-full bg-white/80 px-2 py-0.5 shadow-sm">
                Label: {item.customLabel.text || 'Custom' }
              </span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 shadow-sm">
                Font: {item.customLabel.font}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 shadow-sm">
                <span className="h-3 w-3 rounded-full border border-[#E5E7EB]" style={{ backgroundColor: item.customLabel.backgroundColor }} />
                <span>Background</span>
              </span>
              {item.customLabel.logoImage && (
                <span className="rounded-full bg-white/80 px-2 py-0.5 shadow-sm">
                  Logo added
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-col items-end gap-1 sm:mt-0">
        <p className="text-sm text-[#6B7280]">Each</p>
        <p className="font-semibold text-[#0E4D5B]">{formatCurrency(item.unitPrice)}</p>
        <p className="text-xs text-[#6B7280]">
          Subtotal: {formatCurrency(item.unitPrice * item.quantity)}
        </p>
      </div>
    </div>
  );
};

const ShippingSummary: React.FC<{ order: Order }> = ({ order }) => {
  const { shippingInfo } = order;
  return (
    <Card className="space-y-4 bg-white/90">
      <div className="flex items-center justify-between">
        <H2>Shipping</H2>
        <Badge className="bg-[#7A9E7E]/10 text-[#0E4D5B] ring-1 ring-[#7A9E7E]/30">
          {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
        </Badge>
      </div>
      <div className="space-y-2 text-sm text-[#374151]">
        <p className="font-semibold text-[#0E4D5B]">{shippingInfo.name}</p>
        <p className="whitespace-pre-line">{shippingInfo.address}</p>
        <p className="text-[#6B7280]">{shippingInfo.email}</p>
      </div>
    </Card>
  );
};

const OrderTotals: React.FC<{ order: Order }> = ({ order }) => {
  const itemsTotal = order.cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const shipping = 0;

  return (
    <Card className="space-y-4 bg-[#FAF9F6]">
      <H2>Order Summary</H2>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[#374151]">
          <span>Items</span>
          <span>{formatCurrency(itemsTotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[#374151]">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#D1D5DB] pt-3 text-base font-semibold text-[#0E4D5B]">
          <span>Total</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>
    </Card>
  );
};

const ThankYouMessage: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Card className="space-y-4 bg-white/95">
      <div className="space-y-2">
        <H1>Thank you for hydrating in style.</H1>
        <p className="text-sm text-[#4B5563]">
          Your order <span className="font-semibold text-[#0E4D5B]">#{order.id.slice(0, 8)}</span> is
          {order.status === 'confirmed' ? ' confirmed' : ' being prepared'}. You will
          receive a confirmation email with your design details and next steps.
        </p>
      </div>
      <div className="grid gap-3 text-xs text-[#6B7280] sm:grid-cols-2">
        <p>
          We print your custom labels on premium, water-resistant stock and hand-apply
          them to every bottle. Most orders ship within 3–5 business days.
        </p>
        <p>
          Need adjustments? Reply directly to your confirmation email and our team will
          help fine-tune your design before it goes to print.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        <MotionButton asChild variant="primary">
          <Link to="/shop">Continue shopping</Link>
        </MotionButton>
        <MotionButton asChild variant="ghost">
          <Link to="/">Back to home</Link>
        </MotionButton>
      </div>
    </Card>
  );
};

const MissingOrder: React.FC = () => {
  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center">
      <Card className="max-w-lg space-y-4 bg-white/95 text-center">
        <H1>We couldn't find that order.</H1>
        <p className="text-sm text-[#4B5563]">
          The order link may have expired or never existed. Because this is a demo with
          mock data only, orders are stored only in your current browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <MotionButton asChild variant="primary">
            <Link to="/shop">Browse bottles</Link>
          </MotionButton>
          <MotionButton asChild variant="ghost">
            <Link to="/">Return home</Link>
          </MotionButton>
        </div>
      </Card>
    </Section>
  );
};

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = id ? getOrderById(id) : undefined;

  if (!id || !order) {
    return <MissingOrder />;
  }

  return (
    <Section className="bg-[#FAF9F6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:pt-14">
        <div className="w-full space-y-6 lg:w-2/3">
          <ThankYouMessage order={order} />
          <Card className="space-y-4 bg-white/95">
            <div className="flex items-center justify-between">
              <H2>Order Details</H2>
              <span className="text-xs uppercase tracking-wide text-[#6B7280]">
                Placed just now
              </span>
            </div>
            <div className="space-y-3">
              {order.cartItems.map(item => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>
          </Card>
        </div>
        <div className="w-full space-y-4 lg:w-1/3">
          <ShippingSummary order={order} />
          <OrderTotals order={order} />
        </div>
      </div>
    </Section>
  );
};

export default OrderConfirmationPage;