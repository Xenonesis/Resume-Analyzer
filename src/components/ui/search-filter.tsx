import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, ChevronDown, Calendar, SortAsc, SortDesc } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Badge } from './badge'

interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'range'
  options?: FilterOption[]
  placeholder?: string
}

interface SortOption {
  id: string
  label: string
  value: string
}

interface SearchFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filterGroups?: FilterGroup[]
  activeFilters?: Record<string, any>
  onFilterChange?: (filters: Record<string, any>) => void
  sortOptions?: SortOption[]
  activeSortBy?: string
  activeSortOrder?: 'asc' | 'desc'
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void
  placeholder?: string
  showFilterCount?: boolean
  className?: string
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  sortOptions = [],
  activeSortBy,
  activeSortOrder = 'asc',
  onSortChange,
  placeholder = "Search...",
  showFilterCount = true,
  className
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => 
      value !== null && value !== undefined && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  const handleFilterChange = (groupId: string, value: any) => {
    if (!onFilterChange) return
    
    const newFilters = { ...activeFilters }
    newFilters[groupId] = value
    onFilterChange(newFilters)
  }

  const clearFilter = (groupId: string) => {
    if (!onFilterChange) return
    
    const newFilters = { ...activeFilters }
    delete newFilters[groupId]
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    if (!onFilterChange) return
    onFilterChange({})
  }

  const renderFilterGroup = (group: FilterGroup) => {
    const currentValue = activeFilters[group.id]

    switch (group.type) {
      case 'select':
        return (
          <div key={group.id} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{group.label}</label>
            <select
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(group.id, e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">{group.placeholder || `Select ${group.label}`}</option>
              {group.options?.map(option => (
                <option key={option.id} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        )

      case 'multiselect':
        return (
          <div key={group.id} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{group.label}</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {group.options?.map(option => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(currentValue || []).includes(option.value)}
                    onChange={(e) => {
                      const current = currentValue || []
                      const newValue = e.target.checked
                        ? [...current, option.value]
                        : current.filter((v: string) => v !== option.value)
                      handleFilterChange(group.id, newValue)
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">
                    {option.label} {option.count && `(${option.count})`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'date':
        return (
          <div key={group.id} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{group.label}</label>
            <input
              type="date"
              value={currentValue || ''}
              onChange={(e) => handleFilterChange(group.id, e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filterGroups.length > 0 && (
          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilterCount && getActiveFilterCount() > 0 && (
                <Badge variant="default" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
              <ChevronDown className={cn(
                "w-4 h-4 ml-2 transition-transform duration-200",
                isFilterOpen && "rotate-180"
              )} />
            </Button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-50 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {filterGroups.map(renderFilterGroup)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort Button */}
        {sortOptions.length > 0 && (
          <div className="relative" ref={sortRef}>
            <Button
              variant="outline"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              {activeSortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4 mr-2" />
              ) : (
                <SortDesc className="w-4 h-4 mr-2" />
              )}
              Sort
              <ChevronDown className={cn(
                "w-4 h-4 ml-2 transition-transform duration-200",
                isSortOpen && "rotate-180"
              )} />
            </Button>

            {/* Sort Dropdown */}
            {isSortOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (onSortChange) {
                        const newOrder = activeSortBy === option.value && activeSortOrder === 'asc' ? 'desc' : 'asc'
                        onSortChange(option.value, newOrder)
                      }
                      setIsSortOpen(false)
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between",
                      activeSortBy === option.value && "bg-blue-50 text-blue-700"
                    )}
                  >
                    <span>{option.label}</span>
                    {activeSortBy === option.value && (
                      activeSortOrder === 'asc' ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([groupId, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null
            
            const group = filterGroups.find(g => g.id === groupId)
            if (!group) return null

            if (Array.isArray(value)) {
              return value.map(v => {
                const option = group.options?.find(o => o.value === v)
                return (
                  <Badge
                    key={`${groupId}-${v}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {group.label}: {option?.label || v}
                    <button
                      onClick={() => {
                        const newValue = value.filter((item: string) => item !== v)
                        handleFilterChange(groupId, newValue.length > 0 ? newValue : undefined)
                      }}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )
              })
            } else {
              const option = group.options?.find(o => o.value === value)
              return (
                <Badge
                  key={groupId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {group.label}: {option?.label || value}
                  <button
                    onClick={() => clearFilter(groupId)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}