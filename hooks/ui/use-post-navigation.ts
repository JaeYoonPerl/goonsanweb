/**
 * 게시글 네비게이션 훅 (Zustand 스토어 사용)
 * - 이전/다음 게시글 찾기
 * - 제목 표시를 위한 데이터 매핑
 */
import { useMemo } from "react"
import { useDataStore } from "@/stores"

export function usePostNavigation(currentId: number, type: 'notice' | 'post') {
  const { notices, posts } = useDataStore()
  
  const allItems = useMemo(() => {
    return type === 'notice' ? notices : posts
  }, [type, notices, posts])

  const currentIndex = useMemo(() => 
    allItems.findIndex(item => item.id === currentId), 
    [allItems, currentId]
  )

  const prevItem = useMemo(() => 
    currentIndex > 0 ? allItems[currentIndex - 1] : null, 
    [allItems, currentIndex]
  )

  const nextItem = useMemo(() => 
    currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null, 
    [allItems, currentIndex]
  )

  return {
    prevItem,
    nextItem,
    currentIndex,
    totalItems: allItems.length
  }
}