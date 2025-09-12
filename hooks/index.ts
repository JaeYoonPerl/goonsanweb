/**
 * 모든 훅들을 한 곳에서 export하는 메인 인덱스 파일
 * - 기능별로 그룹화된 훅들을 통합 관리
 * - import 경로 단순화
 */

// 인증 관련
export * from './auth'

// 스토리지 관련
export * from './storage'

// UI 관련
export * from './ui'

// 검색 관련
export * from './search'

// 데이터 관련
export * from './data'

// 기존 훅들 (호환성 유지)
export { useMobile } from './use-mobile'
export { useToast } from './use-toast'
