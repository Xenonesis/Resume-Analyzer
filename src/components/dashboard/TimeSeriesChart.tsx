import React from 'react'

interface TimeSeriesDataPoint {
  date: string
  score: number
  count: number
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  title: string
  height?: number
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  height = 240
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p>No data available for the selected period</p>
        </div>
      </div>
    )
  }

  const maxScore = Math.max(...data.map(d => d.score))
  const minScore = Math.min(...data.map(d => d.score))
  const scoreRange = maxScore - minScore || 1

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* Chart Container */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>{maxScore.toFixed(0)}</span>
          <span>{((maxScore + minScore) / 2).toFixed(0)}</span>
          <span>{minScore.toFixed(0)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 mr-4 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map(i => (
              <div key={i} className="border-t border-gray-200"></div>
            ))}
          </div>

          {/* Data visualization */}
          <div className="absolute inset-0 flex items-end justify-between space-x-1">
            {data.map((point, index) => {
              const barHeight = ((point.score - minScore) / scoreRange) * (height - 40)
              const intensity = Math.min(point.count / 5, 1) // Normalize count for color intensity
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div>Date: {new Date(point.date).toLocaleDateString()}</div>
                    <div>Score: {point.score.toFixed(1)}</div>
                    <div>Count: {point.count}</div>
                  </div>

                  {/* Bar */}
                  <div 
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ 
                      height: `${Math.max(barHeight, 4)}px`,
                      backgroundColor: `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`
                    }}
                  ></div>

                  {/* X-axis label */}
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left whitespace-nowrap">
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-300 rounded"></div>
          <span>Lower activity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Higher activity</span>
        </div>
      </div>
    </div>
  )
}