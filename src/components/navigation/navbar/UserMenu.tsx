import React, { useState } from 'react'
import { User, LogOut } from 'lucide-react'

interface UserMenuProps {
  user: any
  handleSignOut: () => void
  isSigningOut: boolean
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, handleSignOut, isSigningOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center border border-blue-200/50 group-hover:scale-105 transition-all duration-300">
          <span className="text-blue-700 font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="font-semibold text-slate-900">
            {user?.name || 'User'}
          </div>
          <div className="text-xs text-slate-500">
            {user?.email || ''}
          </div>
        </div>
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/50 py-2 z-[110] backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center border border-blue-200/50">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-sm text-slate-500">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              handleSignOut()
              setIsDropdownOpen(false)
            }}
            disabled={isSigningOut}
            className="flex items-center space-x-3 w-full text-left px-6 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-300 disabled:opacity-50 group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      )}
    </div>
  )
}