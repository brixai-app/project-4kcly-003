import React, { useState } from "react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { MotionFadeIn, MotionSlideUp } from "../components/ui/Motion";
import { toast } from "sonner";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

const validate = (values: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "Please share your name.";
  }
  if (!values.email.trim()) {
    errors.email = "An email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email.";
  }
  if (!values.message.trim()) {
    errors.message = "Tell us a little more about your request.";
  } else if (values.message.trim().length < 20) {
    errors.message = "A bit more detail helps us respond thoughtfully (min. 20 characters).";
  }
  return errors;
};

export const ContactPage: React.FC = () => {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    const nextErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    const hasError = Object.keys(validation).length > 0;
    if (hasError) {
      toast.error("Please review the highlighted fields.");
      return;
    }
    setIsSubmitting(true);

    // Simulate send – frontend only, no backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent. Our studio will be in touch shortly.");
      setValues(initialState);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      <section className="px-6 pt-10 pb-6 sm:px-10 lg:px-20 lg:pt-16 lg:pb-10">
        <MotionFadeIn>
          <SectionHeading
            eyebrow="Contact the Studio"
            title="Let\'s Curate Your Next Hydration Moment"
            align="left"
          />
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#4A4A4A]">
            Share the occasion, scale, and any inspiration you have in mind. From
            intimate dinners to large-format events, our team will help you shape a
            bespoke bottled water experience.
          </p>
        </MotionFadeIn>
      </section>

      <section className="px-6 pb-16 sm:px-10 lg:px-20 lg:pb-24 grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-start">
        <MotionSlideUp>
          <form
            onSubmit={handleSubmit}
            className="bg-[#F3F1EB] border border-[#DDD6C5] rounded-3xl p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.10)] space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-medium tracking-[0.18em] uppercase text-[#8B8171]"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="How should we address you?"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-xs text-[#9C3B37] mt-1"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium tracking-[0.18em] uppercase text-[#8B8171]"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Where can we reach you?"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-[#9C3B37] mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="message"
                  className="text-xs font-medium tracking-[0.18em] uppercase text-[#8B8171]"
                >
                  Message
                </label>
                <span className="text-[11px] text-[#7A7368] font-[\"Bodoni Moda\",_serif]">
                  Tell us about scale, timing, and aesthetic.
                </span>
              </div>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Share the occasion, guest count, and any visual references."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="text-xs text-[#9C3B37] mt-1"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[11px] text-[#7A7368] max-w-xs">
                We respond to most inquiries within one business day. This form uses
                mock handling only—no messages are actually sent.
              </p>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send to the studio"}
              </Button>
            </div>
          </form>
        </MotionSlideUp>

        <MotionFadeIn className="space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#DDD6C5] bg-[#FAF9F6] shadow-sm">
            <div className="p-6 sm:p-7 space-y-4">
              <p className="text-xs tracking-[0.22em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                Studio Notes
              </p>
              <h2 className="font-[\"Playfair Display\",_serif] text-xl sm:text-2xl leading-snug">
                Every bottle begins with a conversation.
              </h2>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                Share your vision, mood boards, or brand assets, and our team will
                guide you through label layouts, bottle tones, and finishing
                details—entirely within this bespoke, frontend-only experience.
              </p>
              <div className="grid gap-4 text-sm text-[#4A4A4A]">
                <div>
                  <p className="font-medium text-[#2B2B2B]">Ideal for</p>
                  <p>Launch events, boutique hotels, ateliers, private dining, and curated gifting.</p>
                </div>
                <div>
                  <p className="font-medium text-[#2B2B2B]">Response Window</p>
                  <p>Within one business day, with tailored recommendations for your concept.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-52 sm:h-64 rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.18)] border border-[#DDD6C5]">
            <div
              className="absolute inset-0 bg-[url('https://images.pexels.com/photos/681331/pexels-photo-681331.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/55 via-transparent" />
            <div className="relative h-full flex items-end p-6">
              <p className="text-xs sm:text-sm text-[#FAF9F6] max-w-sm leading-relaxed font-[\"Playfair Display\",_serif]">
                Crafted in small, intentional batches, each Nishant Waters bottle is
                designed to feel effortless in the hand and unforgettable on the
                table.
              </p>
            </div>
          </div>
        </MotionFadeIn>
      </section>
    </main>
  );
};

export default ContactPage;