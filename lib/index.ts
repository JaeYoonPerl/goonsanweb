/**
 * 모든 라이브러리 유틸리티들을 한 곳에서 export하는 메인 인덱스 파일
 * - 설정, 타입, 스토리지, 에러 처리 등을 통합 관리
 * - import 경로 단순화
 */

// 상수
export * from './constants'

// 타입 (중복 제거)
export type {
  BasePost,
  CommunityPost,
  Notice,
  Comment,
  User
} from './types'

// 스토리지 및 에러 처리
export * from './storage'
export * from './error-handler'

// 유틸리티 함수
export * from './utils'

// 데이터 (중복 제거)
export {
  NOTICES,
  POSTS
} from './data'
