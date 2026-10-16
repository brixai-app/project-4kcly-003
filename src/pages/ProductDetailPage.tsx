import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Section, MotionButton } from '@/components/ui';
import {
  ProductImagesCarousel,
  ProductInfo,
  CustomizeLabelButton,
} from '@/components/ProductBits';
import { CustomizeLabelDrawer } from '@/components/CustomizeLabelDrawer';
import { CartDrawer } from '@/components/CartDrawer';
import {
  findProductById,
  addItemToCart,
  type CustomLabel,
  type Product,
} from '@/mock';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isCustomizeOpen, setCustomizeOpen] = React.useState(false);
  const [isCartOpen, setCartOpen] = React.useState(false);
  const [savedLabel, setSavedLabel] = React.useState<CustomLabel | null>(null);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    const p = findProductById(id);
    if (!p) {
      navigate('/shop', { replace: true });
      return;
    }
    setProduct(p);
  }, [id, navigate]);

  const handleLabelSave = (label: CustomLabel) => {
    setSavedLabel(label);
    setCustomizeOpen(false);
    toast.success('Label saved to this bottle', {
      description: 'You can still tweak it before checkout.',
    });
  };

  const handleAddToCart = async () => {
    if (!product || !savedLabel) {
      toast.error('Add a label first', {
        description: 'Customize your label before adding to cart.',
      });
      return;
    }
    setAdding(true);
    try {
      addItemToCart(product.id, 1, savedLabel);
      toast.success('Added to cart', {
        description: 'Your custom bottle is waiting in the cart.',
      });
      setCartOpen(true);
    } finally {
      setAdding(false);
    }
  };

  if (!product) return null;

  return (
    <main className="pb-16 pt-6 md:pt-10">
      <Section className="grid gap-10 rounded-[2.5rem] bg-[#FAF9F6] px-4 py-8 md:grid-cols-2 md:px-8 md:py-10">
        <ProductImagesCarousel images={product.images} />
        <div className="space-y-6">
          <ProductInfo product={product} />
          <div className="rounded-3xl bg-[#D9CBB6]/50 p-5 text-sm font-['Merriweather'] text-slate-800">
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#7A9E7E]">
              About your label
            </p>
            <p className="text-sm">
              Slide into the label studio to choose your background color, typography, and upload your
              logo. We will mock this experience in the browser — no files leave your device.
            </p>
            {savedLabel && (
              <div className="mt-3 space-y-1 text-xs text-slate-700">
                <p className="font-semibold text-[#0E4D5B]">Current label preview:</p>
                <p>Text: {savedLabel.text}</p>
                <p>Font: {savedLabel.font}</p>
              </div>
            )}
          </div>
          <CustomizeLabelButton onClick={() => setCustomizeOpen(true)} />
          <MotionButton
            onClick={handleAddToCart}
            disabled={!savedLabel || adding}
            className="w-full rounded-full bg-[#0E4D5B] py-3 text-sm font-semibold font-['Poppins'] text-[#FAF9F6] shadow-md hover:bg-[#0c404c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? 'Adding...' : !savedLabel ? 'Save a label to add to cart' : 'Add to cart'}
          </MotionButton>
        </div>
      </Section>

      <CustomizeLabelDrawer
        open={isCustomizeOpen}
        onOpenChange={setCustomizeOpen}
        product={product}
        initialLabel={savedLabel ?? undefined}
        onSave={handleLabelSave}
      />

      <CartDrawer open={isCartOpen} onOpenChange={setCartOpen} />
    </main>
  );
};

export default ProductDetailPage;