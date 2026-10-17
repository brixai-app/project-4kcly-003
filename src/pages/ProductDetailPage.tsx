import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Truck, Droplet, ArrowLeft } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Separator,
} from "@/components/ui/shadcn";

import {
  useProduct,
  formatMoney,
  getLabelColorById,
  addToCart,
  LABEL_COLOR_KEYS,
  BRANDY_PALETTE,
  type ProductSKU,
} from "@/mock";

import LabelCustomizer from "@/components/LabelCustomizer";
import ReviewSection from "@/components/ReviewSection";
import { showToastError, showToastSuccess } from "@/components/ToastProvider";

// NOTE: This page is fully frontend-only and relies on mock data & operations
// defined in src/mock.ts. There is no backend or real checkout.

const heroVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const galleryVariant = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
};

const detailsVariant = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
};

const actionVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const alertVariant = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const warmGradientBg =
  "bg-[radial-gradient(circle_at_top,_#f2c29b_0,_#f7f1e8_38%,_#f3e6d6_70%,_#f7f1e8_100%)]";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product: ProductSKU | undefined = useProduct(id);

  const [selectedImage, setSelectedImage] = useState<"primary" | "secondary">(
    "primary"
  );

  const initialLabelId = useMemo(() => {
    if (!product) return undefined;
    const preferredKey = LABEL_COLOR_KEYS[2]; // usually amber / brandy gold
    const preferred = product.labelColors.find((c) => c.key === preferredKey);
    return preferred?.id ?? product.labelColors[0]?.id;
  }, [product]);

  const [selectedLabelId, setSelectedLabelId] = useState<string | undefined>(
    initialLabelId
  );

  const activeLabel = useMemo(
    () => (selectedLabelId ? getLabelColorById(selectedLabelId) : undefined),
    [selectedLabelId]
  );

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedLabelId) {
      showToastError("Choose a label tone", "Select a label color to continue.");
      return;
    }

    const added = addToCart({
      productId: product.id,
      labelColorId: selectedLabelId,
      quantity: product.minOrderQty,
    });

    if (!added) {
      showToastError(
        "We couldn't add that just now",
        "Try again, or adjust your selection first."
      );
      return;
    }

    const labelName = activeLabel?.name ?? "Selected label";

    showToastSuccess(
      "Added to your cart",
      `${product.name} · ${labelName} • ${product.minOrderQty} bottles`
    );
  };

  if (!product) {
    return (
      <div
        className={`w-full min-h-[60vh] flex items-center justify-center bg-[${BRANDY_PALETTE.cream}] px-6 lg:px-12`}
      >
        <motion.div
          variants={alertVariant}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[720px] mx-auto"
        >
          <Card className="border-amber/30 bg-[rgba(247,241,232,0.96)] backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-start gap-3">
              <div className="mt-1">
                <AlertTriangle className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="font-['Playfair_Display'] text-xl text-amber-900">
                  Bottle not found
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-amber-900/80">
                  The bottle you were looking for has slipped back into the
                  archive, or the link has changed.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0 pb-4 px-6">
              <Button
                variant="outline"
                className="border-amber-300 text-amber-900 hover:bg-amber-100/70 hover:text-amber-950 rounded-full px-4"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to where I was
              </Button>
              <Button
                className="bg-amber-700 text-amber-50 hover:bg-amber-800 rounded-full px-4"
                onClick={() => navigate("/catalog")}
              >
                Browse the collection
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const primaryImage = product.imageUrl;
  const secondaryImage = product.secondaryImageUrl ?? product.imageUrl;

  return (
    <div className="w-full min-h-screen bg-[color:var(--page-bg,#f7f1e8)]">
      {/* HERO / DETAIL SECTION */}
      <section
        className={`w-full ${warmGradientBg} py-10 md:py-16 lg:py-20 relative overflow-hidden`}
      >
        {/* Subtle vignette overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.04)] to-[rgba(0,0,0,0.08)]" />

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Breadcrumb-ish hint */}
          <div className="mb-6 flex items-center gap-2 text-xs tracking-wide uppercase text-amber-900/70">
            <button
              type="button"
              onClick={() => navigate("/catalog")}
              className="hover:text-amber-900 underline-offset-4 hover:underline transition-colors"
            >
              Collection
            </button>
            <span className="text-amber-900/50">/</span>
            <span className="text-amber-900/80">{product.name}</span>
          </div>

          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.08 }}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-start"
          >
            {/* Gallery */}
            <motion.div
              variants={galleryVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[rgba(148,81,39,0.20)] bg-[rgba(247,241,232,0.9)] shadow-[0_24px_80px_rgba(91,52,32,0.35)]">
                <motion.img
                  key={selectedImage}
                  src={selectedImage === "primary" ? primaryImage : secondaryImage}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />

                {/* Label preview band */}
                {activeLabel && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className="pointer-events-none absolute inset-x-[18%] bottom-[15%] h-[16%] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-black/10 overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundColor: activeLabel.hex,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center text-[0.75rem] tracking-[0.18em] text-amber-950/90 uppercase">
                      <span className="font-['Playfair_Display'] text-[0.85rem] tracking-[0.22em]">
                        Nishant Waters
                      </span>
                      <span className="opacity-80 mt-1">
                        {activeLabel.name}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedImage("primary")}
                  className={`group relative aspect-[4/5] w-24 sm:w-28 overflow-hidden rounded-2xl border transition-colors ${
                    selectedImage === "primary"
                      ? "border-amber-700"
                      : "border-[rgba(145,75,26,0.3)] hover:border-amber-600"
                  }`}
                >
                  <img
                    src={primaryImage}
                    alt={`${product.name} main view`}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedImage("secondary")}
                  className={`group relative aspect-[4/5] w-24 sm:w-28 overflow-hidden rounded-2xl border transition-colors ${
                    selectedImage === "secondary"
                      ? "border-amber-700"
                      : "border-[rgba(145,75,26,0.3)] hover:border-amber-600"
                  }`}
                >
                  <img
                    src={secondaryImage}
                    alt={`${product.name} alternate view`}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </button>
              </div>
            </motion.div>

            {/* Details and customizer */}
            <motion.div
              variants={detailsVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6 lg:space-y-7"
            >
              <div className="space-y-3">
                <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-[2.85rem] leading-tight text-amber-950">
                  {product.name}
                </h1>
                <p className="text-sm tracking-[0.22em] uppercase text-amber-900/70">
                  Custom labeled water · {product.capacityMl}ml · Minimum {" "}
                  {product.minOrderQty} bottles
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-amber-950">
                    {formatMoney(product.price)}
                  </span>
                  <span className="text-xs text-amber-900/70 tracking-wide uppercase">
                    per bottle
                  </span>
                </div>
                <Badge className="rounded-full bg-[rgba(148,81,39,0.08)] text-amber-900 border border-[rgba(148,81,39,0.42)] px-3 py-1 text-[0.7rem] tracking-[0.18em] uppercase">
                  MOQ {product.minOrderQty} · {formatMoney(product.price * product.minOrderQty)} starting
                </Badge>
              </div>

              <p className="text-sm sm:text-[0.95rem] leading-relaxed text-amber-950/80">
                {product.description}
              </p>

              <Card className="border-[rgba(148,81,39,0.25)] bg-[rgba(247,241,232,0.9)] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium tracking-[0.19em] uppercase text-amber-900/70">
                    Label tone & preview
                  </CardTitle>
                  <CardDescription className="text-xs text-amber-900/80">
                    Choose a background color for your label band. Typography,
                    illustration, and finishes are refined with our team later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-1">
                  <LabelCustomizer
                    value={selectedLabelId}
                    onChange={setSelectedLabelId}
                    availableColors={product.labelColors}
                  />
                </CardContent>
              </Card>

              <Card className="border-[rgba(148,81,39,0.28)] bg-[rgba(243,230,214,0.9)]">
                <CardContent className="py-3.5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-800/90 flex items-center justify-center text-amber-50 shadow-md">
                      <Truck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-[0.17em] uppercase text-amber-950/80">
                        Lead time & shipping
                      </p>
                      <p className="text-xs text-amber-950/75">
                        Mocked for this MVP: we simulate a 10–14 day lead time
                        from artwork approval for continental US shipments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[0.7rem] text-amber-950/75">
                    <Droplet className="h-3.5 w-3.5" />
                    <span>Carefully bottled at source and labeled to order.</span>
                  </div>
                </CardContent>
              </Card>

              <Separator className="bg-[rgba(91,52,32,0.22)]" />

              <motion.div
                variants={actionVariant}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button
                  onClick={handleAddToCart}
                  className="rounded-full bg-amber-800 text-amber-50 hover:bg-amber-900 px-6 py-2.5 text-sm tracking-[0.18em] uppercase shadow-[0_16px_40px_rgba(91,52,32,0.45)]"
                >
                  Add to cart · {product.minOrderQty} bottles
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="text-xs tracking-[0.22em] uppercase text-amber-950/80 hover:text-amber-950 underline-offset-4 hover:underline transition-colors"
                >
                  Or continue to a simulated checkout
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* REVIEW SECTION */}
      <section className="w-full bg-[color:var(--cream-section,#f7f1e8)] py-12 md:py-16 lg:py-20 border-t border-[rgba(145,75,26,0.18)]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <ReviewSection productId={product.id} />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;