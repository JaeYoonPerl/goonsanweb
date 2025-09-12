/**
 * 애플리케이션 전역 타입 정의
 * - 모든 컴포넌트에서 사용하는 공통 타입들을 중앙 관리
 * - 타입 안정성 향상 및 코드 재사용성 증대
 */

import { COMMUNITY_CATEGORIES, NOTICE_TYPES, USER_ROLES, STUDENT_TYPES } from "./constants"

// 타입 정의
export type CommunityCategory = typeof COMMUNITY_CATEGORIES[number]
export type NoticeType = typeof NOTICE_TYPES[number]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type StudentType = typeof STUDENT_TYPES[number]

// 기본 게시글 인터페이스
export interface BasePost {
  id: number
  title: string
  content: string
  author: string
  grade: string
  date: string
  views: number
  likes: number
}

// 커뮤니티 게시글
export interface CommunityPost extends BasePost {
  category: CommunityCategory
}

// 공지사항
export interface Notice extends BasePost {
  type: NoticeType
  isImportant: boolean
}

// 댓글
export interface Comment {
  id: number
  content: string
  author: string
  grade: string
  date: string
  postId: number
  postType: 'post' | 'notice'
}

// 사용자 정보
export interface User {
  id: number
  email: string
  name: string
  grade: string
  role: UserRole
  studentType: StudentType
  birthDate: string
  isActive: boolean
}

// 로그인 정보
export interface LoginData {
  email: string
  password: string
}

// 회원가입 정보
export interface SignupData {
  email: string
  password: string
  name: string
  studentType: StudentType
  birthDate: string
}

// 검색 필터
export interface SearchFilter {
  searchTerm: string
  category?: CommunityCategory
  type?: NoticeType
}

// 페이지네이션 정보
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 폼 상태
export interface FormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

// 컴포넌트 공통 Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 모달 Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

// 버튼 Props 확장
export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

// 카드 Props
export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  image?: string
  href?: string
}

// 기존 데이터와의 호환성을 위한 타입
export interface LegacyPost {
  id: number
  title: string
  content: string
  author: string
  grade: string
  date: string
  views: number
  likes: number
  category: string
}

export interface LegacyNotice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  likes: number
  type: string
  isImportant: boolean
}
