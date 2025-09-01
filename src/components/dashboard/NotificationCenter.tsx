import React, { useState } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, AlertCircle, TrendingUp, Award, Zap } from 'lucide-react'
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates'

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
    lastUpdate
  } = useRealTimeUpdates()

  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_analysis':
        return <Bell className="h-4 w-4 text-blue-500" />
      case 'score_improvement':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'milestone':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Zap className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400 bg-red-50'
      case 'medium':
        return 'border-l-yellow-400 bg-yellow-50'
      case 'low':
        return 'border-l-blue-400 bg-blue-50'
      default:
        return 'border-l-gray-400 bg-gray-50'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead
      case 'high':
        return notification.priority === 'high'
      default:
        return true
    }
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
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
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Connection Status */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                {lastUpdate && (
                  <span>Last update: {formatTime(lastUpdate)}</span>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'high', label: 'Priority', count: notifications.filter(n => n.priority === 'high').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label} {count > 0 && `(${count})`}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear all</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                        notification.isRead ? 'opacity-60' : ''
                      } ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => clearNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Remove notification"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}