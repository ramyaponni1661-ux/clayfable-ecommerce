"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CreditCard,
  Calendar,
  Package,
  Star,
  Bell,
  Gift,
  Truck,
  Crown,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface SubscriptionManagementProps {
  userStats: {
    totalOrders: number
    totalSpent: number
    loyaltyPoints: number
  }
}

export function SubscriptionManagement({ userStats }: SubscriptionManagementProps) {
  const [activeSubscriptions, setActiveSubscriptions] = useState([
    {
      id: 'premium',
      name: 'Clayfable Premium',
      type: 'Premium Membership',
      status: 'active',
      price: 299,
      billingCycle: 'monthly',
      nextBilling: '2024-02-15',
      features: ['Free shipping on all orders', '20% discount on premium items', 'Early access to new collections', 'Priority customer support'],
      usage: { used: 8, total: 15, description: 'Premium discounts used this month' }
    },
    {
      id: 'newsletter',
      name: 'Weekly Newsletter',
      type: 'Email Subscription',
      status: 'active',
      price: 0,
      billingCycle: 'free',
      nextBilling: null,
      features: ['Weekly product updates', 'Exclusive offers', 'Artisan stories', 'DIY tutorials'],
      usage: null
    }
  ])

  const [availableSubscriptions] = useState([
    {
      id: 'vip',
      name: 'VIP Collector',
      type: 'VIP Membership',
      price: 999,
      billingCycle: 'monthly',
      features: ['Everything in Premium', 'Exclusive limited editions', 'Personal shopping assistant', 'Free annual pottery workshop', 'Custom design requests'],
      badge: 'Most Popular',
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    },
    {
      id: 'business',
      name: 'Business Partner',
      type: 'B2B Subscription',
      price: 1499,
      billingCycle: 'monthly',
      features: ['Bulk order discounts', 'Dedicated account manager', 'Custom branding options', 'Wholesale pricing', 'Priority manufacturing'],
      badge: 'For Businesses',
      color: 'bg-gradient-to-r from-blue-500 to-blue-700'
    }
  ])

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    newsletter: true,
    reminders: true
  })

  const handleSubscriptionToggle = (subscriptionId: string) => {
    setActiveSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, status: sub.status === 'active' ? 'paused' : 'active' }
          : sub
      )
    )
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const calculateSavings = () => {
    const premiumSub = activeSubscriptions.find(sub => sub.id === 'premium')
    if (premiumSub && premiumSub.status === 'active') {
      return Math.round(userStats.totalSpent * 0.2) // 20% savings
    }
    return 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Manage your memberships and notification preferences</p>
        </div>
        {calculateSavings() > 0 && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Gift className="h-4 w-4 mr-1" />
            Saved ₹{calculateSavings()} this month!
          </Badge>
        )}
      </div>

      {/* Active Subscriptions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
        {activeSubscriptions.map((subscription) => (
          <Card key={subscription.id} className="border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      {subscription.id === 'premium' ? (
                        <Crown className="h-5 w-5 text-orange-600" />
                      ) : subscription.id === 'vip' ? (
                        <Star className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Bell className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{subscription.name}</h4>
                      <p className="text-sm text-gray-600">{subscription.type}</p>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Features</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {subscription.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      {subscription.price > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Price: <span className="font-bold text-orange-600">₹{subscription.price}/{subscription.billingCycle}</span>
                          </p>
                          {subscription.nextBilling && (
                            <p className="text-sm text-gray-600">
                              Next billing: <span className="font-medium">{subscription.nextBilling}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {subscription.usage && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{subscription.usage.description}</span>
                            <span className="font-medium">{subscription.usage.used}/{subscription.usage.total}</span>
                          </div>
                          <Progress
                            value={(subscription.usage.used / subscription.usage.total) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={subscription.status === 'active'}
                    onCheckedChange={() => handleSubscriptionToggle(subscription.id)}
                  />
                  <Button variant="outline" size="sm" className="border-orange-200">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Subscriptions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Upgrade Options</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {availableSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="border-orange-100 relative overflow-hidden">
              {subscription.badge && (
                <div className={`absolute top-0 right-0 px-3 py-1 text-white text-xs font-medium ${subscription.color}`}>
                  {subscription.badge}
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-lg">{subscription.name}</h4>
                  <p className="text-gray-600">{subscription.type}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    ₹{subscription.price}
                    <span className="text-sm text-gray-600 font-normal">/{subscription.billingCycle}</span>
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'orderUpdates' && 'Get notified about order status changes'}
                  {key === 'promotions' && 'Receive exclusive offers and discounts'}
                  {key === 'newProducts' && 'Be the first to know about new arrivals'}
                  {key === 'newsletter' && 'Weekly updates with artisan stories and tips'}
                  {key === 'reminders' && 'Cart reminders and wishlist notifications'}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) => handleNotificationChange(key, checked)}
              />
            </div>
          ))}

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full border-orange-200">
              <Shield className="h-4 w-4 mr-2" />
              Update Email Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}