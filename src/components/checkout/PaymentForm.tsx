import React, { useEffect, useState } from "react";
import { Field } from "../ui/Field";

export interface PaymentData {
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
  nameOnCard: string;
}

interface PaymentFormProps {
  initialValue?: Partial<PaymentData>;
  onChange?: (data: PaymentData, valid: boolean) => void;
}

const defaultPayment: PaymentData = {
  cardNumber: "",
  expiry: "",
  cvc: "",
  nameOnCard: "",
};

const cardNumberPattern = /^\d{16}$/;
const expiryPattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const cvcPattern = /^\d{3,4}$/;

export const PaymentForm: React.FC<PaymentFormProps> = ({
  initialValue,
  onChange,
}) => {
  const [data, setData] = useState<PaymentData>({
    ...defaultPayment,
    ...initialValue,
  });

  const [touched, setTouched] = useState<
    Record<keyof PaymentData, boolean>
  >({
    cardNumber: false,
    expiry: false,
    cvc: false,
    nameOnCard: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentData, string>>
  >({});

  const validate = (next: PaymentData) => {
    const nextErrors: Partial<Record<keyof PaymentData, string>> = {};

    if (!next.nameOnCard.trim()) {
      nextErrors.nameOnCard = "Name on card is required";
    }

    if (!next.cardNumber.trim()) {
      nextErrors.cardNumber = "Card number is required";
    } else if (!cardNumberPattern.test(next.cardNumber.replace(/\s+/g, ""))) {
      nextErrors.cardNumber = "Enter a valid 16-digit card number";
    }

    if (!next.expiry.trim()) {
      nextErrors.expiry = "Expiry is required";
    } else if (!expiryPattern.test(next.expiry)) {
      nextErrors.expiry = "Use MM/YY format";
    }

    if (!next.cvc.trim()) {
      nextErrors.cvc = "CVC is required";
    } else if (!cvcPattern.test(next.cvc)) {
      nextErrors.cvc = "Enter 3–4 digit CVC";
    }

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    if (onChange) {
      const payload: PaymentData = {
        ...next,
        // In a real app sensitive data would be tokenized; here it is fully mocked
      };
      onChange(payload, valid);
    }
  };

  useEffect(() => {
    validate(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = (field: keyof PaymentData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof PaymentData, value: string) => {
    let v = value;
    if (field === "cardNumber") {
      v = value.replace(/\D/g, "").slice(0, 16);
    }
    if (field === "expiry") {
      v = value.replace(/[^\d/]/g, "").slice(0, 5);
      if (v.length === 2 && !v.includes("/")) {
        v = v + "/";
      }
    }
    if (field === "cvc") {
      v = value.replace(/\D/g, "").slice(0, 4);
    }

    const next = { ...data, [field]: v };
    setData(next);
    validate(next);
  };

  return (
    <section aria-label="Payment details" className="space-y-4">
      <Field
        label="Name on card"
        required
        htmlFor="payment-name"
        error={touched.nameOnCard ? errors.nameOnCard : undefined}
      >
        <input
          id="payment-name"
          type="text"
          value={data.nameOnCard}
          onChange={(e) => handleChange("nameOnCard", e.target.value)}
          onBlur={() => handleBlur("nameOnCard")}
          autoComplete="cc-name"
          aria-invalid={!!errors.nameOnCard}
          className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
        />
      </Field>

      <Field
        label="Card number"
        required
        htmlFor="payment-card"
        description="We use a fully mocked payment system for this demo. Use any 16 digits."
        error={touched.cardNumber ? errors.cardNumber : undefined}
      >
        <input
          id="payment-card"
          inputMode="numeric"
          pattern="\d{16}"
          value={data.cardNumber}
          onChange={(e) => handleChange("cardNumber", e.target.value)}
          onBlur={() => handleBlur("cardNumber")}
          autoComplete="cc-number"
          aria-invalid={!!errors.cardNumber}
          className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60 tracking-[0.12em]"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-[1fr,1fr]">
        <Field
          label="Expiry"
          required
          htmlFor="payment-expiry"
          description="MM/YY"
          error={touched.expiry ? errors.expiry : undefined}
        >
          <input
            id="payment-expiry"
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={data.expiry}
            onChange={(e) => handleChange("expiry", e.target.value)}
            onBlur={() => handleBlur("expiry")}
            autoComplete="cc-exp"
            aria-invalid={!!errors.expiry}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>

        <Field
          label="CVC"
          required
          htmlFor="payment-cvc"
          error={touched.cvc ? errors.cvc : undefined}
        >
          <input
            id="payment-cvc"
            type="password"
            inputMode="numeric"
            value={data.cvc}
            onChange={(e) => handleChange("cvc", e.target.value)}
            onBlur={() => handleBlur("cvc")}
            autoComplete="cc-csc"
            aria-invalid={!!errors.cvc}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
      </div>
    </section>
  );
};

export default PaymentForm;