import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { saveMockContactMessage } from "@/mock";

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

const initialState: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

const validateEmail = (value: string) => {
  if (!value) return "Email is required";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return "Enter a valid email address";
  return undefined;
};

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: ContactErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    const emailError = validateEmail(form.email.trim());
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Mocked persistence in localStorage via src/mock.ts helper
      saveMockContactMessage({ ...form, createdAt: new Date().toISOString() });
      toast.success("Message sent!", {
        description: "We have received your note and will reply shortly.",
      });
      setForm(initialState);
      setErrors({});
    } catch (err) {
      toast.error("Unable to send message", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-[#333333]">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:flex-row md:py-24">
        {/* Intro copy */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:w-5/12"
        >
          <p className="text-xs tracking-[0.3em] text-[#A0522D] uppercase mb-4">
            Contact
          </p>
          <h1 className="font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-[#2B211A] sm:text-4xl">
            Begin the conversation.
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-[#4A3C33] md:text-base">
            Whether you are curating a private label for an opening night,
            outfitting a residence, or simply exploring what is possible, we are
            here to help you shape the details.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#5E4C40] md:text-base">
            Share a few notes about your project, quantities, and timing. A
            member of our studio will respond with tailored suggestions and next
            steps.
          </p>

          <div className="mt-8 space-y-2 text-sm text-[#4A3C33]">
            <p className="font-medium text-[#3C2E25]">Studio hours</p>
            <p>Monday – Friday, 10:00 – 18:00 (IST)</p>
            <p className="pt-2 text-xs text-[#7B5A42]">
              For press and partnerships, please also use this form and include
              any relevant links.
            </p>
          </div>
        </motion.section>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="md:w-7/12"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-3xl border border-[#E3C19C] bg-[#FFF9EF] p-6 shadow-sm md:p-8"
          >
            <div className="grid gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-[#7B5A42]"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-2 block w-full rounded-full border bg-white px-4 py-2.5 text-sm text-[#2B211A] outline-none transition-colors duration-150 focus:border-[#CBA135] focus:ring-2 focus:ring-[#CBA135]/40 ${
                    errors.name
                      ? "border-[#C96A4A]"
                      : "border-[#E0C29F] hover:border-[#CBA135]/70"
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-xs text-[#9B3B2A]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-[#7B5A42]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-2 block w-full rounded-full border bg-white px-4 py-2.5 text-sm text-[#2B211A] outline-none transition-colors duration-150 focus:border-[#CBA135] focus:ring-2 focus:ring-[#CBA135]/40 ${
                    errors.email
                      ? "border-[#C96A4A]"
                      : "border-[#E0C29F] hover:border-[#CBA135]/70"
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-xs text-[#9B3B2A]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-[#7B5A42]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`mt-2 block w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-[#2B211A] outline-none transition-colors duration-150 focus:border-[#CBA135] focus:ring-2 focus:ring-[#CBA135]/40 ${
                    errors.message
                      ? "border-[#C96A4A]"
                      : "border-[#E0C29F] hover:border-[#CBA135]/70"
                  }`}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-1 text-xs text-[#9B3B2A]"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-[11px] leading-relaxed text-[#8A6A4E]">
                  This form is fully client-side and uses mocked storage — no
                  messages are sent to a real backend yet.
                </p>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.96 }}
                  className="inline-flex items-center justify-center rounded-full bg-[#A0522D] px-6 py-2.5 text-sm font-medium text-[#FFF5E1] shadow-[0_10px_20px_rgba(98,46,20,0.45)] transition-colors duration-150 hover:bg-[#8E4322] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9EF] disabled:cursor-not-allowed disabled:bg-[#C08A6C] disabled:shadow-none"
                >
                  {submitting ? "Sending…" : "Send message"}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;