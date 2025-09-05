import React, { useState } from 'react'
import { Plus, X, Upload, Settings, HelpCircle, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[]
  className?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  actions = [],
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const defaultActions: FloatingAction[] = [
    {
      icon: <Upload className="w-5 h-5" />,
      label: "Upload Resume",
      onClick: () => console.log("Upload clicked"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Help",
      onClick: () => console.log("Help clicked"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Feedback",
      onClick: () => console.log("Feedback clicked"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ]

  const finalActions = actions.length > 0 ? actions : defaultActions

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Action Items */}
      <div className={cn(
        "flex flex-col-reverse items-end space-y-reverse space-y-3 mb-4 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {finalActions.map((action, index) => (
          <div
            key={index}
            className="group flex items-center space-x-3 animate-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Label */}
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </div>
            
            {/* Action Button */}
            <button
              onClick={() => {
                action.onClick()
                setIsOpen(false)
              }}
              className={cn(
                "w-12 h-12 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center",
                action.color || "bg-slate-500 hover:bg-slate-600"
              )}
            >
              {action.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center group",
          isOpen && "rotate-45"
        )}
      >
        <div className={cn(
          "transition-transform duration-300",
          isOpen ? "rotate-45" : "rotate-0"
        )}>
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}