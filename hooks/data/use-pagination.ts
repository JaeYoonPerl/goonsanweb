/**
 * 페이지네이션 훅
 * - 페이지 상태 관리
 * - 페이지네이션 계산
 * - 페이지 이동 함수
 */
import { useState, useMemo, useCallback } from "react"

interface UsePaginationOptions {
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
) {
  const { itemsPerPage = 10, initialPage = 1 } = options
  const [currentPage, setCurrentPage] = useState(initialPage)

  const paginationInfo = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = items.slice(startIndex, endIndex)

    return {
      currentItems,
      totalPages,
      totalItems: items.length,
      currentPage,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }
  }, [items, currentPage, itemsPerPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page)
    }
  }, [paginationInfo.totalPages])

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [paginationInfo.hasNext])

  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrev) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginationInfo.hasPrev])

  return {
    ...paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage
  }
}
