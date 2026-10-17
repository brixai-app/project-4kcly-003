import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Separator,
} from "@/components/ui/shadcn";
import { formatCurrency, getCart, computeCartTotals, placeOrder, getState, type CartItem, type Address } from "@/mock";
import { ChevronRight, Lock, ShoppingBag, AlertCircle } from "lucide-react";

// NOTE: This entire checkout flow is 100% frontend-only and mocked.
// No real payments or network calls are made; all state is persisted
// purely in localStorage via src/mock.ts.

export interface CheckoutPageProps {}

interface CheckoutFormState {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const initialFormState: CheckoutFormState = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getCart().items);

  useEffect(() => {
    // Prefill with mock user default address when available
    const state = getState();
    const addr: Address | undefined = state.user?.defaultAddress;
    if (addr) {
      setForm(prev => ({
        ...prev,
        fullName: addr.fullName,
        email: addr.email,
        phone: addr.phone,
        line1: addr.line1,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        cardholderName: addr.fullName,
      }));
    }

    // Sync with mock cart in case changes were made elsewhere
    const interval = window.setInterval(() => {
      setCartItems(getCart().items);
    }, 400);

    return () => window.clearInterval(interval);
  }, []);

  const totals = useMemo(() => computeCartTotals(), [cartItems.length]);

  const cartIsEmpty = cartItems.length === 0;

  const handleChange = (field: keyof CheckoutFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Please enter a full name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) nextErrors.phone = "Please add a contact phone number.";
    if (!form.line1.trim()) nextErrors.line1 = "Street address is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.state.trim()) nextErrors.state = "State / region is required.";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Postal code is required.";
    if (!form.country.trim()) nextErrors.country = "Country is required.";

    if (!form.cardholderName.trim()) nextErrors.cardholderName = "Cardholder name is required.";
    const digits = form.cardNumber.replace(/\D/g, "");
    if (digits.length < 12) nextErrors.cardNumber = "Enter a mock card number (12+ digits).";
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(form.expiry.trim())) {
      nextErrors.expiry = "Use MM/YY format.";
    }
    if (!/^\d{3,4}$/.test(form.cvc.trim())) {
      nextErrors.cvc = "CVC should be 3–4 digits.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartIsEmpty) {
      toast.error("Your cart is empty.", {
        description: "Add a bottle before placing an order.",
      });
      return;
    }

    if (!validate()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const el = document.querySelector<HTMLInputElement>(`[name="${firstErrorField}"]`);
        el?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const order = placeOrder({
        address: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
        payment: {
          cardholderName: form.cardholderName.trim(),
          cardNumber: form.cardNumber.replace(/\s+/g, ""),
          expiry: form.expiry.trim(),
          cvc: form.cvc.trim(),
        },
      });

      setIsSubmitting(false);

      if (!order) {
        toast.error("Unable to place order", {
          description: "Your cart may be empty. This is a client-only mock checkout.",
        });
        return;
      }

      setCartItems([]);
      toast.success("Order placed", {
        description: `This is a mock checkout. Your reference: ${order.id.slice(0, 8)}`,
      });

      navigate("/", { replace: true });
    }, 700);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  };

  const accentBorder = "border-[#C58A55]/60";
  const accentBgSoft = "bg-[#F5E7D8] dark:bg-[#24150F]";

  return (
    <motion.main
      className="w-full min-h-screen bg-[#F4E9DD] dark:bg-[#0F0A08] text-[#2B211A] dark:text-[#F9F3EC] pt-20 pb-16"
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Checkout"
    >
      <div className="w-full px-6 lg:px-12">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Heading strip */}
          <motion.header
            className="mb-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between"
            variants={sectionVariants}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
                Quietly considered checkout.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#5A4634] dark:text-[#D1B79B] max-w-2xl">
                This is a fully client-side mock checkout—no real payments are processed. Orders and cart
                details live only in your browser.
              </p>
            </div>
            {cartIsEmpty && (
              <div className="mt-4 lg:mt-0 flex items-center gap-2 text-xs sm:text-sm text-[#7B5D43] dark:text-[#F0D4B3]">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <span>Your cart is empty. Add a bottle to complete this flow.</span>
              </div>
            )}
          </motion.header>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)] gap-8 xl:gap-10 items-start">
            {/* Left: form */}
            <motion.section
              className="space-y-6"
              variants={sectionVariants}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card
                className={`shadow-sm bg-[#FBF4EB]/90 dark:bg-[#140C08]/90 border ${accentBorder} backdrop-blur-sm transition-colors`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="font-serif text-xl sm:text-2xl">Shipping details</CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-[#7B5D43] dark:text-[#E0C5A7]">
                    Where your bottles would arrive in a real-world version of this store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Full name"
                      name="fullName"
                      autoComplete="name"
                      value={form.fullName}
                      error={errors.fullName}
                      onChange={e => handleChange("fullName", e.target.value)}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      error={errors.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  </div>
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    error={errors.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                  />
                  <Field
                    label="Address line 1"
                    name="line1"
                    autoComplete="address-line1"
                    value={form.line1}
                    error={errors.line1}
                    onChange={e => handleChange("line1", e.target.value)}
                  />
                  <Field
                    label="Address line 2 (optional)"
                    name="line2"
                    autoComplete="address-line2"
                    value={form.line2}
                    error={errors.line2}
                    onChange={e => handleChange("line2", e.target.value)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field
                      label="City"
                      name="city"
                      autoComplete="address-level2"
                      value={form.city}
                      error={errors.city}
                      onChange={e => handleChange("city", e.target.value)}
                    />
                    <Field
                      label="State / region"
                      name="state"
                      autoComplete="address-level1"
                      value={form.state}
                      error={errors.state}
                      onChange={e => handleChange("state", e.target.value)}
                    />
                    <Field
                      label="Postal code"
                      name="postalCode"
                      autoComplete="postal-code"
                      value={form.postalCode}
                      error={errors.postalCode}
                      onChange={e => handleChange("postalCode", e.target.value)}
                    />
                  </div>
                  <Field
                    label="Country"
                    name="country"
                    autoComplete="country-name"
                    value={form.country}
                    error={errors.country}
                    onChange={e => handleChange("country", e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card
                className={`shadow-sm ${accentBgSoft} border ${accentBorder} backdrop-blur-sm transition-colors`}
              >
                <CardHeader className="pb-4 flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-xl sm:text-2xl">Payment (mock)</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-[#7B5D43] dark:text-[#E0C5A7]">
                      This step is purely illustrative. No cards are charged and data never leaves your browser.
                    </CardDescription>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-xs text-[#7B5D43] dark:text-[#F0D4B3]">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    <span>Local-only mock</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label="Cardholder name"
                    name="cardholderName"
                    autoComplete="cc-name"
                    value={form.cardholderName}
                    error={errors.cardholderName}
                    onChange={e => handleChange("cardholderName", e.target.value)}
                  />
                  <Field
                    label="Card number (mock)"
                    name="cardNumber"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    value={form.cardNumber}
                    error={errors.cardNumber}
                    onChange={e => handleChange("cardNumber", e.target.value)}
                    placeholder="4242 4242 4242 4242"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field
                      label="Expiry"
                      name="expiry"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={form.expiry}
                      error={errors.expiry}
                      onChange={e => handleChange("expiry", e.target.value)}
                    />
                    <Field
                      label="CVC"
                      name="cvc"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      value={form.cvc}
                      error={errors.cvc}
                      onChange={e => handleChange("cvc", e.target.value)}
                    />
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-[#E1CDB7] dark:border-[#3A2519] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] sm:text-xs text-[#7B5D43] dark:text-[#E0C5A7] max-w-md">
                    By placing this mock order, you experience the full front-end flow. Nothing is shipped or
                    charged—orders are stored only in localStorage.
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={cartIsEmpty || isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#C58A55] hover:bg-[#B1723B] text-[#140C08] font-medium text-sm px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      <span>{cartIsEmpty ? "Cart is empty" : "Place mock order"}</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.section>

            {/* Right: order summary */}
            <motion.aside
              className="space-y-4 xl:space-y-6"
              variants={sectionVariants}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <Card className="shadow-sm bg-[#FBF4EB]/95 dark:bg-[#140C08]/95 border border-[#D8C0A6] dark:border-[#3A2519] backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg sm:text-xl flex items-center justify-between">
                    <span>Order summary</span>
                    <span className="text-xs font-sans text-[#7B5D43] dark:text-[#E0C5A7]">{cartItems.length} item{cartItems.length === 1 ? "" : "s"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
                    {cartItems.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#7B5D43] dark:text-[#E0C5A7]">
                        Your cart is quiet. Explore a bottle and return here to see the full flow.
                      </p>
                    ) : (
                      cartItems.map(item => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 border-b border-[#E8D6C3]/80 dark:border-[#3A2519]/80 pb-2 last:border-b-0"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {(() => {
                                const product = getState().products.find(p => p.id === item.productId);
                                return product?.name ?? "Bottle";
                              })()}
                            </p>
                            <p className="text-[11px] text-[#7B5D43] dark:text-[#E0C5A7] mt-0.5">
                              Qty {item.quantity}
                              {item.designSnapshot && (
                                <span className="ml-2 inline-flex rounded-full border border-[#D8C0A6] dark:border-[#3A2519] px-2 py-0.5 text-[10px] uppercase tracking-wide">
                                  Custom label
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {formatCurrency(item.linePriceCents)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator className="bg-[#E1CDB7] dark:bg-[#3A2519]" />

                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-[#5A4634] dark:text-[#E0C5A7]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totals.subtotalCents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#5A4634] dark:text-[#E0C5A7]">
                      <span>Shipping</span>
                      <span>{totals.subtotalCents === 0 ? "—" : formatCurrency(totals.shippingCents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#5A4634] dark:text-[#E0C5A7]">
                      <span>Tax (8%)</span>
                      <span>{totals.subtotalCents === 0 ? "—" : formatCurrency(totals.taxCents)}</span>
                    </div>
                  </div>

                  <Separator className="bg-[#E1CDB7] dark:bg-[#3A2519]" />

                  <div className="flex items-center justify-between text-sm sm:text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.totalCents)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <p className="text-[10px] sm:text-xs text-[#7B5D43] dark:text-[#E0C5A7] leading-relaxed">
                    Prices and totals are part of the front-end mock experience. Adjust your cart to see how
                    the summary responds in real time.
                  </p>
                </CardFooter>
              </Card>

              <div className="hidden xl:block text-[11px] sm:text-xs text-[#7B5D43] dark:text-[#E0C5A7] leading-relaxed">
                <p>
                  Every interaction here—validation, error states, totals, and order placement—is driven by
                  the single mock store in <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5 text-[10px]">src/mock.ts</code>
                  and persisted to <span className="font-medium">localStorage</span> only.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const Field: React.FC<FieldProps> = ({ label, name, error, className, ...inputProps }) => {
  const describedById = error ? `${name}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs sm:text-sm font-medium text-[#3F2A23] dark:text-[#F3E3D1] tracking-wide"
      >
        {label}
      </label>
      <Input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={describedById}
        className={`h-10 rounded-full border-[#D8C0A6] dark:border-[#3A2519] bg-white/70 dark:bg-[#1A100C]/80 text-xs sm:text-sm px-4 focus-visible:ring-[#C58A55] focus-visible:border-[#C58A55] placeholder:text-[#B2957D] dark:placeholder:text-[#7B5D43] transition-colors ${className ?? ""}`}
        {...inputProps}
      />
      {error && (
        <p
          id={describedById}
          className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default CheckoutPage;