/**
 * 검색 필터링 훅
 * - 검색어와 필터 조건에 따른 데이터 필터링
 * - 메모이제이션으로 성능 최적화
 */
import { useMemo } from "react"

interface SearchFilterOptions {
  searchTerm: string
  category?: string
  type?: string
}

export function useSearchFilter<T extends Record<string, any>>(
  items: T[],
  options: SearchFilterOptions,
  searchFields: (keyof T)[]
) {
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 검색어 필터링
      if (options.searchTerm) {
        const matchesSearch = searchFields.some(field => {
          const value = item[field]
          return typeof value === 'string' && 
            value.toLowerCase().includes(options.searchTerm.toLowerCase())
        })
        if (!matchesSearch) return false
      }

      // 카테고리 필터링
      if (options.category && options.category !== '전체') {
        if (item.category !== options.category) return false
      }

      // 타입 필터링
      if (options.type && options.type !== '전체') {
        if (item.type !== options.type) return false
      }

      return true
    })
  }, [items, options, searchFields])

  return filteredItems
}
