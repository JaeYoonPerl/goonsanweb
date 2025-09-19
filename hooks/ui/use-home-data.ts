/**
 * 홈페이지 데이터 관리 훅 (Zustand 스토어 사용)
 * - 공지사항 및 커뮤니티 게시글 데이터 로드
 * - 최신 글 우선 정렬 및 임시 데이터 포함
 * - 최적화된 데이터 처리
 */
import { useMemo, useState, useEffect } from "react"
import { useDataStore } from "@/stores"

export function useHomeData() {
  const { notices, posts } = useDataStore()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setIsClient(true)
  }, [])

  // localStorage 변경 감지 (클라이언트 사이드에서만)
  useEffect(() => {
    if (!isClient) return

    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1)
    }

    window.addEventListener('storage', handleStorageChange)
    
    // 주기적으로 localStorage 확인 (다른 탭에서의 변경 감지)
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1)
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [isClient])

  const displayNotices = useMemo(() => {
    // 서버 사이드에서는 기본 데이터만 반환
    if (!isClient) {
      return notices
        .sort((a, b) => {
          // 고정된 글 우선
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          
          // 그 다음 최신 순으로 정렬 (id가 클수록 최신)
          return b.id - a.id
        })
        .slice(0, 5)
    }

    // 클라이언트 사이드에서는 localStorage 데이터도 포함
    let tempNotices = []
    try {
      tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
    } catch (error) {
      console.error("localStorage 읽기 오류:", error)
      tempNotices = []
    }
    
    const allNotices = [...tempNotices, ...notices]
    
    // 고정된 글 우선, 그 다음 최신 순으로 정렬
    return allNotices
      .sort((a, b) => {
        // 고정된 글 우선
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        
        // 그 다음 최신 순으로 정렬 (id가 클수록 최신)
        return b.id - a.id
      })
      .slice(0, 5)
  }, [notices, refreshTrigger, isClient])

  const displayPosts = useMemo(() => {
    // 서버 사이드에서는 기본 데이터만 반환
    if (!isClient) {
      return posts
        .sort((a, b) => {
          // 고정된 글 우선
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          
          // 그 다음 최신 순으로 정렬 (id가 클수록 최신)
          return b.id - a.id
        })
        .slice(0, 5)
    }

    // 클라이언트 사이드에서는 localStorage 데이터도 포함
    let tempPosts = []
    try {
      tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
    } catch (error) {
      console.error("localStorage 읽기 오류:", error)
      tempPosts = []
    }
    
    const allPosts = [...tempPosts, ...posts]
    
    // 고정된 글 우선, 그 다음 최신 순으로 정렬
    return allPosts
      .sort((a, b) => {
        // 고정된 글 우선
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        
        // 그 다음 최신 순으로 정렬 (id가 클수록 최신)
        return b.id - a.id
      })
      .slice(0, 5)
  }, [posts, refreshTrigger, isClient])

  return { displayNotices, displayPosts }
}