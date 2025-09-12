/**
 * 게시글 네비게이션 훅
 * - 이전/다음 게시글 찾기
 * - 제목 표시를 위한 데이터 매핑
 */
import { useMemo } from "react"
import { NOTICES, POSTS } from "@/lib/data"
import { noticeStorage, postStorage } from "@/lib/storage"

export function usePostNavigation(currentId: number, type: 'notice' | 'post') {
  const allItems = useMemo(() => {
    if (type === 'notice') {
      const tempNotices = noticeStorage.loadTempNotices()
      return [...tempNotices, ...NOTICES]
    } else {
      const tempPosts = postStorage.loadTempPosts()
      return [...tempPosts, ...POSTS]
    }
  }, [type])

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

  return { prevItem, nextItem }
}
