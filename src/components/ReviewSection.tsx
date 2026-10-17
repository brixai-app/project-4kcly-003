import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  AvatarFallback,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Separator,
} from "@/components/ui/shadcn";
import { BRANDY_PALETTE, Review, useMockStore } from "@/mock";

// NOTE: This component consumes fully mocked review data from src/mock.ts.
// There is no backend – all reviews and ratings are frontend-only mocks with
// localStorage persistence handled by the mock store.

// ------- Helpers -------

type ReviewSortKey = "recent" | "rating";

const sortReviews = (reviews: Review[], sort: ReviewSortKey): Review[] => {
  const copy = [...reviews];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || (a.createdAt < b.createdAt ? 1 : -1));
    case "recent":
    default:
      return copy.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
};

const computeAverageRating = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((total, r) => total + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

const ratingLabel = (rating: number): string => {
  if (rating >= 4.8) return "Loved";
  if (rating >= 4.3) return "Warmly reviewed";
  if (rating >= 4) return "Well regarded";
  return "Guest rated";
};

// ------- Component -------

export interface ReviewSectionProps {
  /** Optional product id – when provided, shows reviews specific to that SKU. */
  productId?: string;
  /** Optional heading override; defaults vary for brand vs. product context. */
  heading?: string;
  /** Optional flag to tone down padding when nested tightly in layouts. */
  compact?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  heading,
  compact,
}) => {
  const allReviews = useMockStore((s) =>
    productId ? s.reviews.filter((r) => r.productId === productId) : s.reviews
  );

  const [sort, setSort] = React.useState<ReviewSortKey>("recent");

  const visibleReviews = React.useMemo(() => {
    // Limit to 6 for visual rhythm
    return sortReviews(allReviews, sort).slice(0, 6);
  }, [allReviews, sort]);

  const average = computeAverageRating(allReviews);
  const totalCount = allReviews.length;

  if (!totalCount) {
    return null;
  }

  const sectionHeading =
    heading || (productId ? "Voices from the table" : "What hosts are saying");

  return (
    <section
      className="w-full bg-[radial-gradient(circle_at_top,_#f7f1e8,_#f3e6d6)] border-t border-[#e3d3c0]"
      aria-labelledby="reviews-heading"
    >
      <div
        className={`w-full mx-auto max-w-[1600px] px-6 lg:px-12 ${
          compact ? "py-10 lg:py-14" : "py-14 lg:py-20"
        }`}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Summary column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md space-y-6"
          >
            <div className="inline-flex items-center rounded-full bg-[#f0e0cc]/80 px-3 py-1 text-xs font-medium tracking-wide text-[#5b3420] shadow-sm">
              <Quote className="mr-1.5 h-3 w-3" />
              Verified hosts & studios
            </div>

            <div>
              <h2
                id="reviews-heading"
                className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#2b211a]"
              >
                {sectionHeading}
              </h2>
              <p className="mt-3 max-w-prose text-sm sm:text-base text-[#5b3420]/90">
                Every bottle leaves our studio with a story attached. These are some of
                the notes that have circled back to us from tables, suites, and
                gallery floors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e0cfba] bg-[#fdf8f1]/80 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.round(average)
                          ? "text-[#d28c45] fill-[#d28c45]"
                          : "text-[#e2cfb8]"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-[#2b211a]">
                    {average.toFixed(1)}
                  </span>
                  <span className="mx-1 text-[#c6ac8e]">•</span>
                  <span className="text-[#5b3420]/80">
                    {ratingLabel(average)} by {totalCount} {" "}
                    {totalCount === 1 ? "client" : "clients"}
                  </span>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden h-7 bg-[#e0cfba] sm:block" />

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5b3420]/80">
                <span className="hidden sm:inline">Sort</span>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as ReviewSortKey)}
                >
                  <SelectTrigger className="h-8 w-40 border-[#e0cfba] bg-white/80 text-xs text-[#2b211a] shadow-sm focus-visible:ring-[#d28c45]">
                    <SelectValue placeholder="Most recent" />
                  </SelectTrigger>
                  <SelectContent className="border-[#e0cfba] bg-[#fdf8f1] text-xs text-[#2b211a]">
                    <SelectItem value="recent">Most recent</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Reviews grid */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.04 * index,
                }}
                className="h-full"
              >
                <Card
                  className="flex h-full flex-col border-[#e0cfba] bg-white/90 shadow-sm transition-colors duration-200 hover:border-[#d28c45]/70"
                >
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <Avatar className="h-9 w-9 border border-[#e0cfba] bg-[#f7f1e8]">
                      {/* No realistic photos; rely on initials from mock data */}
                      <AvatarFallback className="text-xs font-medium text-[#5b3420]">
                        {review.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#2b211a]">
                            {review.name}
                          </p>
                          <p className="text-xs text-[#9b7c5b]">
                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-[#f7e7d3] px-2 py-0.5 text-xs font-semibold text-[#5b3420]">
                          <Star className="h-3 w-3 text-[#d28c45] fill-[#d28c45]" />
                          <span>{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      {review.title && (
                        <CardTitle className="mt-2 line-clamp-2 text-sm font-semibold text-[#2b211a]">
                          {review.title}
                        </CardTitle>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm leading-relaxed text-[#5b3420]/90">
                    <p className="line-clamp-5">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;