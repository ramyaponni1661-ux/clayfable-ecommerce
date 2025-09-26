-- Fix database schema by adding missing columns in proper order

-- Step 1: Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT false;

-- Step 2: Create product_variants table first (before referencing it)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2),
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  position INTEGER DEFAULT 0,
  option1 TEXT,
  option2 TEXT,
  option3 TEXT,
  barcode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Now add variant_id to cart_items
ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id);

-- Step 4: Update the unique constraint to include variant_id
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_unique_item
UNIQUE(user_id, product_id, variant_id);

-- Step 5: Enable RLS for product variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies for product variants
CREATE POLICY IF NOT EXISTS "product_variants_public_read" ON public.product_variants FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "product_variants_admin_all" ON public.product_variants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Step 7: Add addresses table if missing
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('billing', 'shipping')),
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Enable RLS for addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "addresses_user_own" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "addresses_admin_all" ON public.addresses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON public.product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant ON public.cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);