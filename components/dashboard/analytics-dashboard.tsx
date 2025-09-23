"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Target,
  Award,
  Calendar,
  Download
} from 'lucide-react'

interface AnalyticsDashboardProps {
  userStats: {
    totalOrders: number
    totalSpent: number
    loyaltyPoints: number
  }
  orders: any[]
}

export function AnalyticsDashboard({ userStats, orders }: AnalyticsDashboardProps) {
  // Sample data for charts
  const monthlySpending = [
    { month: 'Jan', amount: 2400, orders: 4 },
    { month: 'Feb', amount: 1398, orders: 2 },
    { month: 'Mar', amount: 9800, orders: 8 },
    { month: 'Apr', amount: 3908, orders: 6 },
    { month: 'May', amount: 4800, orders: 7 },
    { month: 'Jun', amount: 3800, orders: 5 }
  ]

  const categorySpending = [
    { name: 'Cookware', value: 8500, color: '#F97316' },
    { name: 'Decor', value: 4200, color: '#EAB308' },
    { name: 'Garden', value: 2800, color: '#84CC16' },
    { name: 'Planters', value: 1900, color: '#06B6D4' }
  ]

  const orderTrends = [
    { period: 'Week 1', completed: 3, pending: 1, cancelled: 0 },
    { period: 'Week 2', completed: 5, pending: 2, cancelled: 1 },
    { period: 'Week 3', completed: 4, pending: 1, cancelled: 0 },
    { period: 'Week 4', completed: 6, pending: 3, cancelled: 1 }
  ]

  const loyaltyProgress = [
    { tier: 'Bronze', points: 500, reached: true },
    { tier: 'Silver', points: 1000, reached: true },
    { tier: 'Gold', points: 2500, reached: false },
    { tier: 'Platinum', points: 5000, reached: false }
  ]

  const exportData = () => {
    const data = {
      userStats,
      monthlySpending,
      categorySpending,
      orderTrends,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Insights into your shopping patterns and preferences</p>
        </div>
        <Button
          onClick={exportData}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">₹{userStats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.totalOrders}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{userStats.totalOrders > 0 ? Math.round(userStats.totalSpent / userStats.totalOrders).toLocaleString() : '0'}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.loyaltyPoints}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Award className="h-3 w-3 mr-1" />
                  Silver Tier
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Monthly Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Spent']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Trends */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle>Order Status Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                <Bar dataKey="cancelled" stackId="a" fill="#EF4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Loyalty Progress */}
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle>Loyalty Tier Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loyaltyProgress.map((tier, index) => (
              <div key={tier.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${tier.reached ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="font-medium">{tier.tier}</span>
                  <Badge variant={tier.reached ? "default" : "secondary"}>
                    {tier.points} points
                  </Badge>
                </div>
                {tier.reached && <Award className="h-4 w-4 text-orange-600" />}
              </div>
            ))}
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>{2500 - userStats.loyaltyPoints}</strong> more points needed for Gold tier!
              </p>
              <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userStats.loyaltyPoints / 2500) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}