/**
 * 애플리케이션 전역 상수 정의
 * - 카테고리, 페이지네이션, UI 설정 등 하드코딩된 값들을 중앙 관리
 */

// 커뮤니티 카테고리
export const COMMUNITY_CATEGORIES = [
  "전체", 
  "동기회", 
  "모교소식", 
  "사업소개", 
  "취업정보", 
  "모임제안", 
  "기타"
] as const

// 공지사항 타입
export const NOTICE_TYPES = [
  "전체",
  "일반",
  "중요",
  "행사",
  "시스템"
] as const

// 페이지네이션 설정
export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 3,
  MAX_VISIBLE_PAGES: 5
} as const

// UI 설정
export const UI_CONFIG = {
  SEARCH_DEBOUNCE_DELAY: 300,
  CAROUSEL_AUTOPLAY_DELAY: 5000,
  ANIMATION_DURATION: 200
} as const

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  TEMP_POSTS: "tempPosts",
  TEMP_NOTICES: "tempNotices",
  MEMBERS: "members",
  USER_SESSION: "userSession",
  COMMENTS_PREFIX: "comments_"
} as const

// 사용자 역할
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
} as const

// 학생 유형
export const STUDENT_TYPES = [
  "재학생",
  "졸업생"
] as const

// 소셜 미디어 링크
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com",
  YOUTUBE: "https://youtube.com",
  OLD_HOMEPAGE: "http://www.kunwon.org/"
} as const

// 타입 정의
export type CommunityCategory = typeof COMMUNITY_CATEGORIES[number]
export type NoticeType = typeof NOTICE_TYPES[number]
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type StudentType = typeof STUDENT_TYPES[number]
