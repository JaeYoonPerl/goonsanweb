/**
 * 데이터 관리 Zustand 스토어
 * - 공지사항, 커뮤니티 게시글, 댓글 데이터 관리
 * - CRUD 작업 및 상태 관리
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NOTICES, POSTS } from '@/lib/data'

export interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  likes: number
  type: string
  comments: number
  isImportant: boolean
}

export interface Post {
  id: number
  title: string
  content: string
  author: string
  grade: string
  date: string
  views: number
  likes: number
  category: string
  comments: number
}

export interface Comment {
  id: number
  author: string
  grade: string
  content: string
  date: string
  postId: number
  postType: 'notice' | 'post'
}

interface DataState {
  notices: Notice[]
  posts: Post[]
  comments: Comment[]
  loading: boolean
}

interface DataActions {
  // 공지사항 관련
  addNotice: (notice: Omit<Notice, 'id'>) => void
  updateNotice: (id: number, notice: Partial<Notice>) => void
  deleteNotice: (id: number) => void
  getNotice: (id: number) => Notice | undefined
  togglePinNotice: (id: number) => void
  
  // 게시글 관련
  addPost: (post: Omit<Post, 'id'>) => void
  updatePost: (id: number, post: Partial<Post>) => void
  deletePost: (id: number) => void
  getPost: (id: number) => Post | undefined
  togglePinPost: (id: number) => void
  
  // 댓글 관련
  addComment: (comment: Omit<Comment, 'id'>) => void
  deleteComment: (id: number) => void
  getComments: (postId: number, postType: 'notice' | 'post') => Comment[]
  
  // 유틸리티
  setLoading: (loading: boolean) => void
  loadTempData: () => void
}

type DataStore = DataState & DataActions

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      notices: NOTICES,
      posts: POSTS,
      comments: [],
      loading: false,

      // 공지사항 액션들
      addNotice: (notice) => {
        const newNotice: Notice = {
          ...notice,
          id: Date.now()
        }
        set((state) => ({
          notices: [newNotice, ...state.notices]
        }))
      },

      updateNotice: (id, updatedNotice) => {
        set((state) => ({
          notices: state.notices.map(notice =>
            notice.id === id ? { ...notice, ...updatedNotice } : notice
          )
        }))
      },

      deleteNotice: (id) => {
        set((state) => ({
          notices: state.notices.filter(notice => notice.id !== id),
          comments: state.comments.filter(comment => 
            !(comment.postId === id && comment.postType === 'notice')
          )
        }))
      },

      getNotice: (id) => {
        return get().notices.find(notice => notice.id === id)
      },

      togglePinNotice: (id) => {
        set((state) => ({
          notices: state.notices.map(notice =>
            notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
          )
        }))
        
        // localStorage의 임시 데이터도 업데이트
        const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
        const updatedTempNotices = tempNotices.map((notice: any) =>
          notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
        )
        localStorage.setItem("tempNotices", JSON.stringify(updatedTempNotices))
      },

      // 게시글 액션들
      addPost: (post) => {
        const newPost: Post = {
          ...post,
          id: Date.now()
        }
        set((state) => ({
          posts: [newPost, ...state.posts]
        }))
      },

      updatePost: (id, updatedPost) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, ...updatedPost } : post
          )
        }))
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter(post => post.id !== id),
          comments: state.comments.filter(comment => 
            !(comment.postId === id && comment.postType === 'post')
          )
        }))
      },

      getPost: (id) => {
        return get().posts.find(post => post.id === id)
      },

      togglePinPost: (id) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, isPinned: !post.isPinned } : post
          )
        }))
        
        // localStorage의 임시 데이터도 업데이트
        const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
        const updatedTempPosts = tempPosts.map((post: any) =>
          post.id === id ? { ...post, isPinned: !post.isPinned } : post
        )
        localStorage.setItem("tempPosts", JSON.stringify(updatedTempPosts))
      },

      // 댓글 액션들
      addComment: (comment) => {
        const newComment: Comment = {
          ...comment,
          id: Date.now()
        }
        set((state) => ({
          comments: [...state.comments, newComment]
        }))
      },

      deleteComment: (id) => {
        set((state) => ({
          comments: state.comments.filter(comment => comment.id !== id)
        }))
      },

      getComments: (postId, postType) => {
        return get().comments.filter(comment => 
          comment.postId === postId && comment.postType === postType
        )
      },

      // 유틸리티 액션들
      setLoading: (loading) => {
        set({ loading })
      },

      loadTempData: () => {
        try {
          // 임시 저장된 데이터 로드
          const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
          const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
          const tempComments = JSON.parse(localStorage.getItem("tempComments") || "[]")
          
          set((state) => ({
            notices: [...tempNotices, ...state.notices],
            posts: [...tempPosts, ...state.posts],
            comments: [...tempComments, ...state.comments]
          }))
        } catch (error) {
          console.error("임시 데이터 로드 오류:", error)
        }
      }
    }),
    {
      name: "data-storage",
      partialize: (state) => ({
        notices: state.notices,
        posts: state.posts,
        comments: state.comments
      })
    }
  )
)
