/**
 * 홈페이지 데이터 관리 훅
 * - 공지사항 및 커뮤니티 게시글 데이터 로드
 * - 최적화된 데이터 처리
 */
import { useState, useEffect, useMemo } from "react"
import { NOTICES, POSTS } from "@/lib/data"
import { noticeStorage, postStorage } from "@/lib/storage"

export function useHomeData() {
  const [notices, setNotices] = useState(NOTICES)
  const [posts, setPosts] = useState(POSTS)

  useEffect(() => {
    const tempNotices = noticeStorage.loadTempNotices()
    const tempPosts = postStorage.loadTempPosts()
    
    if (tempNotices.length > 0) {
      setNotices([...tempNotices, ...NOTICES])
    }
    
    if (tempPosts.length > 0) {
      setPosts([...tempPosts, ...POSTS])
    }
  }, [])

  const displayNotices = useMemo(() => notices.slice(0, 5), [notices])
  const displayPosts = useMemo(() => posts.slice(0, 5), [posts])

  return { displayNotices, displayPosts }
}
