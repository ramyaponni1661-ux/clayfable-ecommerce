"use client"

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  FileDown,
  FileUp,
  Database,
  Filter,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Loader2,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

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

interface BulkImportExportProps {
  className?: string;
}

const BulkImportExport: React.FC<BulkImportExportProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export options state
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeImages: true,
    includeInactive: false,
    fields: [
      'name', 'description', 'price', 'sale_price', 'sku', 'category',
      'stock_quantity', 'weight', 'dimensions', 'material', 'color',
      'is_featured', 'is_active', 'tags'
    ]
  });

  // Available fields for export
  const availableFields = [
    { id: 'name', label: 'Product Name', required: true },
    { id: 'description', label: 'Description' },
    { id: 'price', label: 'Price', required: true },
    { id: 'sale_price', label: 'Sale Price' },
    { id: 'sku', label: 'SKU', required: true },
    { id: 'category', label: 'Category' },
    { id: 'stock_quantity', label: 'Stock Quantity' },
    { id: 'weight', label: 'Weight' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'material', label: 'Material' },
    { id: 'color', label: 'Color' },
    { id: 'is_featured', label: 'Featured' },
    { id: 'is_active', label: 'Active Status' },
    { id: 'tags', label: 'Tags' },
    { id: 'meta_title', label: 'SEO Title' },
    { id: 'meta_description', label: 'SEO Description' },
    { id: 'created_at', label: 'Created Date' },
    { id: 'updated_at', label: 'Updated Date' }
  ];

  // Parse CSV content
  const parseCSV = (content: string): string[][] => {
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
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      result.push(current.trim());
      return result;
    });
  };

  // Validate CSV row
  const validateRow = (row: string[], headers: string[], rowIndex: number): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check required fields
    const requiredFields = ['name', 'price', 'sku'];
    requiredFields.forEach(field => {
      const fieldIndex = headers.findIndex(h => h.toLowerCase() === field);
      if (fieldIndex === -1) {
        errors.push({
          row: rowIndex,
          field: field,
          value: '',
          error: `Required field '${field}' not found in headers`
        });
      } else if (!row[fieldIndex] || row[fieldIndex].trim() === '') {
        errors.push({
          row: rowIndex,
          field: field,
          value: row[fieldIndex] || '',
          error: `Required field '${field}' is empty`
        });
      }
    });

    // Validate price format
    const priceIndex = headers.findIndex(h => h.toLowerCase() === 'price');
    if (priceIndex !== -1 && row[priceIndex]) {
      const price = parseFloat(row[priceIndex]);
      if (isNaN(price) || price < 0) {
        errors.push({
          row: rowIndex,
          field: 'price',
          value: row[priceIndex],
          error: 'Price must be a valid positive number'
        });
      }
    }

    // Validate stock quantity
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

    // Validate SKU format (alphanumeric, dashes, underscores)
    const skuIndex = headers.findIndex(h => h.toLowerCase() === 'sku');
    if (skuIndex !== -1 && row[skuIndex]) {
      const sku = row[skuIndex].trim();
      if (!/^[a-zA-Z0-9_-]+$/.test(sku)) {
        errors.push({
          row: rowIndex,
          field: 'sku',
          value: sku,
          error: 'SKU can only contain letters, numbers, hyphens, and underscores'
        });
      }
    }

    return errors;
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setImportFile(file);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSV(content);
      setCsvPreview(parsed.slice(0, 6)); // Show first 5 rows + header

      // Validate data
      if (parsed.length > 1) {
        const headers = parsed[0];
        const errors: ValidationError[] = [];

        for (let i = 1; i < Math.min(parsed.length, 101); i++) { // Validate first 100 rows
          errors.push(...validateRow(parsed[i], headers, i));
        }

        setValidationErrors(errors);
        setShowPreview(true);
      }
    };
    reader.readAsText(file);
  };

  // Perform import
  const performImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/products/bulk-import', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
        toast.success(`Import completed: ${result.success} products imported successfully`);
        if (result.failed > 0) {
          toast.warning(`${result.failed} products failed to import`);
        }
      } else {
        toast.error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed due to network error');
    } finally {
      setIsImporting(false);
    }
  };

  // Generate export
  const generateExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/admin/products/bulk-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportOptions)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-export-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('Export downloaded successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed due to network error');
    } finally {
      setIsExporting(false);
    }
  };

  // Download sample template
  const downloadTemplate = () => {
    const headers = [
      'name', 'description', 'price', 'sale_price', 'sku', 'category',
      'stock_quantity', 'weight', 'dimensions', 'material', 'color',
      'is_featured', 'is_active', 'tags'
    ];

    const sampleData = [
      'Sample Clay Pot', 'Beautiful handcrafted clay pot', '29.99', '24.99', 'POT001', 'Pottery',
      '50', '1.2', '15x15x20', 'Terracotta', 'Brown', 'true', 'true', 'pottery,handcraft,decorative'
    ];

    const csvContent = [headers, sampleData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Template downloaded');
  };

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'import' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('import')}
              className="gap-2"
            >
              <FileUp className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant={activeTab === 'export' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('export')}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeTab === 'import' ? (
          <div className="space-y-6">
            {/* Import Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Import Instructions
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• CSV files only with UTF-8 encoding</li>
                <li>• Required fields: name, price, sku</li>
                <li>• Use comma-separated values with quotes for text containing commas</li>
                <li>• Boolean fields: use "true" or "false"</li>
                <li>• Maximum 1000 products per import</li>
              </ul>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadTemplate}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {importFile ? (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="font-medium text-gray-700">{importFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(importFile.size / 1024)} KB
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="font-medium text-gray-700">Choose CSV file to import</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </div>
              )}
            </div>

            {/* Preview */}
            {showPreview && csvPreview.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview ({csvPreview.length - 1} rows shown)
                  </h4>
                  <Badge
                    variant={validationErrors.length === 0 ? "outline" : "destructive"}
                    className="gap-1"
                  >
                    {validationErrors.length === 0 ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Valid
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        {validationErrors.length} errors
                      </>
                    )}
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {csvPreview[0]?.map((header, index) => (
                          <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 border-r">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 border-r text-gray-600">
                              {cell.length > 30 ? `${cell.substring(0, 30)}...` : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Validation Errors ({validationErrors.length})
                    </h5>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {validationErrors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-xs text-red-700">
                          Row {error.row}, {error.field}: {error.error}
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <div className="text-xs text-red-600 font-medium">
                          ... and {validationErrors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Import Progress */}
            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Importing products...</span>
                  <span className="text-sm text-gray-500">{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            {/* Import Results */}
            {importResult && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</div>
                  <div className="text-sm text-yellow-700">Duplicates</div>
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="flex justify-end">
              <Button
                onClick={performImport}
                disabled={!importFile || validationErrors.length > 0 || isImporting}
                className="gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4" />
                    Import Products
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Format */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value: 'csv' | 'xlsx') =>
                    setExportOptions(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Export Options</h4>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-images"
                    checked={exportOptions.includeImages}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeImages: !!checked }))
                    }
                  />
                  <label htmlFor="include-images" className="text-sm">Include image URLs</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-inactive"
                    checked={exportOptions.includeInactive}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, includeInactive: !!checked }))
                    }
                  />
                  <label htmlFor="include-inactive" className="text-sm">Include inactive products</label>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Fields to Export</h4>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availableFields.map(field => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field.id}`}
                      checked={exportOptions.fields.includes(field.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setExportOptions(prev => ({
                            ...prev,
                            fields: [...prev.fields, field.id]
                          }));
                        } else if (!field.required) {
                          setExportOptions(prev => ({
                            ...prev,
                            fields: prev.fields.filter(f => f !== field.id)
                          }));
                        }
                      }}
                      disabled={field.required}
                    />
                    <label htmlFor={`field-${field.id}`} className="text-sm">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    fields: availableFields.map(f => f.id)
                  }))}
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    fields: availableFields.filter(f => f.required).map(f => f.id)
                  }))}
                >
                  Required Only
                </Button>
              </div>
            </div>

            {/* Export Statistics */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Export Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Format: {exportOptions.format.toUpperCase()}</div>
                <div>Fields: {exportOptions.fields.length} selected</div>
                <div>Include Images: {exportOptions.includeImages ? 'Yes' : 'No'}</div>
                <div>Include Inactive: {exportOptions.includeInactive ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button
                onClick={generateExport}
                disabled={isExporting || exportOptions.fields.length === 0}
                className="gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export Products
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkImportExport;