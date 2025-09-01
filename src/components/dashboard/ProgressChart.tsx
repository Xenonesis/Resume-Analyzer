import React from 'react'

interface ProgressChartProps {
  data: Array<{
    label: string
    value: number
    color: string
    maxValue?: number
  }>
  title: string
  showValues?: boolean
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  showValues = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const maxValue = item.maxValue || 100
          const percentage = (item.value / maxValue) * 100
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${item.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                {showValues && (
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {item.value.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}