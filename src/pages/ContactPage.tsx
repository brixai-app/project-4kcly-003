import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { DocumentTitle } from "@/components/seo/DocumentTitle";
import { MotionButton } from "@/components/ui/MotionButton";
import { Field } from "@/components/ui/Field";
import { toast } from "sonner";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [K in keyof typeof initialForm]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim()) next.message = "Please add a message";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setIsSubmitting(true);
    // Mock submission only – no backend involved
    window.setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent (mock). We'll be in touch soon.");
      setForm(initialForm);
    }, 900);
  };

  return (
    <>
      <DocumentTitle
        title="Contact"
        description="Contact Nishant Waters for collaborations, events, and custom water bottle experiences."
      />
      <div className="min-h-screen bg-[#FFF8F0] text-[#3B2A23] pb-20">
        <Container className="pt-16 lg:pt-24 grid gap-12 lg:grid-cols-[3fr,2fr] items-start">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#A0522D]/80 mb-4">
              Contact
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl leading-tight text-[#3B2A23] mb-4">
              Let&apos;s design the perfect bottle for your moment.
            </h1>
            <p className="font-['Inter'] text-sm sm:text-base text-[#5b4638] leading-relaxed mb-8 max-w-xl">
              Share a little about your event, brand, or idea and we&apos;ll help you
              imagine how Nishant Waters bottles could quietly elevate the
              experience. This is a fully mock contact flow – no emails are
              actually sent.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-[#FFF8F0] border border-[#E0C8B6] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#b88a6a33]"
              noValidate
            >
              <Field
                label="Name"
                htmlFor="contact-name"
                error={errors.name}
              >
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40"
                />
              </Field>

              <Field
                label="Email"
                htmlFor="contact-email"
                error={errors.email}
              >
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40"
                />
              </Field>

              <Field
                label="How can we help?"
                htmlFor="contact-message"
                error={errors.message}
              >
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="block w-full rounded-xl border border-[#E0C8B6] bg-[#FFF8F0] px-3 py-2 text-sm font-['Inter'] text-[#3B2A23] shadow-sm focus:border-[#A0522D] focus:outline-none focus:ring-2 focus:ring-[#A0522D]/40 resize-vertical"
                />
              </Field>

              <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                <MotionButton
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#A0522D] text-[#FFF8F0] hover:bg-[#8c4626] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2.5 rounded-full text-sm font-['Inter'] shadow-md shadow-[#a0522d66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-[#FFF8F0]"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </MotionButton>
                <p className="text-xs font-['Inter'] text-[#7a5b48]">
                  This is a demo experience with mock-only submissions.
                </p>
              </div>
            </form>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-3xl bg-[#F4E1D2] p-6 shadow-md shadow-[#b88a6a33]">
              <h2 className="font-['Playfair_Display'] text-xl mb-2 text-[#3B2A23]">
                Studio hours
              </h2>
              <p className="font-['Inter'] text-sm text-[#5b4638] mb-4">
                We imagine every label as if it were headed to a gallery opening
                or slow Sunday brunch. Expect thoughtful, measured replies.
              </p>
              <p className="font-['Inter'] text-xs text-[#5b4638]">
                Monday – Friday · 10:00 – 17:00 (Mock Studio Time)
              </p>
            </div>
            <div className="rounded-3xl border border-[#E0C8B6] bg-[#FFF8F0] p-6 space-y-3">
              <h3 className="font-['Inter'] text-sm font-semibold text-[#708238] tracking-wide">
                Collaboration notes
              </h3>
              <p className="font-['Inter'] text-sm text-[#5b4638]">
                Brand launches, curated events, concept hotels, slow living
                spaces – we love projects where water is more than utility.
              </p>
              <p className="font-['Inter'] text-xs text-[#7a5b48]">
                Since this is a mock front-end experience, any details you share
                stay in your browser only and are never actually transmitted.
              </p>
            </div>
          </motion.aside>
        </Container>
      </div>
    </>
  );
};

export default ContactPage;