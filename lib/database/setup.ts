import { createClient } from '@/lib/supabase/service'
import fs from 'fs'
import path from 'path'

const supabase = createClient()

export async function initializeDatabase() {
  console.log('🚀 Starting database initialization...')

  const scriptsDir = path.join(process.cwd(), 'scripts')
  const sqlFiles = [
    '01-create-users-tables.sql',
    '02-create-product-tables.sql',
    '03-create-order-tables.sql',
    '04-create-reviews-wishlist-tables.sql',
    '05-create-marketing-tables.sql',
    '06-create-content-admin-tables.sql',
    '07-create-analytics-tables.sql',
    '08-create-integration-tables.sql',
    '09-insert-sample-data.sql',
    '10-create-functions-triggers.sql',
    '11-create-supabase-tables.sql',
    '12-create-youtube-integration.sql'
  ]

  const results = []

  for (const fileName of sqlFiles) {
    try {
      console.log(`📄 Executing ${fileName}...`)
      const filePath = path.join(scriptsDir, fileName)

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}, skipping...`)
        continue
      }

      const sqlContent = fs.readFileSync(filePath, 'utf8')

      // Split by semicolons and execute each statement separately
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            console.error(`❌ Error in ${fileName}:`, error.message)
          }
        }
      }

      console.log(`✅ Completed ${fileName}`)
      results.push({ file: fileName, status: 'success' })

    } catch (error) {
      console.error(`❌ Failed to execute ${fileName}:`, error)
      results.push({ file: fileName, status: 'error', error: error.message })
    }
  }

  console.log('🎉 Database initialization completed!')
  return results
}

export async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...')

  const tables = [
    'profiles', 'user_addresses', 'b2b_customers',
    'categories', 'products', 'product_variants',
    'orders', 'order_items', 'cart_items',
    'reviews', 'wishlists', 'discount_codes'
  ]

  const results = []

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Table '${table}' not accessible: ${error.message}`)
        results.push({ table, status: 'error', error: error.message })
      } else {
        console.log(`✅ Table '${table}' is accessible`)
        results.push({ table, status: 'success' })
      }
    } catch (error) {
      console.log(`❌ Table '${table}' check failed: ${error.message}`)
      results.push({ table, status: 'error', error: error.message })
    }
  }

  return results
}

export async function insertSampleProducts() {
  console.log('📦 Inserting sample product data...')

  // First, create categories
  const categories = [
    {
      name: 'Cooking Collection',
      slug: 'cooking',
      description: 'Traditional clay cooking pots and vessels',
      is_active: true
    },
    {
      name: 'Serving Collection',
      slug: 'serving',
      description: 'Elegant bowls, plates and serving dishes',
      is_active: true
    },
    {
      name: 'Decor Collection',
      slug: 'decor',
      description: 'Beautiful vases, planters and decorative pieces',
      is_active: true
    },
    {
      name: 'Water Storage',
      slug: 'water-storage',
      description: 'Traditional matkas and water storage vessels',
      is_active: true
    }
  ]

  // Insert categories
  const { data: insertedCategories, error: categoryError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()

  if (categoryError) {
    console.error('❌ Error inserting categories:', categoryError)
    return { success: false, error: categoryError }
  }

  console.log('✅ Categories inserted successfully')

  // Sample products matching the current website
  const products = [
    {
      name: 'Traditional Clay Cooking Pot',
      slug: 'traditional-clay-cooking-pot',
      description: 'Handcrafted traditional terracotta cooking pot perfect for authentic Indian cooking. Made from natural clay, this pot enhances the flavors of your food while being completely eco-friendly.',
      short_description: 'Traditional terracotta cooking pot for authentic flavors',
      sku: 'TCP-001',
      category_id: insertedCategories?.find(c => c.slug === 'cooking')?.id,
      price: 149,
      compare_price: 799,
      images: JSON.stringify([
        { url: '/traditional-terracotta-cooking-pots-and-vessels.jpg', alt: 'Traditional Clay Cooking Pot' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Capacity': '2 Liters',
        'Diameter': '20 cm',
        'Height': '15 cm',
        'Weight': '1.5 kg'
      }),
      tags: ['traditional', 'cooking', 'eco-friendly', 'handcrafted'],
      is_featured: true,
      is_active: true,
      inventory_quantity: 50,
      material: 'Terracotta Clay',
      care_instructions: 'Wash with mild soap and water. Season before first use.'
    },
    {
      name: 'Handcrafted Serving Bowl Set',
      slug: 'handcrafted-serving-bowl-set',
      description: 'Beautiful set of handcrafted terracotta serving bowls. Perfect for serving traditional Indian meals with style and elegance.',
      short_description: 'Set of 4 elegant terracotta serving bowls',
      sku: 'SBS-001',
      category_id: insertedCategories?.find(c => c.slug === 'serving')?.id,
      price: 149,
      compare_price: 1199,
      images: JSON.stringify([
        { url: '/elegant-terracotta-serving-bowls-and-plates.jpg', alt: 'Serving Bowl Set' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Set Contents': '4 Bowls',
        'Bowl Diameter': '15 cm each',
        'Capacity': '500ml each'
      }),
      tags: ['serving', 'bowl', 'set', 'elegant'],
      is_featured: true,
      is_active: true,
      inventory_quantity: 30
    },
    {
      name: 'Decorative Terracotta Vase',
      slug: 'decorative-terracotta-vase',
      description: 'Stunning decorative terracotta vase with intricate hand-painted designs. Perfect for home decor and flower arrangements.',
      short_description: 'Hand-painted decorative terracotta vase',
      sku: 'DTV-001',
      category_id: insertedCategories?.find(c => c.slug === 'decor')?.id,
      price: 149,
      compare_price: 449,
      images: JSON.stringify([
        { url: '/decorative-terracotta-vases-and-planters.jpg', alt: 'Decorative Vase' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Height': '25 cm',
        'Diameter': '12 cm',
        'Design': 'Hand-painted traditional motifs'
      }),
      tags: ['decorative', 'vase', 'hand-painted', 'traditional'],
      is_featured: false,
      is_active: true,
      inventory_quantity: 25
    },
    {
      name: 'Clay Water Storage Pot',
      slug: 'clay-water-storage-pot',
      description: 'Traditional clay water storage pot (matka) that keeps water naturally cool and adds essential minerals. Perfect for healthy water storage.',
      short_description: 'Traditional clay matka for natural water cooling',
      sku: 'WSP-001',
      category_id: insertedCategories?.find(c => c.slug === 'water-storage')?.id,
      price: 149,
      compare_price: 1599,
      images: JSON.stringify([
        { url: '/traditional-terracotta-cooking-pots-and-vessels.jpg', alt: 'Water Storage Pot' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Capacity': '5 Liters',
        'Height': '30 cm',
        'Diameter': '25 cm',
        'Features': 'Natural cooling, adds minerals'
      }),
      tags: ['water', 'storage', 'matka', 'cooling'],
      is_featured: true,
      is_active: true,
      inventory_quantity: 40
    },
    {
      name: 'Artisan Dinner Plate Set',
      slug: 'artisan-dinner-plate-set',
      description: 'Elegant set of artisan-crafted terracotta dinner plates. Each plate is uniquely handmade with traditional techniques passed down through generations.',
      short_description: 'Set of 6 handcrafted dinner plates',
      sku: 'ADP-001',
      category_id: insertedCategories?.find(c => c.slug === 'serving')?.id,
      price: 149,
      compare_price: 1499,
      images: JSON.stringify([
        { url: '/elegant-terracotta-serving-bowls-and-plates.jpg', alt: 'Dinner Plate Set' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Set Contents': '6 Dinner Plates',
        'Diameter': '22 cm each',
        'Thickness': '8mm',
        'Finish': 'Smooth glazed'
      }),
      tags: ['dinner', 'plates', 'artisan', 'handcrafted'],
      is_featured: false,
      is_active: true,
      inventory_quantity: 20
    },
    {
      name: 'Garden Planter Collection',
      slug: 'garden-planter-collection',
      description: 'Beautiful collection of terracotta garden planters in various sizes. Perfect for herbs, flowers, and small plants.',
      short_description: 'Set of 3 terracotta garden planters',
      sku: 'GPC-001',
      category_id: insertedCategories?.find(c => c.slug === 'decor')?.id,
      price: 149,
      compare_price: 999,
      images: JSON.stringify([
        { url: '/decorative-terracotta-vases-and-planters.jpg', alt: 'Garden Planters' }
      ]),
      specifications: JSON.stringify({
        'Material': 'Natural Terracotta Clay',
        'Set Contents': '3 Planters (Small, Medium, Large)',
        'Drainage': 'Pre-drilled holes',
        'Sizes': '15cm, 20cm, 25cm diameter'
      }),
      tags: ['garden', 'planters', 'plants', 'outdoor'],
      is_featured: false,
      is_active: true,
      inventory_quantity: 35
    }
  ]

  // Insert products
  const { data: insertedProducts, error: productError } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'slug' })
    .select()

  if (productError) {
    console.error('❌ Error inserting products:', productError)
    return { success: false, error: productError }
  }

  console.log('✅ Sample products inserted successfully')

  return {
    success: true,
    categories: insertedCategories,
    products: insertedProducts
  }
}