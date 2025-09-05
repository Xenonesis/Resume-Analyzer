import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: string
  title?: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const ToastContainer: React.FC = () => {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast()

  const getToastConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          iconColor: 'text-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          titleColor: 'text-emerald-900',
          descColor: 'text-emerald-700'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-900',
          descColor: 'text-red-700'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          titleColor: 'text-amber-900',
          descColor: 'text-amber-700'
        }
      case 'info':
        return {
          icon: <Info className="w-5 h-5" />,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-900',
          descColor: 'text-blue-700'
        }
    }
  }

  const config = getToastConfig()

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border backdrop-blur-sm shadow-lg transform transition-all duration-300 animate-in slide-in-from-right-full",
      config.bgColor,
      config.borderColor
    )}>
      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-slate-300 to-slate-400 animate-pulse">
          <div 
            className="h-full bg-gradient-to-r from-slate-600 to-slate-700 animate-[shrink_5s_linear_forwards]"
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={cn("flex-shrink-0 mt-0.5", config.iconColor)}>
            {config.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className={cn("font-semibold text-sm", config.titleColor)}>
                {toast.title}
              </h4>
            )}
            {toast.description && (
              <p className={cn("text-sm mt-1", config.descColor)}>
                {toast.description}
              </p>
            )}
            
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className={cn(
                  "mt-2 text-sm font-medium underline hover:no-underline transition-all duration-200",
                  config.titleColor
                )}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Utility functions for common toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: 'success', title, description, ...options })
  },
  error: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: 'error', title, description, ...options })
  },
  warning: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: 'warning', title, description, ...options })
  },
  info: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: 'info', title, description, ...options })
  }
}