/**
 * 댓글 관리 훅 (Zustand 스토어 사용)
 * - 댓글 CRUD 작업
 * - 최적화된 댓글 로드
 */
import { useDataStore } from "@/stores"

export function useComments(postId: number, postType: 'post' | 'notice') {
  const { comments, addComment, deleteComment, getComments } = useDataStore()
  
  const postComments = getComments(postId, postType)
  
  const addCommentToPost = (comment: Omit<typeof comments[0], 'id'>) => {
    addComment({
      ...comment,
      postId,
      postType
    })
  }
  
  const removeComment = (commentId: number) => {
    deleteComment(commentId)
  }
  
  return {
    comments: postComments,
    addComment: addCommentToPost,
    deleteComment: removeComment
  }
}