import React, { useState, useEffect } from "react";
import { Field } from "../ui/Field";
import { EMAIL_REGEX } from "@/mock";

export interface ShippingData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
}

interface ShippingFormProps {
  initialValue?: Partial<ShippingData>;
  onChange?: (data: ShippingData, valid: boolean) => void;
}

const defaultData: ShippingData = {
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
  email: "",
};

export const ShippingForm: React.FC<ShippingFormProps> = ({
  initialValue,
  onChange,
}) => {
  const [data, setData] = useState<ShippingData>({
    ...defaultData,
    ...initialValue,
  });

  const [touched, setTouched] = useState<Record<keyof ShippingData, boolean>>({
    fullName: false,
    addressLine1: false,
    addressLine2: false,
    city: false,
    postalCode: false,
    country: false,
    email: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>(
    {}
  );

  const validate = (next: ShippingData) => {
    const nextErrors: Partial<Record<keyof ShippingData, string>> = {};

    if (!next.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!next.addressLine1.trim())
      nextErrors.addressLine1 = "Address is required";
    if (!next.city.trim()) nextErrors.city = "City is required";
    if (!next.postalCode.trim())
      nextErrors.postalCode = "Postal code is required";
    if (!next.country.trim()) nextErrors.country = "Country is required";

    if (!next.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(next.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    if (onChange) onChange(next, valid);
  };

  useEffect(() => {
    validate(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = (field: keyof ShippingData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    field: keyof ShippingData,
    value: string
  ) => {
    const next = { ...data, [field]: value };
    setData(next);
    validate(next);
  };

  return (
    <section aria-label="Shipping details" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Full name"
          required
          htmlFor="shipping-full-name"
          error={touched.fullName ? errors.fullName : undefined}
        >
          <input
            id="shipping-full-name"
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor="shipping-email"
          error={touched.email ? errors.email : undefined}
        >
          <input
            id="shipping-email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
      </div>

      <Field
        label="Address line 1"
        required
        htmlFor="shipping-address1"
        error={touched.addressLine1 ? errors.addressLine1 : undefined}
      >
        <input
          id="shipping-address1"
          type="text"
          value={data.addressLine1}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          onBlur={() => handleBlur("addressLine1")}
          autoComplete="address-line1"
          aria-invalid={!!errors.addressLine1}
          className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
        />
      </Field>

      <Field label="Address line 2" htmlFor="shipping-address2">
        <input
          id="shipping-address2"
          type="text"
          value={data.addressLine2 ?? ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          onBlur={() => handleBlur("addressLine2")}
          autoComplete="address-line2"
          className="w-full rounded-xl border border-[rgba(160,82,45,0.18)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.45)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="City"
          required
          htmlFor="shipping-city"
          error={touched.city ? errors.city : undefined}
        >
          <input
            id="shipping-city"
            type="text"
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => handleBlur("city")}
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
        <Field
          label="Postal code"
          required
          htmlFor="shipping-postal"
          error={touched.postalCode ? errors.postalCode : undefined}
        >
          <input
            id="shipping-postal"
            type="text"
            value={data.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            onBlur={() => handleBlur("postalCode")}
            autoComplete="postal-code"
            aria-invalid={!!errors.postalCode}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
        <Field
          label="Country"
          required
          htmlFor="shipping-country"
          error={touched.country ? errors.country : undefined}
        >
          <input
            id="shipping-country"
            type="text"
            value={data.country}
            onChange={(e) => handleChange("country", e.target.value)}
            onBlur={() => handleBlur("country")}
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            className="w-full rounded-xl border border-[rgba(160,82,45,0.32)] bg-[#FFF8F0] px-3 py-2 text-sm text-[rgba(40,30,20,0.98)] shadow-sm outline-none transition-colors duration-150 hover:border-[rgba(160,82,45,0.55)] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#40E0D0]/60"
          />
        </Field>
      </div>
    </section>
  );
};

export default ShippingForm;