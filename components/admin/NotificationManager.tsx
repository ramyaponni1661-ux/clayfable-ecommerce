'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Mail, MessageCircle, Send, Settings, History, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface NotificationSettings {
  email_notifications: boolean
  email_address: string
  whatsapp_notifications: boolean
  whatsapp_number: string
  notification_events: {
    new_order: boolean
    order_status_change: boolean
    low_stock: boolean
    payment_received: boolean
    customer_signup: boolean
  }
}

interface NotificationLog {
  id: string
  type: string
  recipient: string
  order_id?: string
  status: 'sent' | 'failed'
  message: string
  created_at: string
}

export default function NotificationManager() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationLog[]>([])
  const [loading, setLoading] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testPhone, setTestPhone] = useState('')
  const { toast } = useToast()

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications?action=settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.settings)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch notification settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to notification service",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  const fetchNotificationHistory = async () => {
    try {
      const response = await fetch('/api/admin/notifications?action=history')
      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notification history:', error)
    }
  }

  const updateSettings = async () => {
    if (!settings) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          data: { settings }
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Notification settings updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  const testEmailNotification = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications?action=test')
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Test email sent to support@clayfable.com",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send test email",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  const sendWhatsAppNotification = async () => {
    if (!testPhone || !testMessage) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_whatsapp',
          data: {
            phone: testPhone,
            message: testMessage
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "WhatsApp notification sent successfully",
        })
        setTestMessage('')
        setTestPhone('')
        fetchNotificationHistory() // Refresh history
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send WhatsApp notification",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp notification",
        variant: "destructive"
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
    fetchNotificationHistory()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order_notification':
        return <Mail className="w-4 h-4 text-blue-500" />
      case 'whatsapp_notification':
        return <MessageCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-sm text-gray-600">Loading notification settings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-gray-600">Manage email and WhatsApp notifications for orders and alerts</p>
        </div>
        <Button
          onClick={() => {
            fetchSettings()
            fetchNotificationHistory()
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="test">Test & Send</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to your email when important events occur
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, email_notifications: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-address">Notification Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={settings.email_address}
                  onChange={(e) =>
                    setSettings({ ...settings, email_address: e.target.value })
                  }
                  placeholder="support@clayfable.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-notifications">Enable WhatsApp Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send order updates and notifications via WhatsApp
                  </p>
                </div>
                <Switch
                  id="whatsapp-notifications"
                  checked={settings.whatsapp_notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, whatsapp_notifications: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                <Input
                  id="whatsapp-number"
                  type="tel"
                  value={settings.whatsapp_number}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp_number: e.target.value })
                  }
                  placeholder="+91 9876543210"
                />
                <p className="text-xs text-muted-foreground">
                  This requires WhatsApp Business API setup with Meta/Facebook
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notification_events).map(([event, enabled]) => (
                <div key={event} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={event} className="capitalize">
                      {event.replace('_', ' ')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {event === 'new_order' && 'Get notified when new orders are placed'}
                      {event === 'order_status_change' && 'Get notified when order status changes'}
                      {event === 'low_stock' && 'Get notified when products are low on stock'}
                      {event === 'payment_received' && 'Get notified when payments are received'}
                      {event === 'customer_signup' && 'Get notified when new customers sign up'}
                    </p>
                  </div>
                  <Switch
                    id={event}
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notification_events: {
                          ...settings.notification_events,
                          [event]: checked
                        }
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={updateSettings}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Email Test</h4>
                <p className="text-sm text-muted-foreground">
                  Send a test order notification email to {settings.email_address}
                </p>
                <Button
                  onClick={testEmailNotification}
                  disabled={loading || !settings.email_notifications}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Test Email
                </Button>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold">WhatsApp Test</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="test-phone">Phone Number</Label>
                    <Input
                      id="test-phone"
                      type="tel"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-message">Message</Label>
                    <Textarea
                      id="test-message"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Test message from Clayfable notification system"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={sendWhatsAppNotification}
                    disabled={loading || !settings.whatsapp_notifications || !testPhone || !testMessage}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send WhatsApp Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Notification History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications sent yet
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTypeIcon(notification.type)}
                        <div>
                          <div className="font-medium">{notification.type.replace('_', ' ').toUpperCase()}</div>
                          <div className="text-sm text-muted-foreground">
                            To: {notification.recipient}
                          </div>
                          {notification.order_id && (
                            <div className="text-xs text-muted-foreground">
                              Order: {notification.order_id}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(notification.status)}
                            <Badge variant={notification.status === 'sent' ? 'default' : 'destructive'}>
                              {notification.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}