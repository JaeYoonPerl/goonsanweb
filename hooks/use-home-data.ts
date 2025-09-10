/**
 * 홈페이지 데이터 관리 커스텀 훅
 * - 공지사항과 커뮤니티 게시글 데이터를 관리
 * - 중요 공지 우선 정렬 및 최신 순 정렬
 * - 임시 저장된 데이터와 기본 데이터 통합
 * - 페이지네이션을 위한 데이터 슬라이싱
 */
import { useState, useEffect, useCallback, useMemo } from "react"
import { NOTICES, POSTS, CONFIG } from "@/lib/data"
import { Notice, Post } from "@/lib/data"

// 정렬 함수들을 메모이제이션
const sortByDate = (a: { date: string }, b: { date: string }) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()

const sortNotices = (notices: Notice[]) => {
  return notices.sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1
    if (!a.isImportant && b.isImportant) return 1
    return sortByDate(a, b)
  })
}

const sortPosts = (posts: Post[]) => posts.sort(sortByDate)

export function useHomeData() {
  const [displayNotices, setDisplayNotices] = useState<Notice[]>(() => 
    sortNotices([...NOTICES]).slice(0, CONFIG.DISPLAY_ITEMS_COUNT)
  )
  const [displayPosts, setDisplayPosts] = useState<Post[]>(() => 
    sortPosts([...POSTS]).slice(0, CONFIG.DISPLAY_ITEMS_COUNT)
  )

  const loadNotices = useCallback(() => {
    try {
      const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
      const allNotices = [...NOTICES, ...tempNotices]
      const sortedNotices = sortNotices(allNotices)
      setDisplayNotices(sortedNotices.slice(0, CONFIG.DISPLAY_ITEMS_COUNT))
    } catch (error) {
      console.error("Failed to load notices:", error)
      setDisplayNotices(sortNotices([...NOTICES]).slice(0, CONFIG.DISPLAY_ITEMS_COUNT))
    }
  }, [])

  const loadPosts = useCallback(() => {
    try {
      const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
      const allPosts = [...POSTS, ...tempPosts]
      const sortedPosts = sortPosts(allPosts)
      setDisplayPosts(sortedPosts.slice(0, CONFIG.DISPLAY_ITEMS_COUNT))
    } catch (error) {
      console.error("Failed to load posts:", error)
      setDisplayPosts(sortPosts([...POSTS]).slice(0, CONFIG.DISPLAY_ITEMS_COUNT))
    }
  }, [])

  const refreshData = useCallback(() => {
    loadNotices()
    loadPosts()
  }, [loadNotices, loadPosts])

  useEffect(() => {
    refreshData()

    // 주기적으로 업데이트 (30초마다)
    const interval = setInterval(refreshData, CONFIG.DATA_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshData])

  // 페이지 포커스 시 목록 새로고침
  useEffect(() => {
    const handleFocus = () => refreshData()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshData])

  // 메모이제이션된 반환값
  return useMemo(() => ({
    displayNotices,
    displayPosts,
    refreshData,
  }), [displayNotices, displayPosts, refreshData])
}
