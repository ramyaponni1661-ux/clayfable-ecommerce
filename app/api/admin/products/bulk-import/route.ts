import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

interface ValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: ValidationError[];
  duplicates: number;
}

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

function parseCSV(content: string): string[][] {
  const lines = content.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"(.*)"$/, '$1'));
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim().replace(/^"(.*)"$/, '$1'));
    return result;
  });
}

function validateRow(row: string[], headers: string[], rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required fields
  const requiredFields = [
    { field: 'name', validate: (val: string) => val.trim().length > 0 },
    { field: 'price', validate: (val: string) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 },
    { field: 'sku', validate: (val: string) => /^[a-zA-Z0-9_-]+$/.test(val.trim()) }
  ];

  requiredFields.forEach(({ field, validate }) => {
    const fieldIndex = headers.findIndex(h => h.toLowerCase() === field.toLowerCase());
    if (fieldIndex === -1) {
      errors.push({
        row: rowIndex,
        field: field,
        value: '',
        error: `Required field '${field}' not found in headers`
      });
    } else {
      const value = row[fieldIndex] || '';
      if (!validate(value)) {
        let errorMsg = `Invalid ${field}`;
        if (field === 'price') errorMsg = 'Price must be a valid positive number';
        if (field === 'sku') errorMsg = 'SKU can only contain letters, numbers, hyphens, and underscores';
        if (field === 'name') errorMsg = 'Product name cannot be empty';

        errors.push({
          row: rowIndex,
          field: field,
          value: value,
          error: errorMsg
        });
      }
    }
  });

  // Validate optional fields
  const stockIndex = headers.findIndex(h => h.toLowerCase().includes('stock'));
  if (stockIndex !== -1 && row[stockIndex]) {
    const stock = parseInt(row[stockIndex]);
    if (isNaN(stock) || stock < 0) {
      errors.push({
        row: rowIndex,
        field: 'stock_quantity',
        value: row[stockIndex],
        error: 'Stock quantity must be a valid non-negative number'
      });
    }
  }

  const salePriceIndex = headers.findIndex(h => h.toLowerCase().includes('sale'));
  if (salePriceIndex !== -1 && row[salePriceIndex]) {
    const salePrice = parseFloat(row[salePriceIndex]);
    if (isNaN(salePrice) || salePrice < 0) {
      errors.push({
        row: rowIndex,
        field: 'sale_price',
        value: row[salePriceIndex],
        error: 'Sale price must be a valid positive number'
      });
    }
  }

  return errors;
}

function mapRowToProduct(row: string[], headers: string[]) {
  const product: any = {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Map CSV columns to product fields
  const fieldMappings = {
    'name': 'name',
    'description': 'description',
    'price': 'price',
    'sale_price': 'sale_price',
    'sku': 'sku',
    'category': 'category',
    'stock_quantity': 'stock_quantity',
    'weight': 'weight',
    'dimensions': 'dimensions',
    'material': 'material',
    'color': 'color',
    'is_featured': 'is_featured',
    'is_active': 'is_active',
    'tags': 'tags',
    'meta_title': 'meta_title',
    'meta_description': 'meta_description'
  };

  Object.entries(fieldMappings).forEach(([csvField, dbField]) => {
    const fieldIndex = headers.findIndex(h => h.toLowerCase() === csvField.toLowerCase());
    if (fieldIndex !== -1 && row[fieldIndex]) {
      let value = row[fieldIndex].trim();

      // Type conversions
      if (['price', 'sale_price', 'weight'].includes(dbField)) {
        product[dbField] = parseFloat(value) || 0;
      } else if (dbField === 'stock_quantity') {
        product[dbField] = parseInt(value) || 0;
      } else if (['is_featured', 'is_active'].includes(dbField)) {
        product[dbField] = value.toLowerCase() === 'true';
      } else {
        product[dbField] = value;
      }
    }
  });

  // Set defaults
  if (!product.hasOwnProperty('is_active')) product.is_active = true;
  if (!product.hasOwnProperty('is_featured')) product.is_featured = false;
  if (!product.hasOwnProperty('stock_quantity')) product.stock_quantity = 0;

  return product;
}

export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are supported' }, { status: 400 })
    }

    const content = await file.text()
    const rows = parseCSV(content)

    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV file must contain at least a header row and one data row' }, { status: 400 })
    }

    if (rows.length > 1001) { // 1000 data rows + 1 header
      return NextResponse.json({ error: 'Maximum 1000 products allowed per import' }, { status: 400 })
    }

    const headers = rows[0]
    const dataRows = rows.slice(1)
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      duplicates: 0
    }

    // Check for existing SKUs to detect duplicates
    const skuIndex = headers.findIndex(h => h.toLowerCase() === 'sku');
    const skus = skuIndex !== -1 ? dataRows.map(row => row[skuIndex]).filter(Boolean) : [];

    if (skus.length > 0) {
      const { data: existingProducts } = await supabase
        .from('products')
        .select('sku')
        .in('sku', skus);

      const existingSkus = new Set(existingProducts?.map(p => p.sku) || []);

      // Process each row
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowIndex = i + 2; // +2 because array is 0-indexed and we skipped header

        // Validate row
        const validationErrors = validateRow(row, headers, rowIndex);
        if (validationErrors.length > 0) {
          result.errors.push(...validationErrors);
          result.failed++;
          continue;
        }

        // Check for duplicate SKU
        const rowSku = skuIndex !== -1 ? row[skuIndex] : '';
        if (rowSku && existingSkus.has(rowSku)) {
          result.duplicates++;
          result.failed++;
          result.errors.push({
            row: rowIndex,
            field: 'sku',
            value: rowSku,
            error: 'SKU already exists in database'
          });
          continue;
        }

        // Convert row to product object
        try {
          const product = mapRowToProduct(row, headers);

          // Insert product
          const { error: insertError } = await supabase
            .from('products')
            .insert([product]);

          if (insertError) {
            result.failed++;
            result.errors.push({
              row: rowIndex,
              field: 'database',
              value: product.sku || product.name || '',
              error: `Database error: ${insertError.message}`
            });
          } else {
            result.success++;
            // Add to existing SKUs to prevent duplicates within the same import
            if (rowSku) existingSkus.add(rowSku);
          }
        } catch (error) {
          result.failed++;
          result.errors.push({
            row: rowIndex,
            field: 'processing',
            value: '',
            error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown import error'
    }, { status: 500 })
  }
}