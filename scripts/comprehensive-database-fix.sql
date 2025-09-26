-- Minimal fixes for existing Clayfable database schema
-- Only add missing columns and constraints needed for admin system

-- 1. Add missing columns to categories table
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- 2. Add missing columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS youtube_playlist_id TEXT,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false;

-- 3. Fix cart_items unique constraint to include variant_id
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_unique_item
UNIQUE(user_id, product_id, variant_id);

-- 4. Add missing columns to order_items for better tracking
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id),
ADD COLUMN IF NOT EXISTS product_snapshot JSONB;

-- 5. Update profiles to match your API expectations
-- (Your profiles table already has most needed columns)

-- 6. Create function for order number generation (if not exists)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD' || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 7. Add trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON public.orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- 8. Update RLS policies to work with your auth system
-- Assuming you're using Supabase auth.users, update policies:

-- Categories policies
DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "categories_admin_all" ON public.categories;
CREATE POLICY "categories_admin_all" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Products policies
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "products_admin_all" ON public.products;
CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Orders policies
DROP POLICY IF EXISTS "orders_user_own" ON public.orders;
CREATE POLICY "orders_user_own" ON public.orders FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Cart items policies
DROP POLICY IF EXISTS "cart_items_user_own" ON public.cart_items;
CREATE POLICY "cart_items_user_own" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_admin_all" ON public.cart_items;
CREATE POLICY "cart_items_admin_all" ON public.cart_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Product variants policies
DROP POLICY IF EXISTS "product_variants_public_read" ON public.product_variants;
CREATE POLICY "product_variants_public_read" ON public.product_variants FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "product_variants_admin_all" ON public.product_variants;
CREATE POLICY "product_variants_admin_all" ON public.product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- 9. Ensure RLS is enabled on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 10. Add helpful indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_orders_created_desc ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_inventory ON public.products(inventory_quantity);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- 11. Insert sample categories if none exist
INSERT INTO public.categories (name, slug, description, is_active)
VALUES
  ('Terracotta Cookware', 'terracotta-cookware', 'Traditional clay cooking vessels', true),
  ('Decorative Items', 'decorative-items', 'Beautiful terracotta decorations', true),
  ('Garden Pots', 'garden-pots', 'Pots for your garden plants', true)
ON CONFLICT (slug) DO NOTHING;