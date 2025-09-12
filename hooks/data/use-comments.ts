/**
 * 댓글 관리 훅
 * - 댓글 CRUD 작업
 * - 최적화된 댓글 로드
 */
import { useState, useEffect, useCallback } from "react"
import { commentStorage } from "@/lib/storage"
import { Comment } from "@/lib/types"

export function useComments(postId: number, postType: 'post' | 'notice') {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadComments = useCallback(() => {
    setIsLoading(true)
    try {
      const loadedComments = commentStorage.loadComments(postId, postType)
      setComments(loadedComments)
    } catch (error) {
      console.error('댓글 로드 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }, [postId, postType])

  const addComment = useCallback((comment: Omit<Comment, 'id'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now()
    }
    
    const result = commentStorage.addComment(postId, postType, newComment)
    if (result.success) {
      setComments(prev => [...prev, newComment])
    }
    return result
  }, [postId, postType])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  return { comments, isLoading, addComment, reloadComments: loadComments }
}
