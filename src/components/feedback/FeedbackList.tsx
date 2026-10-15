import React from "react";
import { motion } from "framer-motion";
import { RatingStars } from "./RatingStars";
import { Droplets } from "lucide-react";
import { userFeedbackMock } from "@/mock"; // explicit: this is mock-only data

interface FeedbackListProps {
  productId: string;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ productId }) => {
  // Using mock-only feedback data; no backend is connected in this MVP
  const feedbacks = userFeedbackMock.filter((f) => f.productId === productId);

  if (!feedbacks.length) {
    return (
      <section aria-label="Customer impressions" className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Droplets className="h-4 w-4 text-[#004D40]" aria-hidden="true" />
          <h2 className="font-playfair text-lg text-[#2B2B2B] tracking-wide">
            Early impressions
          </h2>
        </div>
        <p className="text-sm text-[#5C5548] max-w-md">
          Be the first to share how Nishant Waters fits into your rituals of
          everyday luxury. Reviews here are displayed from curated mock feedback
          only in this preview.
        </p>
      </section>
    );
  }

  const averageRating =
    feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;

  return (
    <section aria-label="Customer feedback" className="mt-10 space-y-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-[#004D40]" aria-hidden="true" />
          <h2 className="font-playfair text-lg text-[#2B2B2B] tracking-wide">
            Voices from the table
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#5C5548]">
          <RatingStars rating={averageRating} size="md" />
          <span className="text-[11px] uppercase tracking-wide text-[#8A8172]">
            {feedbacks.length} {feedbacks.length === 1 ? "review" : "reviews"}
          </span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {feedbacks.map((feedback, index) => (
          <motion.article
            key={feedback.id}
            className="bg-white/90 backdrop-blur rounded-2xl border border-[#E0D9CC] p-4 shadow-sm flex flex-col gap-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#2B2B2B]">
                  {feedback.userName}
                </p>
                <p className="text-[11px] text-[#8A8172]">
                  {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </p>
              </div>
              <RatingStars rating={feedback.rating} />
            </div>
            <p className="text-sm text-[#5C5548] leading-relaxed mt-1">
              {feedback.comment}
            </p>
          </motion.article>
        ))}
      </div>

      <p className="text-[11px] text-[#8A8172] max-w-xl">
        All testimonials displayed here are sourced from mock data only as part of
        this front-end preview. No real customer information is collected or
        displayed.
      </p>
    </section>
  );
};

export default FeedbackList;