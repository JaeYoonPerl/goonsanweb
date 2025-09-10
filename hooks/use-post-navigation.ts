/**
 * 게시글 네비게이션 커스텀 훅
 * - 현재 게시글의 이전/다음 글 정보를 제공
 * - 공지사항과 커뮤니티 게시글 모두 지원
 * - 정렬된 목록에서 현재 글의 위치를 찾아 네비게이션 정보 반환
 * - 첫 번째/마지막 글의 경우 null 반환
 */
import { useMemo } from "react"
import { NOTICES, POSTS } from "@/lib/data"

interface Post {
  id: number
  title: string
  [key: string]: any
}

export function usePostNavigation(currentId: number, type: 'notice' | 'post') {
  const allPosts = useMemo(() => {
    const baseData = type === 'notice' ? NOTICES : POSTS
    
    // 로컬스토리지에서 임시 데이터 로드
    try {
      const storageKey = type === 'notice' ? 'tempNotices' : 'tempPosts'
      const tempData = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return [...tempData, ...baseData]
    } catch {
      return baseData
    }
  }, [type])

  const sortedPosts = useMemo(() => {
    return allPosts.sort((a, b) => {
      if (type === 'notice' && 'isImportant' in a && 'isImportant' in b) {
        if (a.isImportant && !b.isImportant) return -1
        if (!a.isImportant && b.isImportant) return 1
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [allPosts, type])

  const currentIndex = useMemo(() => {
    return sortedPosts.findIndex(post => post.id === currentId)
  }, [sortedPosts, currentId])

  const prevPost = useMemo(() => {
    return currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  }, [sortedPosts, currentIndex])

  const nextPost = useMemo(() => {
    return currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
  }, [sortedPosts, currentIndex])

  return {
    prevPost,
    nextPost,
    currentIndex: currentIndex + 1,
    totalPosts: sortedPosts.length
  }
}
