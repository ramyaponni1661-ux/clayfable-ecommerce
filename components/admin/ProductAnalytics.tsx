"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  Eye,
  Users,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Award,
  Layers
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProductMetrics {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averagePrice: number;
  totalValue: number;
}

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  units: number;
}

interface CategoryData {
  name: string;
  value: number;
  products: number;
  revenue: number;
  color: string;
}

interface TopProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  revenue: number;
  units: number;
  views: number;
  conversion: number;
}

interface AnalyticsData {
  metrics: ProductMetrics;
  salesTrend: SalesData[];
  categoryBreakdown: CategoryData[];
  topProducts: TopProduct[];
  stockAlerts: {
    lowStock: TopProduct[];
    outOfStock: TopProduct[];
  };
  performance: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    growthRate: number;
  };
}

interface ProductAnalyticsProps {
  className?: string;
}

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ className = '' }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'units'>('revenue');

  const COLORS = ['#f97316', '#ea580c', '#dc2626', '#c2410c', '#9a3412', '#7c2d12'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchAnalyticsData();
    toast.success('Analytics data refreshed');
  };

  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?range=${timeRange}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Analytics exported');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (isLoading || !analyticsData) {
    return (
      <Card className={`border-orange-200 ${className}`}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { metrics, salesTrend, categoryBreakdown, topProducts, stockAlerts, performance } = analyticsData;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Product Analytics Dashboard
            </CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={refreshData} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={exportAnalytics} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(performance.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    +{formatPercentage(performance.growthRate)}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    {metrics.activeProducts} active
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{performance.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600 ml-1">
                    {formatPercentage(performance.conversionRate)} conversion
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(performance.averageOrderValue)}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {metrics.featuredProducts} featured
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Trend
            </CardTitle>
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="units">Units Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    selectedMetric === 'revenue' ? formatCurrency(value) : value,
                    selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'orders' ? 'Orders' : 'Units'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="revenue"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryBreakdown.slice(0, 3).map((category, index) => (
                <div key={category.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(category.revenue)}</div>
                    <div className="text-xs text-gray-500">{category.products} products</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{product.sku}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.units} units • {formatPercentage(product.conversion)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {(stockAlerts.lowStock.length > 0 || stockAlerts.outOfStock.length > 0) && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockAlerts.outOfStock.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">Out of Stock</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {stockAlerts.outOfStock.slice(0, 4).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded border">
                      <div>
                        <p className="text-sm font-medium text-red-900">{product.name}</p>
                        <p className="text-xs text-red-600">SKU: {product.sku}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        0 in stock
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stockAlerts.lowStock.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Low Stock Warning</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {stockAlerts.lowStock.slice(0, 4).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded border">
                      <div>
                        <p className="text-sm font-medium text-yellow-900">{product.name}</p>
                        <p className="text-xs text-yellow-600">SKU: {product.sku}</p>
                      </div>
                      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                        Low stock
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Product Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Products</span>
                  <span className="font-medium">{formatPercentage((metrics.activeProducts / metrics.totalProducts) * 100)}</span>
                </div>
                <Progress value={(metrics.activeProducts / metrics.totalProducts) * 100} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Featured Products</span>
                  <span className="font-medium">{formatPercentage((metrics.featuredProducts / metrics.totalProducts) * 100)}</span>
                </div>
                <Progress value={(metrics.featuredProducts / metrics.totalProducts) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Stock Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Well Stocked</span>
                  <span className="font-medium">{metrics.totalProducts - metrics.lowStockProducts - metrics.outOfStockProducts}</span>
                </div>

                <div className="flex justify-between text-sm text-yellow-600">
                  <span>Low Stock</span>
                  <span className="font-medium">{metrics.lowStockProducts}</span>
                </div>

                <div className="flex justify-between text-sm text-red-600">
                  <span>Out of Stock</span>
                  <span className="font-medium">{metrics.outOfStockProducts}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Value Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Product Price</span>
                  <span className="font-medium">{formatCurrency(metrics.averagePrice)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Total Inventory Value</span>
                  <span className="font-medium">{formatCurrency(metrics.totalValue)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Growth Rate</span>
                  <span className="font-medium text-green-600">+{formatPercentage(performance.growthRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalytics;