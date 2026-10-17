import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn";
import {
  BRANDY_PALETTE,
  ShippingInfo,
  formatMoney,
  getCartSummary,
  loadShippingDraft,
  placeOrder,
  saveShippingDraft,
  validateShipping,
  useMockStore,
} from "@/mock";
import { showToastError, showToastSuccess } from "@/components/ToastProvider";
import { CheckCircle2, Lock, Truck, ArrowRight, ArrowLeft } from "lucide-react";

// ---------------------------------------------
// NOTE: This page uses a FRONTEND-ONLY MOCK store
// from src/mock.ts. There is NO backend or payments;
// checkout and orders are simulated in-browser with
// localStorage persistence for cart and shipping data.
// ---------------------------------------------

type StepKey = 1 | 2 | 3;

const STEP_LABELS: Record<StepKey, string> = {
  1: "Shipping details",
  2: "Review order",
  3: "Place order",
};

const emptyShipping: ShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const fieldLabel: Record<keyof ShippingInfo, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  addressLine1: "Address line 1",
  addressLine2: "Address line 2 (optional)",
  city: "City",
  state: "State / Region",
  postalCode: "Postal code",
  country: "Country",
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  // Pull reactive cart summary from mock store (frontend-only)
  const cartSummary = useMockStore(() => getCartSummary());

  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [shipping, setShipping] = useState<ShippingInfo>(emptyShipping);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>(
    {}
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Hydrate shipping draft from localStorage via mock.ts
  useEffect(() => {
    const draft = loadShippingDraft();
    if (draft) {
      setShipping(draft);
    }
  }, []);

  // Persist every meaningful change as draft (debounced-ish via effect)
  useEffect(() => {
    // Avoid saving completely empty initial state as draft
    const hasAnyValue = Object.values(shipping).some((v) => String(v ?? "").trim());
    if (hasAnyValue) {
      saveShippingDraft(shipping);
    }
  }, [shipping]);

  const isCartEmpty = cartSummary.items.length === 0;

  useEffect(() => {
    if (isCartEmpty) {
      setCurrentStep(1);
    }
  }, [isCartEmpty]);

  const handleFieldChange = (
    field: keyof ShippingInfo,
    value: string
  ): void => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateAndGoToReview = (): void => {
    const result = validateShipping(shipping);
    setErrors(result.errors);
    if (!result.valid) {
      showToastError("Check your shipping details", "A few fields need attention.");
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (isCartEmpty) {
      showToastError("Your cart is empty", "Add a bottle before placing an order.");
      return;
    }

    const result = validateShipping(shipping);
    setErrors(result.errors);
    if (!result.valid) {
      setCurrentStep(1);
      showToastError("Check your shipping details", "We need a few more details.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Simulated frontend-only order placement via mock.ts
      const order = placeOrder(shipping);
      if (!order) {
        showToastError("Unable to place order", "Please try again in a moment.");
        return;
      }
      showToastSuccess("Order placed", `Your reference is ${order.orderNumber}.`);
      // Navigate to catalog to continue browsing
      navigate("/catalog");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const canProceedToPayment = useMemo(() => {
    const result = validateShipping(shipping);
    return result.valid && !isCartEmpty;
  }, [shipping, isCartEmpty]);

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-[${BRANDY_PALETTE.cream}]/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 pt-12 pb-16"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Page heading */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-100 font-['Playfair_Display']"
            >
              Checkout
            </h1>
            <p className="mt-2 text-sm md:text-base text-neutral-700 dark:text-neutral-300 max-w-2xl">
              A quiet, three-part ritual: share where these bottles are headed, confirm
              your selection, and we will carefully fold your order into our production
              queue. No payment is taken on this preview.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Client-side only. Your details stay in this browser.</span>
          </div>
        </motion.header>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <nav
            aria-label="Checkout steps"
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <ol className="flex flex-1 flex-wrap gap-4">
              {([1, 2, 3] as StepKey[]).map((step, index) => {
                const isActive = currentStep === step;
                const isCompleted = currentStep > step;
                return (
                  <li key={step} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (step < currentStep) {
                          setCurrentStep(step);
                        } else if (step === 2 && currentStep === 1) {
                          validateAndGoToReview();
                        } else if (step === 3 && currentStep < 3 && canProceedToPayment) {
                          setCurrentStep(3);
                        }
                      }}
                      className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[${BRANDY_PALETTE.amber}] focus-visible:ring-offset-[${BRANDY_PALETTE.cream}] dark:focus-visible:ring-offset-neutral-950
                        ${
                          isActive
                            ? `border-[${BRANDY_PALETTE.amberDeep}] bg-[${BRANDY_PALETTE.amberLight}] text-[${BRANDY_PALETTE.inkSoft}]`
                            : isCompleted
                            ? `border-[${BRANDY_PALETTE.sienna}] bg-[${BRANDY_PALETTE.creamSoft}] text-[${BRANDY_PALETTE.inkSoft}]`
                            : "border-neutral-300 bg-white/70 dark:bg-neutral-900/60 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200"
                        }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold
                          ${
                            isActive || isCompleted
                              ? `border-[${BRANDY_PALETTE.sienna}] bg-[${BRANDY_PALETTE.sienna}] text-white`
                              : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-200"
                          }`}
                        aria-hidden="true"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="hidden text-xs md:inline">{STEP_LABELS[step]}</span>
                      <span className="inline text-xs md:hidden">
                        {step === 1 ? "Ship" : step === 2 ? "Review" : "Place"}
                      </span>
                    </button>
                    {index < 2 && (
                      <div className="hidden h-px w-10 bg-gradient-to-r from-neutral-300/40 via-neutral-400/70 to-neutral-300/40 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 md:block" />
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300 md:mt-0">
              <Truck className="h-4 w-4 text-[color:var(--nw-amber,#d28c45)]" />
              <span>
                Complimentary shipping on mock orders above {formatMoney(250)}.
              </span>
            </div>
          </nav>
        </motion.div>

        {/* Layout: form + order summary */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          {/* Left column: steps 1 & 3 content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            {currentStep === 1 && (
              <Card className="border-none bg-white/80 shadow-sm backdrop-blur-sm dark:bg-neutral-900/80">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-50">
                    Shipping details
                  </CardTitle>
                  <CardDescription className="text-sm text-neutral-700 dark:text-neutral-300">
                    Tell us where these bottles are headed. This information is stored only
                    in your browser for this preview.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="fullName"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.fullName}
                      </label>
                      <Input
                        id="fullName"
                        autoComplete="name"
                        value={shipping.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      />
                      {errors.fullName && (
                        <p
                          id="fullName-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.email}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={shipping.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-xs text-red-600 dark:text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.phone}
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={shipping.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-xs text-red-600 dark:text-red-400">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4 bg-neutral-200 dark:bg-neutral-800" />

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="addressLine1"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.addressLine1}
                      </label>
                      <Input
                        id="addressLine1"
                        autoComplete="address-line1"
                        value={shipping.addressLine1}
                        onChange={(e) => handleFieldChange("addressLine1", e.target.value)}
                        className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                        aria-invalid={!!errors.addressLine1}
                        aria-describedby={
                          errors.addressLine1 ? "addressLine1-error" : undefined
                        }
                      />
                      {errors.addressLine1 && (
                        <p
                          id="addressLine1-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="addressLine2"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.addressLine2}
                      </label>
                      <Input
                        id="addressLine2"
                        autoComplete="address-line2"
                        value={shipping.addressLine2 ?? ""}
                        onChange={(e) => handleFieldChange("addressLine2", e.target.value)}
                        className="h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[#b46a2b]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="city"
                          className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                        >
                          {fieldLabel.city}
                        </label>
                        <Input
                          id="city"
                          autoComplete="address-level2"
                          value={shipping.city}
                          onChange={(e) => handleFieldChange("city", e.target.value)}
                          className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                          aria-invalid={!!errors.city}
                          aria-describedby={errors.city ? "city-error" : undefined}
                        />
                        {errors.city && (
                          <p id="city-error" className="text-xs text-red-600 dark:text-red-400">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="state"
                          className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                        >
                          {fieldLabel.state}
                        </label>
                        <Input
                          id="state"
                          autoComplete="address-level1"
                          value={shipping.state}
                          onChange={(e) => handleFieldChange("state", e.target.value)}
                          className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                          aria-invalid={!!errors.state}
                          aria-describedby={errors.state ? "state-error" : undefined}
                        />
                        {errors.state && (
                          <p id="state-error" className="text-xs text-red-600 dark:text-red-400">
                            {errors.state}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="postalCode"
                          className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                        >
                          {fieldLabel.postalCode}
                        </label>
                        <Input
                          id="postalCode"
                          autoComplete="postal-code"
                          value={shipping.postalCode}
                          onChange={(e) =>
                            handleFieldChange("postalCode", e.target.value)
                          }
                          className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                          aria-invalid={!!errors.postalCode}
                          aria-describedby={
                            errors.postalCode ? "postalCode-error" : undefined
                          }
                        />
                        {errors.postalCode && (
                          <p
                            id="postalCode-error"
                            className="text-xs text-red-600 dark:text-red-400"
                          >
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="country"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200"
                      >
                        {fieldLabel.country}
                      </label>
                      <Input
                        id="country"
                        autoComplete="country-name"
                        value={shipping.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                        className={`h-10 rounded-none border-x-0 border-t-0 border-b border-neutral-300 bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[${BRANDY_PALETTE.amberDeep}]`}
                        aria-invalid={!!errors.country}
                        aria-describedby={errors.country ? "country-error" : undefined}
                      />
                      {errors.country && (
                        <p id="country-error" className="text-xs text-red-600 dark:text-red-400">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      We use these details only to mock your order confirmation. They never
                      leave this browser.
                    </p>
                    <Button
                      type="button"
                      onClick={validateAndGoToReview}
                      disabled={isCartEmpty}
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[${BRANDY_PALETTE.sienna}] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[${BRANDY_PALETTE.cocoa}] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400`}
                    >
                      <span>Review order</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="border-none bg-white/80 shadow-sm backdrop-blur-sm dark:bg-neutral-900/80">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-50">
                    Review order
                  </CardTitle>
                  <CardDescription className="text-sm text-neutral-700 dark:text-neutral-300">
                    A final glance before we stage your mock order. You can return to
                    shipping details to make adjustments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200">
                        Ship to
                      </h3>
                      <div className="text-sm text-neutral-800 dark:text-neutral-50">
                        <p>{shipping.fullName || "—"}</p>
                        <p className="mt-0.5">{shipping.email || "—"}</p>
                        <p className="mt-0.5">{shipping.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 dark:text-neutral-200">
                        Address
                      </h3>
                      <div className="text-sm text-neutral-800 dark:text-neutral-50">
                        <p>{shipping.addressLine1 || "—"}</p>
                        {shipping.addressLine2 && <p>{shipping.addressLine2}</p>}
                        <p className="mt-0.5">
                          {[shipping.city, shipping.state, shipping.postalCode]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </p>
                        <p className="mt-0.5">{shipping.country || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-neutral-200 dark:bg-neutral-800" />

                  <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[${BRANDY_PALETTE.amber}] bg-transparent px-4 py-1.5 text-xs font-medium text-[${BRANDY_PALETTE.inkSoft}] transition-colors hover:bg-[${BRANDY_PALETTE.creamSoft}] dark:text-amber-50`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Edit shipping</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!canProceedToPayment}
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[${BRANDY_PALETTE.sienna}] px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[${BRANDY_PALETTE.cocoa}] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400`}
                    >
                      <span>Continue to confirmation</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="border-none bg-white/80 shadow-sm backdrop-blur-sm dark:bg-neutral-900/80">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-50">
                    Place mock order
                  </CardTitle>
                  <CardDescription className="text-sm text-neutral-700 dark:text-neutral-300">
                    We will generate a client-side order reference and clear your cart to
                    simulate a finished checkout. No payment is processed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    <div className="rounded-lg border border-dashed border-neutral-300 bg-[rgba(242,194,155,0.25)] p-4 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100">
                      <p className="font-medium">A note on this preview</p>
                      <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
                        This experience is entirely mock data powered by a frontend-only
                        store. In a live implementation, this step would connect to your
                        payment gateway and production logistics.
                      </p>
                    </div>

                    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className={`inline-flex items-center justify-center gap-2 rounded-full border border-[${BRANDY_PALETTE.amber}] bg-transparent px-4 py-1.5 text-xs font-medium text-[${BRANDY_PALETTE.inkSoft}] transition-colors hover:bg-[${BRANDY_PALETTE.creamSoft}] dark:text-amber-50`}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to review</span>
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPlacingOrder || isCartEmpty}
                        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[${BRANDY_PALETTE.amberDeep}] px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[${BRANDY_PALETTE.sienna}] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400`}
                      >
                        <Lock className="h-4 w-4" />
                        <span>{isPlacingOrder ? "Placing order…" : "Place mock order"}</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right column: cart summary */}
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            aria-label="Order summary"
            className="space-y-4 lg:space-y-6"
          >
            <Card className="border-none bg-white shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-50">
                      Order summary
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-600 dark:text-neutral-300">
                      {cartSummary.items.length} line
                      {cartSummary.items.length === 1 ? " item" : " items"} in cart
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartSummary.items.length === 0 ? (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Your cart is quiet at the moment. Return to the collection to stage an
                    order.
                  </p>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto pr-1">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-neutral-200/80 dark:border-neutral-800">
                            <TableHead className="w-1/2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
                              Bottle
                            </TableHead>
                            <TableHead className="w-1/4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
                              Qty
                            </TableHead>
                            <TableHead className="w-1/4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
                              Total
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cartSummary.items.map((item) => (
                            <TableRow
                              key={item.id}
                              className="border-neutral-200/70 dark:border-neutral-800/80"
                            >
                              <TableCell className="align-top py-3">
                                <div className="space-y-0.5 text-xs text-neutral-800 dark:text-neutral-50">
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                                    {item.product.capacityMl}ml · {formatMoney(item.unitPrice)} each
                                  </p>
                                  {item.labelColor && (
                                    <div className="mt-1 flex items-center gap-2">
                                      <span
                                        className="h-3 w-3 rounded-full border border-neutral-300 shadow-sm"
                                        style={{
                                          backgroundColor: item.labelColor.hex,
                                        }}
                                        aria-hidden="true"
                                      />
                                      <span className="text-[11px] text-neutral-600 dark:text-neutral-300">
                                        {item.labelColor.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-3 text-right align-top text-xs text-neutral-700 dark:text-neutral-100">
                                ×{item.quantity}
                              </TableCell>
                              <TableCell className="py-3 text-right align-top text-xs font-medium text-neutral-900 dark:text-neutral-50">
                                {formatMoney(item.unitPrice * item.quantity)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Separator className="my-2 bg-neutral-200 dark:bg-neutral-800" />

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-200">
                        <span>Subtotal</span>
                        <span>{formatMoney(cartSummary.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                        <span>Shipping</span>
                        <span>
                          {cartSummary.shipping === 0
                            ? "Included for this mock"
                            : formatMoney(cartSummary.shipping)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 text-sm font-semibold text-[color:var(--nw-ink-soft,#2b211a)] dark:text-amber-50">
                        <span>Total</span>
                        <span>{formatMoney(cartSummary.total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.aside>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;