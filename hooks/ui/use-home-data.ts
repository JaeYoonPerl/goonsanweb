/**
 * 홈페이지 데이터 관리 훅 (Zustand 스토어 사용)
 * - 공지사항 및 커뮤니티 게시글 데이터 로드
 * - 최적화된 데이터 처리
 */
import { useMemo } from "react"
import { useDataStore } from "@/stores"

export function useHomeData() {
  const { notices, posts } = useDataStore()

  const displayNotices = useMemo(() => notices.slice(0, 5), [notices])
  const displayPosts = useMemo(() => posts.slice(0, 5), [posts])

  return { displayNotices, displayPosts }
}