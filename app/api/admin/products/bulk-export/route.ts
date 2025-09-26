import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

interface ExportOptions {
  format: 'csv' | 'xlsx';
  includeImages: boolean;
  includeInactive: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  fields: string[];
}

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

function escapeCSVValue(value: any): string {
  if (value == null) return '';

  const stringValue = String(value);

  // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function generateCSV(products: any[], fields: string[], includeImages: boolean): string {
  const headers = [...fields];
  if (includeImages) {
    headers.push('image_urls');
  }

  const csvRows = [headers.join(',')];

  products.forEach(product => {
    const row = fields.map(field => {
      let value = product[field];

      // Special handling for certain fields
      if (field === 'tags' && Array.isArray(value)) {
        value = value.join(';');
      } else if (['is_featured', 'is_active'].includes(field)) {
        value = value ? 'true' : 'false';
      } else if (['created_at', 'updated_at'].includes(field) && value) {
        value = new Date(value).toISOString().split('T')[0];
      }

      return escapeCSVValue(value);
    });

    // Add image URLs if requested
    if (includeImages) {
      const imageUrls = product.image_urls || [];
      row.push(escapeCSVValue(Array.isArray(imageUrls) ? imageUrls.join(';') : imageUrls));
    }

    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

async function generateXLSX(products: any[], fields: string[], includeImages: boolean): Promise<Buffer> {
  // For demo purposes, we'll generate CSV and label it as XLSX
  // In a real implementation, you would use a library like 'xlsx' or 'exceljs'
  const csvContent = generateCSV(products, fields, includeImages);

  // This is a placeholder - in production, you'd generate actual XLSX
  return Buffer.from(csvContent, 'utf-8');
}

export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const options: ExportOptions = await request.json()

    if (!options.fields || options.fields.length === 0) {
      return NextResponse.json({ error: 'No fields selected for export' }, { status: 400 })
    }

    // Build query
    let query = supabase.from('products').select('*');

    // Apply filters
    if (!options.includeInactive) {
      query = query.eq('is_active', true);
    }

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.start)
        .lte('created_at', options.dateRange.end);
    }

    if (options.categories && options.categories.length > 0) {
      query = query.in('category', options.categories);
    }

    // Execute query
    const { data: products, error } = await query;

    if (error) {
      console.error('Export query error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found matching the criteria' }, { status: 404 });
    }

    // Generate export file
    let fileContent: Buffer;
    let contentType: string;
    let fileName: string;

    if (options.format === 'xlsx') {
      fileContent = await generateXLSX(products, options.fields, options.includeImages);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileName = `products-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    } else {
      const csvContent = generateCSV(products, options.fields, options.includeImages);
      fileContent = Buffer.from(csvContent, 'utf-8');
      contentType = 'text/csv';
      fileName = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Return file
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileContent.length.toString(),
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown export error'
    }, { status: 500 });
  }
}

// GET endpoint to fetch export statistics
export async function GET() {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get product statistics for export preview
    const { data: stats, error } = await supabase
      .from('products')
      .select('is_active, category, created_at')

    if (error) {
      console.error('Stats query error:', error);
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }

    const totalProducts = stats?.length || 0;
    const activeProducts = stats?.filter(p => p.is_active).length || 0;
    const inactiveProducts = totalProducts - activeProducts;

    // Get categories
    const categories = [...new Set(stats?.map(p => p.category).filter(Boolean))];

    // Get date range
    const dates = stats?.map(p => new Date(p.created_at)).sort((a, b) => a.getTime() - b.getTime());
    const dateRange = dates && dates.length > 0 ? {
      earliest: dates[0].toISOString().split('T')[0],
      latest: dates[dates.length - 1].toISOString().split('T')[0]
    } : null;

    return NextResponse.json({
      totalProducts,
      activeProducts,
      inactiveProducts,
      categories,
      dateRange
    });

  } catch (error) {
    console.error('Export stats error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}