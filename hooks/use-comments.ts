/**
 * 댓글 관리 커스텀 훅
 * - 게시글의 댓글 목록을 관리하고 로컬 스토리지에 저장
 * - 댓글 추가, 삭제, 수정 기능 제공
 * - 게시글 ID와 타입별로 댓글 데이터 분리 저장
 * - 실시간 댓글 업데이트 및 상태 동기화
 */
import { useState, useEffect, useCallback, useMemo } from "react"

interface Comment {
  id: number
  author: string
  grade?: string
  content: string
  date: string
  postId?: number
  postType?: string
}

export function useComments(postId: number, type: 'notice' | 'post') {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  const storageKey = useMemo(() => `comments_${type}_${postId}`, [type, postId])

  // 댓글 로드
  const loadComments = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setComments(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load comments:", error)
    } finally {
      setLoading(false)
    }
  }, [storageKey])

  // 댓글 저장 (배치 업데이트)
  const saveComments = useCallback((newComments: Comment[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newComments))
      setComments(newComments)
    } catch (error) {
      console.error("Failed to save comments:", error)
    }
  }, [storageKey])

  // 댓글 추가 (최적화된 업데이트)
  const addComment = useCallback((comment: Comment) => {
    setComments(prev => {
      const newComments = [comment, ...prev]
      // 비동기로 저장
      setTimeout(() => saveComments(newComments), 0)
      return newComments
    })
    setNewComment("")
  }, [saveComments])

  // 댓글 삭제 (최적화된 업데이트)
  const deleteComment = useCallback((commentId: number) => {
    setComments(prev => {
      const newComments = prev.filter(comment => comment.id !== commentId)
      // 비동기로 저장
      setTimeout(() => saveComments(newComments), 0)
      return newComments
    })
  }, [saveComments])

  // 메모이제이션된 댓글 수
  const commentCount = useMemo(() => comments.length, [comments.length])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  return {
    comments,
    newComment,
    setNewComment,
    addComment,
    deleteComment,
    loadComments,
    loading,
    commentCount
  }
}
