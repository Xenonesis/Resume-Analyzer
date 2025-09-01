import React, { useState } from 'react'
import { Filter, RotateCcw } from 'lucide-react'

export interface FilterOptions {
  dateRange: {
    start: Date | null
    end: Date | null
    preset: 'all' | '7days' | '30days' | '90days' | 'custom'
  }
  scoreRange: {
    min: number
    max: number
  }
  categories: string[]
  companies: string[]
  sortBy: 'date' | 'score' | 'company' | 'category'
  sortOrder: 'asc' | 'desc'
}

interface DashboardFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  availableCompanies: string[]
  availableCategories: string[]
  onReset: () => void
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCompanies,
  availableCategories,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDatePresetChange = (preset: FilterOptions['dateRange']['preset']) => {
    let start: Date | null = null
    let end: Date | null = null

    const now = new Date()
    
    switch (preset) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        end = now
        break
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        end = now
        break
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        end = now
        break
      case 'all':
        start = null
        end = null
        break
      case 'custom':
        // Keep existing dates for custom
        start = filters.dateRange.start
        end = filters.dateRange.end
        break
    }

    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, preset, start, end }
    })
  }

  const handleScoreRangeChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      scoreRange: {
        ...filters.scoreRange,
        [type]: value
      }
    })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleCompanyToggle = (company: string) => {
    const newCompanies = filters.companies.includes(company)
      ? filters.companies.filter(c => c !== company)
      : [...filters.companies, company]
    
    onFiltersChange({
      ...filters,
      companies: newCompanies
    })
  }

  const formatDate = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : ''
  }

  const parseDate = (dateString: string) => {
    return dateString ? new Date(dateString) : null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
          >
            <span>{isExpanded ? 'Less' : 'More'} Filters</span>
          </button>
        </div>
      </div>

      {/* Quick Date Range Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {[
          { key: 'all', label: 'All Time' },
          { key: '7days', label: 'Last 7 Days' },
          { key: '30days', label: 'Last 30 Days' },
          { key: '90days', label: 'Last 90 Days' },
          { key: 'custom', label: 'Custom Range' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleDatePresetChange(key as FilterOptions['dateRange']['preset'])}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              filters.dateRange.preset === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      {filters.dateRange.preset === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={formatDate(filters.dateRange.start)}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: {
                  ...filters.dateRange,
                  start: parseDate(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formatDate(filters.dateRange.end)}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: {
                  ...filters.dateRange,
                  end: parseDate(e.target.value)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Score Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum Score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange.min}
              onChange={(e) => handleScoreRangeChange('min', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{filters.scoreRange.min}</span>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum Score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange.max}
              onChange={(e) => handleScoreRangeChange('max', parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{filters.scoreRange.max}</span>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Company Filter */}
          {availableCompanies.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Companies</label>
              <div className="flex flex-wrap gap-2">
                {availableCompanies.map(company => (
                  <button
                    key={company}
                    onClick={() => handleCompanyToggle(company)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.companies.includes(company)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  sortBy: e.target.value as FilterOptions['sortBy']
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="score">Score</option>
                <option value="company">Company</option>
                <option value="category">Top Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  sortOrder: e.target.value as FilterOptions['sortOrder']
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}