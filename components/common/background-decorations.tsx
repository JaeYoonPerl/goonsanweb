

/**
 * 배경 장식 요소 컴포넌트
 * - 페이지 배경에 그라데이션과 장식적 요소들을 추가
 * - 점 패턴 배경과 블러 처리된 원형 요소들로 시각적 효과 제공
 * - 여러 페이지에서 재사용 가능한 공통 컴포넌트
 * - 향상된 애니메이션과 시각적 효과
 */
import { memo } from "react"

interface BackgroundDecorationsProps {
  className?: string
}

export const BackgroundDecorations = memo(function BackgroundDecorations({ 
  className = "" 
}: BackgroundDecorationsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* 향상된 배경 패턴 - 더 복잡하고 아름다운 패턴 */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='1.5'/%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3Ccircle cx='20' cy='60' r='0.8'/%3E%3Ccircle cx='60' cy='20' r='0.8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* 추가 기하학적 패턴 */}
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpolygon points='60,10 80,50 60,90 40,50'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* 메인 장식 요소들 - 더 크고 역동적으로 */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-indigo-300/40 to-cyan-300/40 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-sky-300/40 to-blue-300/40 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* 중간 크기 장식 요소들 */}
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-300/35 to-blue-300/35 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-br from-blue-300/35 to-indigo-300/35 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/4 left-1/2 w-28 h-28 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-lg animate-float" style={{animationDelay: '1.5s'}}></div>
      
      {/* 작은 장식 요소들 - 더 많은 움직임 */}
      <div className="absolute top-10 left-1/3 w-16 h-16 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-md animate-float" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-lg animate-float" style={{animationDelay: '2.5s'}}></div>
      <div className="absolute top-2/3 left-10 w-12 h-12 bg-gradient-to-br from-yellow-300/25 to-orange-300/25 rounded-full blur-sm animate-float" style={{animationDelay: '3.5s'}}></div>
      
      {/* 움직이는 그라데이션 오버레이 - 더 복잡한 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/15 to-transparent animate-shimmer" style={{animationDuration: '6s'}}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/10 to-transparent animate-shimmer" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
      
      {/* 추가 빛 효과 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-blue-200/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-radial from-purple-200/20 via-transparent to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
    </div>
  )
})
