import React from 'react'
import { useNavigate } from 'react-router'

export const Logo: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer group"
      onClick={() => navigate('/app')}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]"></div>
        </div>

        {/* AI Brain/Document hybrid icon */}
        <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none">
          {/* Document base */}
          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d="M14 2v6h6" />

          {/* AI Neural network dots */}
          <circle cx="9" cy="9" r="1" fill="currentColor" opacity="0.8"/>
          <circle cx="15" cy="9" r="1" fill="currentColor" opacity="0.8"/>
          <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8"/>
          <circle cx="9" cy="15" r="1" fill="currentColor" opacity="0.8"/>
          <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.8"/>

          {/* Neural connections */}
          <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"
                d="M9 9 L12 12 L15 9 M9 15 L12 12 L15 15 M9 9 L9 15 M15 9 L15 15"/>
        </svg>
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
        AI Resume Analyzer
      </h1>
    </div>
  )
}