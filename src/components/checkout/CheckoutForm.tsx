import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface FormState {
  name: string;
  email: string;
  address: string;
  phone: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  address: "",
  phone: "",
  notes: "",
};

export const CheckoutForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    address: false,
    phone: false,
    notes: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const errors = {
    name: !form.name.trim() ? "Name is required" : "",
    email: !form.email.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Enter a valid email"
      : "",
    address: !form.address.trim() ? "Address is required" : "",
    phone: !form.phone.trim()
      ? "Phone is required"
      : !/^\d{7,}$/.test(form.phone.replace(/\D/g, ""))
      ? "Enter at least 7 digits"
      : "",
    notes: "",
  } as const;

  const isValid =
    items.length > 0 &&
    !errors.name &&
    !errors.email &&
    !errors.address &&
    !errors.phone;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, address: true, phone: true, notes: true });
    if (!isValid) {
      toast.error("Please complete all required details correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate client-side order placement using mock data only
      const order = createOrder({
        cartItems: items,
        totalPrice: subtotal,
        customerInfo: {
          name: form.name.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          phone: form.phone.trim(),
        },
      });

      // Persist to localStorage as part of mock-only flow
      const existing = window.localStorage.getItem("nishantwaters_orders");
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(order);
      window.localStorage.setItem("nishantwaters_orders", JSON.stringify(parsed));

      clearCart();
      toast.success("Your order has been placed.");
      navigate(`/order-confirmation?id=${encodeURIComponent(order.id)}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-playfair text-2xl text-[#2B2B2B] mb-2">
          Your cart is empty.
        </h1>
        <p className="text-sm text-[#5C5548] mb-6">
          Return to the collection to design your bespoke Nishant Waters bottles
          before completing checkout.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/shop")}
        >
          Browse the collection
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-start">
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur rounded-2xl border border-[#E0D9CC] p-6 shadow-sm space-y-6"
        noValidate
      >
        <header className="space-y-1">
          <h1 className="font-playfair text-2xl tracking-wide text-[#2B2B2B]">
            Delivery details
          </h1>
          <p className="text-sm text-[#5C5548]">
            We currently ship within select regions only. Ensure your details are
            correct to avoid delays.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium tracking-wide text-[#5C5548] mb-1">
              Full name
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="Nishant Sharma"
            />
            {touched.name && errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-[#5C5548] mb-1">
              Email address
            </label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="you@example.com"
            />
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-[#5C5548] mb-1">
              Phone
            </label>
            <Input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder="Include country code if applicable"
            />
            {touched.phone && errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium tracking-wide text-[#5C5548] mb-1">
              Delivery address
            </label>
            <Textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
              rows={3}
              placeholder="Street, city, state, postal code, country"
            />
            {touched.address && errors.address && (
              <p id="address-error" className="mt-1 text-xs text-red-600">
                {errors.address}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium tracking-wide text-[#5C5548] mb-1">
              Order notes (optional)
            </label>
            <Textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              placeholder="Share any special delivery preferences."
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-2 border-t border-dashed border-[#E0D9CC] flex flex-col gap-3"
        >
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing order
              </span>
            ) : (
              "Place order"
            )}
          </Button>
          {!isValid && (
            <p className="text-[11px] text-[#8A8172]">
              Ensure all required fields are complete and valid. We do not process any
              real payments in this mock experience; your order is simulated locally.
            </p>
          )}
        </motion.div>
      </form>

      <OrderSummaryPanel />
    </div>
  );
};

export default CheckoutForm;