/**
 * Zustand 스토어 통합 export
 * - 모든 스토어를 한 곳에서 관리
 * - import 경로 단순화
 */

export { useAuthStore } from './auth-store'
export { useDataStore } from './data-store'

// 편의를 위한 타입 export
export type { User } from './auth-store'
export type { Notice, Post, Comment } from './data-store'
