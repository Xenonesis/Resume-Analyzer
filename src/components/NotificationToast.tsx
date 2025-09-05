import React from 'react'
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react'

interface Notification {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationToastProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm animate-slide-in-right ${getStyles(notification.type)}`}
        >
          {getIcon(notification.type)}
          <span className="ml-3 text-sm font-medium flex-1">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
