/**
 * 배경 장식 요소 컴포넌트
 * - 페이지 배경에 그라데이션과 장식적 요소들을 추가
 * - 점 패턴 배경과 블러 처리된 원형 요소들로 시각적 효과 제공
 * - 여러 페이지에서 재사용 가능한 공통 컴포넌트
 */
import { memo } from "react"

interface BackgroundDecorationsProps {
  className?: string
}

export const BackgroundDecorations = memo(function BackgroundDecorations({ 
  className = "" 
}: BackgroundDecorationsProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5 bg-dot-pattern"></div>
      
      {/* 장식적 요소들 */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-sky-200/20 to-blue-200/20 rounded-full blur-lg"></div>
    </div>
  )
})
