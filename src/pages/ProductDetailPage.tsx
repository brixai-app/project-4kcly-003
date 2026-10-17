import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Droplets, Sparkles } from "lucide-react";
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
import { LabelDesigner } from "@/components/LabelDesigner";
import { ReviewSection } from "@/components/ReviewSection";
import {
  ID,
  Product,
  ProductVariant,
  getProducts,
  getProductById,
  getReviews,
  getLabelDesign,
  saveLabelDesign,
  resetLabelDesign,
  addToCart,
  formatCurrency,
  getLabelPalette,
} from "@/mock";

export interface ProductDetailPageProps {
  onAddToCart?: (payload: {
    product: Product;
    variant: ProductVariant;
    quantity: number;
    designId?: ID;
  }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  onAddToCart,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = id ? getProductById(id) : undefined;
  const allProducts = getProducts();

  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = React.useState<ID | null>(
    product?.variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = React.useState<number>(12);

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.heroImage || product.gallery[0] || product.heroImage);
      setSelectedVariantId(product.variants[0]?.id ?? null);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <main className="w-full min-h-screen bg-[#15100E] text-[#F6EDE4] px-6 lg:px-12 pt-28 pb-16 flex items-center justify-center">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center gap-6">
          <p className="uppercase tracking-[0.35em] text-xs text-[#C38A5A]/70">
            Product
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
            We could not find that bottle.
          </h1>
          <Button
            variant="outline"
            className="border-[#C38A5A]/60 text-[#F6EDE4] hover:bg-[#C38A5A]/10 rounded-full px-6"
            onClick={() => navigate("/shop")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to collection
          </Button>
        </div>
      </main>
    );
  }

  const palette = getLabelPalette();
  const existingDesign = getLabelDesign(product.id);

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.tags.some(tag => product.tags.includes(tag)))
    .slice(0, 3);

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) ??
    product.variants[0];

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 6) return 6; // small minimum order size
      if (next > 960) return 960;
      return next;
    });
  };

  const handleAddToCart = (opts?: { designId?: ID }) => {
    if (!selectedVariant) return;

    const designToUse = opts?.designId
      ? getLabelDesign(product.id)
      : existingDesign ?? undefined;

    const added = addToCart(product.id, selectedVariant.id, quantity, designToUse);

    if (added && onAddToCart) {
      onAddToCart({
        product,
        variant: selectedVariant,
        quantity,
        designId: designToUse?.id,
      });
    }
  };

  const heroBackground = product.baseColor || "#C38A5A";

  return (
    <main className="w-full min-h-screen bg-[#15100E] text-[#F6EDE4]">
      {/* Hero + Gallery Section */}
      <section className="w-full pt-24 pb-20 md:pb-24 lg:pb-28">
        <div
          className="w-full min-h-[70vh] relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(190,129,76,0.4), transparent 55%), radial-gradient(circle at bottom right, rgba(68,42,28,0.9), #15100E)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40" />

          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-14 lg:gap-16 items-start pt-10 pb-12">
            {/* Left: gallery */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6">
              <motion.div
                key={activeImage || product.heroImage}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-[#F6EDE4]/10 bg-[#1E1510] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center scale-105"
                  style={{
                    backgroundImage: `url(${activeImage || product.heroImage})`,
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#15100E] via-[#15100E]/60 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#F6EDE4]/60">
                    <div
                      className="h-5 w-5 rounded-full border border-[#F6EDE4]/40 shadow-inner"
                      style={{ backgroundColor: heroBackground }}
                      aria-hidden
                    />
                    <span>{product.tags.join(" • ")}</span>
                  </div>
                  <Badge className="bg-[#F6EDE4]/90 text-[#2B2018] rounded-full px-3 py-1 text-[10px] tracking-[0.22em] uppercase border border-[#C38A5A]/40">
                    Custom label ready
                  </Badge>
                </div>
              </motion.div>

              <div className="flex gap-3 overflow-x-auto pb-1 mt-1">
                {[product.heroImage, ...product.gallery].map((img, index) => (
                  <motion.button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`relative aspect-[3/4] w-20 md:w-24 shrink-0 rounded-2xl overflow-hidden border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B58E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15100E] ${
                      activeImage === img
                        ? "border-[#E3B58E]"
                        : "border-[#F6EDE4]/10 hover:border-[#F6EDE4]/40"
                    }`}
                    aria-label={
                      index === 0
                        ? "Primary bottle view"
                        : `Bottle detail view ${index}`
                    }
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                    {activeImage === img && (
                      <div className="absolute inset-0 ring-2 ring-[#E3B58E] ring-offset-2 ring-offset-[#15100E]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right: details + variants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              className="w-full lg:w-1/2 flex flex-col gap-8 lg:gap-10"
            >
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.26em] uppercase text-[#F6EDE4]/60 hover:text-[#F6EDE4] transition-colors w-fit"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                <div className="space-y-3">
                  <p className="text-xs md:text-[11px] tracking-[0.28em] uppercase text-[#C38A5A]/90">
                    Nishant Waters collection
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm md:text-base text-[#F6EDE4]/80 max-w-xl">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl md:text-2xl font-semibold text-[#F6EDE4]">
                      {formatCurrency(selectedVariant.priceCents)}
                    </span>
                    <span className="text-xs text-[#F6EDE4]/60 tracking-[0.18em] uppercase">
                      per bottle
                    </span>
                  </div>
                  <Separator className="h-5 bg-[#F6EDE4]/10" orientation="vertical" />
                  <p className="text-xs text-[#F6EDE4]/60 tracking-[0.2em] uppercase">
                    Minimum order • 6 bottles
                  </p>
                </div>
              </div>

              {/* Variant selectors */}
              <Card className="bg-[#1B130F]/80 border-[#F6EDE4]/10 text-[#F6EDE4] rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm md:text-base tracking-[0.22em] uppercase text-[#F6EDE4]/70 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-[#E3B58E]" />
                    Choose your bottle expression
                  </CardTitle>
                  <CardDescription className="text-xs text-[#F6EDE4]/60 max-w-md">
                    Select volume, cap finish, and label sheen. Each variant is tuned for different tables and lighting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Variant list */}
                  <div className="flex flex-col gap-3">
                    {product.variants.map(variant => {
                      const isActive = variant.id === selectedVariant.id;
                      return (
                        <motion.button
                          key={variant.id}
                          type="button"
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3B58E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15100E] ${
                            isActive
                              ? "border-[#E3B58E] bg-[#201510]/90"
                              : "border-[#F6EDE4]/15 bg-[#130D0A]/60 hover:bg-[#1A110C] hover:border-[#F6EDE4]/35"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">
                              {variant.sizeMl}ml · {variant.capColor}
                            </p>
                            <p className="text-[11px] tracking-[0.2em] uppercase text-[#F6EDE4]/60">
                              {variant.labelFinish} label · {variant.stock} in mock stock
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-semibold">
                              {formatCurrency(variant.priceCents)}
                            </span>
                            {isActive && (
                              <Badge className="bg-[#E3B58E] text-[#2B2018] rounded-full px-2 py-0.5 text-[10px] tracking-[0.2em] uppercase border-0">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs tracking-[0.2em] uppercase text-[#F6EDE4]/70">
                        Order quantity
                      </p>
                      <p className="text-xs text-[#F6EDE4]/60">
                        {quantity} bottles · {formatCurrency(selectedVariant.priceCents * quantity)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-[#F6EDE4]/30 text-[#F6EDE4] bg-transparent hover:bg-[#F6EDE4]/10"
                        onClick={() => handleQuantityChange(-6)}
                        aria-label="Decrease quantity"
                      >
                        -6
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-[#F6EDE4]/30 text-[#F6EDE4] bg-transparent hover:bg-[#F6EDE4]/10"
                        onClick={() => handleQuantityChange(-1)}
                        aria-label="Decrease quantity by one"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center text-sm tracking-[0.18em] uppercase text-[#F6EDE4]/80">
                        {quantity} bottles
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-[#F6EDE4]/30 text-[#F6EDE4] bg-transparent hover:bg-[#F6EDE4]/10"
                        onClick={() => handleQuantityChange(1)}
                        aria-label="Increase quantity by one"
                      >
                        +
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-[#F6EDE4]/30 text-[#F6EDE4] bg-transparent hover:bg-[#F6EDE4]/10"
                        onClick={() => handleQuantityChange(6)}
                        aria-label="Increase quantity"
                      >
                        +6
                      </Button>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3 pt-2">
                    <Button
                      type="button"
                      className="flex-1 h-11 rounded-full bg-[#E3B58E] text-[#2B2018] hover:bg-[#F0C89D] text-xs tracking-[0.22em] uppercase shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      onClick={() => handleAddToCart()}
                    >
                      Add to cart
                    </Button>
                    <p className="text-[11px] text-[#F6EDE4]/60 max-w-xs">
                      This is a 100% frontend-only mock checkout — all orders live only in your browser.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xs tracking-[0.26em] uppercase text-[#F6EDE4]/60">
                  Notes from the studio
                </h2>
                <p className="text-sm md:text-[15px] leading-relaxed text-[#F6EDE4]/80 max-w-xl">
                  {product.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Label designer section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-[#1A120E] border-t border-[#F6EDE4]/10">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          <div className="w-full lg:w-5/12 space-y-4 md:space-y-5">
            <p className="text-xs tracking-[0.26em] uppercase text-[#C38A5A]/90 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Label studio
            </p>
            <h2 className="text-2xl md:text-3xl font-serif tracking-tight">
              Write your name into the glass.
            </h2>
            <p className="text-sm md:text-[15px] text-[#F6EDE4]/80 max-w-md">
              Choose a palette from our brandy-toned colours, set your typography, and preview how your message sits on the bottle. Designs and cart items are mocked and saved only to your local browser storage.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {palette
                .filter(color => product.labelPaletteIds.includes(color.id))
                .map(color => (
                  <div key={color.id} className="flex items-center gap-2 text-[11px] text-[#F6EDE4]/70">
                    <span
                      className="h-4 w-4 rounded-full border border-[#F6EDE4]/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full lg:flex-1">
            <LabelDesigner
              productId={product.id}
              productName={product.name}
              bottleImage={product.heroImage}
              existingDesign={existingDesign}
              onSaveDesign={(design) => saveLabelDesign(product.id, design)}
              onResetDesign={() => resetLabelDesign(product.id)}
              onAddCustomizedToCart={(design) => {
                const persisted = saveLabelDesign(product.id, design);
                if (!selectedVariant) return;
                const added = addToCart(product.id, selectedVariant.id, quantity, persisted);
                if (added && onAddToCart) {
                  onAddToCart({
                    product,
                    variant: selectedVariant,
                    quantity,
                    designId: persisted.id,
                  });
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className="w-full py-14 md:py-18 lg:py-20 bg-[#15100E] border-t border-[#F6EDE4]/10">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <ReviewSection productId={product.id} reviews={getReviews(product.id)} />
        </div>
      </section>

      {/* Related products strip */}
      {relatedProducts.length > 0 && (
        <section className="w-full py-12 md:py-14 lg:py-16 bg-[#1E1510] border-t border-[#F6EDE4]/10">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-[#C38A5A]/80">
                  Nearby in the collection
                </p>
                <h2 className="mt-2 text-xl md:text-2xl font-serif tracking-tight">
                  Bottles that share its language.
                </h2>
              </div>
              <Button
                variant="outline"
                className="border-[#F6EDE4]/30 text-[#F6EDE4] hover:bg-[#F6EDE4]/10 rounded-full px-5 h-9 text-[11px] tracking-[0.2em] uppercase"
                onClick={() => navigate("/shop")}
              >
                View full collection
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
              {relatedProducts.map(rel => (
                <motion.button
                  key={rel.id}
                  type="button"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  className="text-left group"
                >
                  <Card className="h-full bg-[#160F0B] border-[#F6EDE4]/10 rounded-3xl overflow-hidden flex flex-col">
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${rel.heroImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#15100E] via-transparent to-transparent" />
                    </div>
                    <CardContent className="flex-1 flex flex-col justify-between px-4 py-4 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs tracking-[0.24em] uppercase text-[#F6EDE4]/60">
                          {rel.tags.join(" • ")}
                        </p>
                        <h3 className="text-sm md:text-base font-serif tracking-tight">
                          {rel.name}
                        </h3>
                        <p className="text-[11px] text-[#F6EDE4]/70 line-clamp-2">
                          {rel.shortDescription}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-[#F6EDE4]">
                          {formatCurrency(rel.variants[0]?.priceCents ?? 0)}
                        </span>
                        <span className="text-[10px] tracking-[0.22em] uppercase text-[#F6EDE4]/50 flex items-center gap-1">
                          View detail
                          <ChevronLeft className="h-3 w-3 rotate-180" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetailPage;