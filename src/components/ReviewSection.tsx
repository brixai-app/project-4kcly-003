import React from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Badge,
} from "@/components/ui/shadcn";
import type { ID, Review } from "@/mock";

export interface ReviewSectionProps {
  productId: ID;
  reviews: Review[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

function computeAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
}

function getRatingLabel(rating: number): string {
  if (!rating) return "No ratings yet";
  return `${rating.toFixed(1)} out of 5 stars`;
}

interface StarsProps {
  rating: number; // 0-5
  size?: number;
}

const Stars: React.FC<StarsProps> = ({ rating, size = 18 }) => {
  const rounded = Math.round(rating * 2) / 2;
  const fullCount = Math.floor(rounded);
  const hasHalf = rounded - fullCount === 0.5;

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFull = index < fullCount;
        const isHalf = !isFull && hasHalf && index === fullCount;
        const isEmpty = !isFull && !isHalf;

        const baseClasses =
          "transition-colors duration-200";

        let colorClass = "text-[#C17D4B]"; // warm brandy tone
        if (isEmpty) colorClass = "text-stone-300 dark:text-stone-600";

        if (isHalf) {
          // Half star via gradient mask
          return (
            <div
              key={index}
              className="relative flex h-4 w-4 items-center justify-center"
            >
              <Star
                size={size}
                className={`absolute left-0 top-0 h-full w-full text-stone-300 dark:text-stone-600 ${baseClasses}`}
              />
              <Star
                size={size}
                className={`absolute left-0 top-0 h-full w-full ${baseClasses}`}
                style={{
                  color: "#C17D4B",
                  clipPath: "inset(0 50% 0 0)",
                }}
              />
            </div>
          );
        }

        return (
          <Star
            key={index}
            size={size}
            className={`h-4 w-4 ${baseClasses} ${colorClass}`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -120px 0px",
  });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const average = computeAverageRating(reviews);
  const ratingLabel = getRatingLabel(average);

  return (
    <section
      id="reviews"
      aria-labelledby={`reviews-heading-${productId}`}
      className="w-full border-t border-stone-200 bg-[#F6EFE8]/70 py-12 text-stone-900 dark:border-stone-700 dark:bg-[#1C1410]"
    >
      <div className="w-full max-w-[1600px] px-6 lg:px-12 mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                id={`reviews-heading-${productId}`}
                className="text-2xl font-semibold tracking-tight text-stone-900 drop-shadow-sm md:text-3xl dark:text-stone-50 font-['Playfair_Display']"
              >
                Quiet impressions from the table
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                Every bottle leaves a small note on the experience. These are a few from studios,
                dining rooms, and rooms that chose to pour with Nishant Waters.
              </p>
            </div>

            <Card className="flex max-w-md flex-1 flex-col border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/70">
              <CardContent className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <Stars rating={average} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-50">
                      {average ? average.toFixed(1) : "—"}
                    </span>
                    <span className="text-xs text-stone-600 dark:text-stone-400">
                      {reviews.length > 0
                        ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}`
                        : "No reviews yet"}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#C17D4B]/40 bg-[#F7EAE0]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#5C3B28] dark:border-[#C17D4B]/60 dark:bg-[#2B1A13] dark:text-[#F6EFE8]"
                  aria-label={ratingLabel}
                >
                  Verified trade clients
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Separator className="mt-8 border-stone-200 dark:border-stone-700" />

          {reviews.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white/50 px-6 py-8 text-sm text-stone-600 shadow-sm dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-300">
              There are no stories here yet. Be the first to pour this bottle into your space and
              write the first note.
            </div>
          ) : (
            <motion.div
              className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              variants={listVariants}
              initial="hidden"
              animate={controls}
            >
              {reviews.map((review) => (
                <motion.article key={review.id} variants={itemVariants}>
                  <Card className="flex h-full flex-col border-stone-200 bg-white/90 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-stone-700 dark:bg-stone-900/70">
                    <CardHeader className="flex flex-row items-start gap-4 px-4 pb-3 pt-4 sm:px-5">
                      <Avatar className="h-9 w-9 rounded-full border border-stone-200 bg-[#F4E4D6] text-xs uppercase text-[#5C3B28] shadow-sm dark:border-stone-700 dark:bg-[#3B2417] dark:text-[#F6EFE8]">
                        <AvatarImage
                          src={""}
                          alt={`${review.userInitials} avatar`}
                        />
                        <AvatarFallback className="font-medium">
                          {review.userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="line-clamp-1 text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                            {review.userName}
                          </CardTitle>
                          <Stars rating={review.rating} size={14} />
                        </div>
                        <CardDescription className="text-[11px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-1 sm:px-5">
                      <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                        {review.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">
                        {review.body}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                        <Quote className="h-3 w-3 text-[#C17D4B]" aria-hidden="true" />
                        <span>Service impressions</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewSection;