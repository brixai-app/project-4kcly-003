import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Info, Palette, Ruler, Sparkles } from "lucide-react";
import { products } from "../mock";
import { Container } from "../components/layout/Container";
import { PageTransition } from "../components/layout/PageTransition";
import { ProductImagesCarousel } from "../components/product/ProductImagesCarousel";
import { SizeSelector } from "../components/product/SizeSelector";
import { ColorSelector } from "../components/product/ColorSelector";
import { MotionButton } from "../components/ui/MotionButton";
import { Price } from "../components/ui/Price";
import { LabelDesignDrawer } from "../components/labelDesigner/LabelDesignDrawer";
import { useCartStore } from "../state/cartStore";
import { tokens } from "../theme/tokens";
import { LabelDesignState } from "../components/labelDesigner/labelDesignModel";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = useMemo(
    () => products.find((p) => p.id === id),
    [id]
  );

  const addItem = useCartStore((s) => s.addItem);

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [labelDesign, setLabelDesign] = useState<LabelDesignState | null>(null);

  if (!product) {
    return (
      <PageTransition>
        <Container className="py-20">
          <div className="rounded-[12px] bg-[color:var(--nw-panel)] p-8 text-[color:var(--nw-ink)] shadow">
            <h1
              className="font-heading text-2xl"
              style={{ fontFamily: tokens.fonts.heading }}
            >
              Bottle not found.
            </h1>
            <p
              className="mt-2 text-sm text-[color:var(--nw-ink-soft)]"
              style={{ fontFamily: tokens.fonts.body }}
            >
              This product lives only inside our mock catalog, and something went off.
              Try returning to the shop to explore the available silhouettes.
            </p>
            <MotionButton
              variant="secondary"
              className="mt-4"
              onClick={() => navigate("/shop")}
            >
              Back to shop
            </MotionButton>
          </div>
        </Container>
      </PageTransition>
    );
  }

  const handleAddToCart = () => {
    if (!size || !color) {
      toast.error("Choose a size and color before adding to cart.");
      return;
    }

    if (product.customizableLabel && !labelDesign) {
      toast.error("Add at least one label element before saving to cart.");
      setDesignerOpen(true);
      return;
    }

    addItem({
      productId: product.id,
      quantity: 1,
      selectedSize: size,
      selectedColor: color,
      customLabelDesign: labelDesign ?? undefined,
    });

    toast.success("Added to your cart.");
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[color:var(--nw-bg)] pb-16 pt-8 md:pt-10">
        <Container className="grid gap-10 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
          <section className="space-y-5">
            <ProductImagesCarousel images={product.images} />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-[12px] bg-[color:var(--nw-panel)] p-5 text-sm text-[color:var(--nw-ink-soft)] shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2 text-[color:var(--nw-ink)]">
                <Info className="h-4 w-4 text-[color:var(--nw-accent-muted)]" />
                <span className="font-medium">Material story</span>
              </div>
              <p style={{ fontFamily: tokens.fonts.body }}>
                Every detail in this mock product has been tuned to communicate warmth:
                a satin finish, slightly rounded shoulders, and a label proportioned to
                frame your typography. In the future, this section can pull live
                attributes from a real backend.
              </p>
            </motion.div>
          </section>

          <section className="space-y-6">
            <header>
              <p className="text-xs font-medium tracking-[0.2em] text-[color:var(--nw-accent-muted)] uppercase">
                Nishant Waters
              </p>
              <h1
                className="mt-2 font-heading text-2xl text-[color:var(--nw-ink)] sm:text-3xl"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                {product.name}
              </h1>
              <div className="mt-3 flex items-center justify-between gap-4">
                <Price value={product.basePrice} className="text-xl" />
                {product.customizableLabel && (
                  <span className="inline-flex items-center gap-1 rounded-[999px] bg-[color:var(--nw-terracotta-soft)] px-3 py-1 text-[10px] font-medium text-[color:var(--nw-terracotta-strong)]">
                    <Sparkles className="h-3 w-3" /> Custom label ready
                  </span>
                )}
              </div>
            </header>

            <p
              className="text-sm text-[color:var(--nw-ink-soft)]"
              style={{ fontFamily: tokens.fonts.body }}
            >
              {product.description}
            </p>

            <div className="space-y-4 rounded-[12px] bg-[color:var(--nw-panel)] p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--nw-ink)]">
                <Ruler className="h-4 w-4 text-[color:var(--nw-accent-muted)]" />
                <span>Sizing</span>
              </div>
              <SizeSelector
                sizes={product.availableSizes}
                value={size}
                onChange={setSize}
              />

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[color:var(--nw-ink)]">
                <Palette className="h-4 w-4 text-[color:var(--nw-accent-muted)]" />
                <span>Color story</span>
              </div>
              <ColorSelector
                colors={product.availableColors}
                value={color}
                onChange={setColor}
              />
            </div>

            {product.customizableLabel && (
              <div className="space-y-3 rounded-[12px] bg-[color:var(--nw-panel)] p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2
                      className="font-heading text-sm text-[color:var(--nw-ink)]"
                      style={{ fontFamily: tokens.fonts.heading }}
                    >
                      Label design
                    </h2>
                    <p
                      className="mt-1 text-xs text-[color:var(--nw-ink-soft)]"
                      style={{ fontFamily: tokens.fonts.body }}
                    >
                      Add text, mock imagery, and color planes in a dedicated
                      slide-over studio. Designs are stored only in your browser.
                    </p>
                  </div>
                  <LabelDesignDrawer
                    open={designerOpen}
                    onOpenChange={setDesignerOpen}
                    initialDesign={labelDesign ?? undefined}
                    onSave={(design) => setLabelDesign(design)}
                  />
                </div>
                {labelDesign ? (
                  <p className="text-[11px] text-[color:var(--nw-ink-soft)]">
                    Design saved with {labelDesign.elements.length} element
                    {labelDesign.elements.length === 1 ? "" : "s"}. You can always
                    reopen the studio before checkout.
                  </p>
                ) : (
                  <p className="text-[11px] text-[color:var(--nw-ink-soft)]">
                    You&apos;ll need at least one text or image element in your label
                    before adding this bottle to the cart.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-[12px] bg-[color:var(--nw-panel)] p-5 shadow-sm">
              <MotionButton
                variant="primary"
                className="w-full justify-center rounded-[999px] py-2.5 text-sm font-semibold"
                onClick={handleAddToCart}
              >
                Add to cart
              </MotionButton>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full rounded-[999px] border border-[color:var(--nw-border-soft)] px-4 py-2 text-xs font-medium text-[color:var(--nw-ink)] hover:border-[color:var(--nw-accent)] hover:text-[color:var(--nw-accent)]"
              >
                Go to checkout
              </button>
              <p className="mt-1 text-[10px] text-[color:var(--nw-ink-soft)]">
                Checkout is fully mocked in this MVP: no real payments or orders are
                processed. Everything stays safely inside your browser.
              </p>
            </div>
          </section>
        </Container>
      </main>
    </PageTransition>
  );
};

export default ProductDetailPage;