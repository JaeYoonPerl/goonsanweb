/**
 * 모든 컴포넌트들을 한 곳에서 export하는 메인 인덱스 파일
 * - 기능별로 그룹화된 컴포넌트들을 통합 관리
 * - import 경로 단순화
 */

// 공통 컴포넌트
export * from './common'

// 홈페이지 컴포넌트
export * from './home'

// 기타 컴포넌트
export { GlobalSearch } from './global-search'
export { LazyGlobalSearch, LazyRichTextEditor } from './lazy-components'
export { RichTextEditor } from './rich-text-editor'
export { ThemeProvider } from './theme-provider'
