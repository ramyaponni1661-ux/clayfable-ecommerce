"use client";

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  X,
  Package,
  Truck,
  Star,
  Flame,
  Gift,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from "lucide-react"

interface Notification {
  id: string
  type: 'stock' | 'order' | 'promotion' | 'update' | 'success' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionText?: string
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
  autoHide?: boolean
}

interface NotificationSystemProps {
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onNotificationDismiss?: (notificationId: string) => void
}

const sampleNotifications: Notification[] = []

export default function NotificationSystem({
  notifications,
  onNotificationClick,
  onNotificationDismiss
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentNotifications = useMemo(() => {
    return notifications && notifications.length > 0 ? notifications : sampleNotifications
  }, [notifications])

  const [localNotifications, setLocalNotifications] = useState<Notification[]>(currentNotifications)

  useEffect(() => {
    setLocalNotifications(currentNotifications)
  }, [currentNotifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <Package className="h-5 w-5" />
      case 'order':
        return <Truck className="h-5 w-5" />
      case 'promotion':
        return <Gift className="h-5 w-5" />
      case 'update':
        return <Bell className="h-5 w-5" />
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'text-red-600 bg-red-50 border-red-200'
    }

    switch (type) {
      case 'stock':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'order':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'promotion':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'update':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const unreadCount = localNotifications.filter(n => !n.isRead).length
  const recentNotifications = localNotifications.slice(0, 5)

  const markAsRead = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  const dismissNotification = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    )
    onNotificationDismiss?.(notificationId)
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 z-50">
            <Card className="border-orange-100 shadow-xl bg-white backdrop-blur-sm">
              <div className="p-4 border-b border-orange-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.isRead ? 'bg-orange-50' : ''
                        }`}
                        onClick={() => {
                          markAsRead(notification.id)
                          onNotificationClick?.(notification)
                        }}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                  {notification.priority === 'high' && (
                                    <Flame className="inline h-3 w-3 text-red-500 ml-1" />
                                  )}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  {notification.actionText && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs h-6 px-2 border-orange-200 hover:bg-orange-50"
                                    >
                                      {notification.actionText}
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  dismissNotification(notification.id)
                                }}
                                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {localNotifications.length > 5 && (
                <div className="p-3 border-t border-orange-100 text-center">
                  <Button variant="ghost" size="sm" className="text-orange-600">
                    View All Notifications
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {localNotifications
          .filter(n => n.priority === 'high' && !n.isRead)
          .slice(0, 3)
          .map((notification) => (
            <Card
              key={`toast-${notification.id}`}
              className="w-80 border-orange-200 shadow-lg animate-slideDown"
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm flex items-center gap-1">
                          {notification.title}
                          <Zap className="h-3 w-3 text-orange-500" />
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                        className="p-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {notification.actionText && (
                      <Button
                        size="sm"
                        className="mt-2 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {notification.actionText}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}