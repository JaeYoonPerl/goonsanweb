/**
 * 지연 로딩 컴포넌트 관리
 * - 코드 스플리팅을 통한 번들 크기 최적화
 * - 동적 import로 컴포넌트를 필요할 때만 로드
 * - 로딩 상태 표시 및 에러 처리
 */
import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

// 동적 임포트로 코드 분할
export const LazyGlobalSearch = dynamic(
  () => import('@/components/global-search').then(mod => ({ default: mod.GlobalSearch })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-10 w-10 rounded" />
  }
)

export const LazyRichTextEditor = dynamic(
  () => import('@/components/rich-text-editor').then(mod => ({ default: mod.RichTextEditor })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-32 rounded" />
  }
)

// 조건부 로딩을 위한 HOC
export function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType
) {
  return dynamic(importFunc, {
    ssr: false,
    loading: fallback ? () => React.createElement(fallback) : undefined
  })
}
