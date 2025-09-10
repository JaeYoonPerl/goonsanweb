import { useState, useMemo } from "react"

interface UseSearchFilterProps<T> {
  items: T[]
  searchFields: (keyof T)[]
  categoryField?: keyof T
  categories?: string[]
}

export function useSearchFilter<T>({
  items,
  searchFields,
  categoryField,
  categories = [],
}: UseSearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const filteredItems = useMemo(() => {
    let filtered = items

    // 검색어 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // 카테고리 필터링
    if (selectedCategory !== "전체" && categoryField) {
      filtered = filtered.filter((item) => {
        const value = item[categoryField]
        return typeof value === "string" && value === selectedCategory
      })
    }

    return filtered
  }, [items, searchTerm, selectedCategory, searchFields, categoryField])

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
  }
}
