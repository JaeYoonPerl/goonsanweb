

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
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* 장식적 요소들 - 더 생동감 있게 */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-sky-200/30 to-blue-200/30 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* 추가 장식 요소들 */}
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-cyan-200/25 to-blue-200/25 rounded-full blur-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-200/25 to-indigo-200/25 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      {/* 움직이는 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
    </div>
  )
})
