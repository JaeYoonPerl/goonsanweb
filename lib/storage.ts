/**
 * 로컬 스토리지 유틸리티 함수들
 * - 안전한 데이터 저장/로드 기능 제공
 * - 에러 처리 및 타입 안정성 보장
 * - 중앙화된 스토리지 관리
 * - 사용자 친화적인 에러 메시지 제공
 */

import { STORAGE_KEYS } from "./constants"
import { CommunityPost, Notice, Comment, User } from "./types"
import { handleStorageError, safeExecute, AppError } from "./error-handler"

/**
 * 안전한 JSON 파싱 함수
 * @param data - 파싱할 JSON 문자열
 * @param defaultValue - 파싱 실패 시 반환할 기본값
 * @returns 파싱된 데이터 또는 기본값
 */
function safeJsonParse<T>(data: string | null, defaultValue: T): T {
  if (!data) return defaultValue
  
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('JSON 파싱 오류:', error)
    return defaultValue
  }
}

/**
 * 안전한 JSON 저장 함수
 * @param key - 저장할 키
 * @param data - 저장할 데이터
 * @returns 저장 성공 여부와 에러 정보
 */
function safeJsonSet<T>(key: string, data: T): { success: boolean; error?: AppError } {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return { success: true }
  } catch (error) {
    const appError = handleStorageError(error, '저장')
    return { success: false, error: appError }
  }
}

// 게시글 관련 함수들
export const postStorage = {
  /**
   * 임시 게시글 저장
   */
  saveTempPosts: (posts: CommunityPost[]): { success: boolean; error?: AppError } => {
    return safeJsonSet(STORAGE_KEYS.TEMP_POSTS, posts)
  },

  /**
   * 임시 게시글 로드
   */
  loadTempPosts: (): CommunityPost[] => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.TEMP_POSTS), [])
  },

  /**
   * 게시글 추가
   */
  addPost: (post: CommunityPost): { success: boolean; error?: AppError } => {
    const existingPosts = postStorage.loadTempPosts()
    const updatedPosts = [post, ...existingPosts]
    return postStorage.saveTempPosts(updatedPosts)
  },

  /**
   * 게시글 삭제
   */
  deletePost: (postId: number): { success: boolean; error?: AppError } => {
    const existingPosts = postStorage.loadTempPosts()
    const updatedPosts = existingPosts.filter(post => post.id !== postId)
    return postStorage.saveTempPosts(updatedPosts)
  }
}

// 공지사항 관련 함수들
export const noticeStorage = {
  /**
   * 임시 공지사항 저장
   */
  saveTempNotices: (notices: Notice[]): { success: boolean; error?: AppError } => {
    return safeJsonSet(STORAGE_KEYS.TEMP_NOTICES, notices)
  },

  /**
   * 임시 공지사항 로드
   */
  loadTempNotices: (): Notice[] => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.TEMP_NOTICES), [])
  },

  /**
   * 공지사항 추가
   */
  addNotice: (notice: Notice): { success: boolean; error?: AppError } => {
    const existingNotices = noticeStorage.loadTempNotices()
    const updatedNotices = [notice, ...existingNotices]
    return noticeStorage.saveTempNotices(updatedNotices)
  },

  /**
   * 공지사항 삭제
   */
  deleteNotice: (noticeId: number): { success: boolean; error?: AppError } => {
    const existingNotices = noticeStorage.loadTempNotices()
    const updatedNotices = existingNotices.filter(notice => notice.id !== noticeId)
    return noticeStorage.saveTempNotices(updatedNotices)
  }
}

// 댓글 관련 함수들
export const commentStorage = {
  /**
   * 댓글 저장
   */
  saveComments: (postId: number, postType: 'post' | 'notice', comments: Comment[]): { success: boolean; error?: AppError } => {
    const key = `${STORAGE_KEYS.COMMENTS_PREFIX}${postType}_${postId}`
    return safeJsonSet(key, comments)
  },

  /**
   * 댓글 로드
   */
  loadComments: (postId: number, postType: 'post' | 'notice'): Comment[] => {
    const key = `${STORAGE_KEYS.COMMENTS_PREFIX}${postType}_${postId}`
    return safeJsonParse(localStorage.getItem(key), [])
  },

  /**
   * 댓글 추가
   */
  addComment: (postId: number, postType: 'post' | 'notice', comment: Comment): { success: boolean; error?: AppError } => {
    const existingComments = commentStorage.loadComments(postId, postType)
    const updatedComments = [...existingComments, comment]
    return commentStorage.saveComments(postId, postType, updatedComments)
  },

  /**
   * 모든 댓글 로드 (사용자별)
   */
  loadAllUserComments: (userName: string, userGrade: string): Comment[] => {
    const allComments: Comment[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEYS.COMMENTS_PREFIX)) {
        try {
          const comments = safeJsonParse(localStorage.getItem(key), [])
          allComments.push(...comments)
        } catch (error) {
          console.error(`댓글 로드 오류 (${key}):`, error)
        }
      }
    }

    return allComments.filter(comment => 
      comment.author === userName && comment.grade === userGrade
    )
  }
}

// 회원 관련 함수들
export const memberStorage = {
  /**
   * 회원 목록 저장
   */
  saveMembers: (members: User[]): { success: boolean; error?: AppError } => {
    return safeJsonSet(STORAGE_KEYS.MEMBERS, members)
  },

  /**
   * 회원 목록 로드
   */
  loadMembers: (): User[] => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.MEMBERS), [])
  },

  /**
   * 회원 추가
   */
  addMember: (member: User): { success: boolean; error?: AppError } => {
    const existingMembers = memberStorage.loadMembers()
    const updatedMembers = [...existingMembers, member]
    return memberStorage.saveMembers(updatedMembers)
  },

  /**
   * 회원 상태 업데이트
   */
  updateMemberStatus: (memberId: number, isActive: boolean): { success: boolean; error?: AppError } => {
    const existingMembers = memberStorage.loadMembers()
    const updatedMembers = existingMembers.map(member => 
      member.id === memberId ? { ...member, isActive } : member
    )
    return memberStorage.saveMembers(updatedMembers)
  }
}

// 세션 관련 함수들
export const sessionStorage = {
  /**
   * 사용자 세션 저장
   */
  saveSession: (user: User): { success: boolean; error?: AppError } => {
    return safeJsonSet(STORAGE_KEYS.USER_SESSION, user)
  },

  /**
   * 사용자 세션 로드
   */
  loadSession: (): User | null => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEYS.USER_SESSION), null)
  },

  /**
   * 세션 삭제
   */
  clearSession: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
    } catch (error) {
      console.error('세션 삭제 오류:', error)
    }
  }
}
