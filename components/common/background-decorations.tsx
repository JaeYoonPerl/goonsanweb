

/**
 * 배경 장식 요소 컴포넌트
 * - 페이지 배경에 그라데이션과 장식적 요소들을 추가
 * - 점 패턴 배경과 블러 처리된 원형 요소들로 시각적 효과 제공
 * - 여러 페이지에서 재사용 가능한 공통 컴포넌트
 * - 향상된 애니메이션과 시각적 효과
 */
import { memo, useMemo } from "react"

interface BackgroundDecorationsProps {
  className?: string
}

export const BackgroundDecorations = memo(function BackgroundDecorations({ 
  className = "" 
}: BackgroundDecorationsProps) {
  // SVG 패턴들을 메모이제이션 - 더 화려한 패턴들
  const dotPattern = useMemo(() => 
    `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='25' cy='25' r='1.5'/%3E%3Ccircle cx='75' cy='75' r='1.5'/%3E%3Ccircle cx='25' cy='75' r='1'/%3E%3Ccircle cx='75' cy='25' r='1'/%3E%3Ccircle cx='50' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='50' r='0.8'/%3E%3Ccircle cx='90' cy='50' r='0.8'/%3E%3Ccircle cx='50' cy='90' r='0.8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    []
  )

  const geometricPattern = useMemo(() =>
    `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.06'%3E%3Cpolygon points='75,15 95,55 75,95 55,55'/%3E%3Cpolygon points='75,30 85,50 75,70 65,50'/%3E%3Cpolygon points='75,45 80,55 75,65 70,55'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    []
  )

  const starPattern = useMemo(() =>
    `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M100 10L110 70L170 70L120 110L140 170L100 130L60 170L80 110L30 70L90 70Z'/%3E%3Cpath d='M100 30L105 60L135 60L115 80L125 110L100 95L75 110L85 80L65 60L95 60Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    []
  )

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* 향상된 배경 패턴 - 더 복잡하고 아름다운 패턴 */}
      <div className="absolute inset-0 opacity-6" style={{ backgroundImage: dotPattern }}></div>
      
      {/* 추가 기하학적 패턴 */}
      <div className="absolute inset-0 opacity-4" style={{ backgroundImage: geometricPattern }}></div>
      
      {/* 별 패턴 추가 */}
      <div className="absolute inset-0 opacity-3" style={{ backgroundImage: starPattern }}></div>
      
      {/* 장식 요소들을 메모이제이션 */}
      {useMemo(() => (
        <>
          {/* 메인 장식 요소들 - 더 크고 화려하게 */}
          <div className="absolute top-20 right-10 w-52 h-52 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-gradient-to-br from-indigo-400/50 to-cyan-400/50 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-br from-sky-400/50 to-blue-400/50 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* 중간 크기 장식 요소들 - 더 화려한 색상 */}
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-cyan-400/45 to-blue-400/45 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-44 h-44 bg-gradient-to-br from-blue-400/45 to-indigo-400/45 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/4 left-1/2 w-36 h-36 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
          
          {/* 작은 장식 요소들 - 더 많은 움직임과 색상 */}
          <div className="absolute top-10 left-1/3 w-20 h-20 bg-gradient-to-br from-emerald-400/40 to-teal-400/40 rounded-full blur-lg animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-gradient-to-br from-rose-400/40 to-pink-400/40 rounded-full blur-xl animate-float" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-2/3 left-10 w-16 h-16 bg-gradient-to-br from-yellow-400/35 to-orange-400/35 rounded-full blur-md animate-float" style={{animationDelay: '3.5s'}}></div>
          
          {/* 추가 장식 요소들 - 더 화려한 배경 */}
          <div className="absolute top-1/6 right-1/6 w-28 h-28 bg-gradient-to-br from-violet-400/35 to-purple-400/35 rounded-full blur-lg animate-float" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute bottom-1/6 left-1/6 w-32 h-32 bg-gradient-to-br from-teal-400/35 to-cyan-400/35 rounded-full blur-xl animate-float" style={{animationDelay: '1.8s'}}></div>
          <div className="absolute top-3/4 right-1/2 w-20 h-20 bg-gradient-to-br from-amber-400/30 to-yellow-400/30 rounded-full blur-md animate-float" style={{animationDelay: '2.8s'}}></div>
          <div className="absolute top-1/8 left-3/4 w-24 h-24 bg-gradient-to-br from-fuchsia-400/35 to-pink-400/35 rounded-full blur-lg animate-float" style={{animationDelay: '3.8s'}}></div>
        </>
      ), [])}
      
      {/* 움직이는 그라데이션 오버레이와 빛 효과를 메모이제이션 */}
      {useMemo(() => (
        <>
          {/* 움직이는 그라데이션 오버레이 - 더 화려한 패턴 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent animate-shimmer" style={{animationDuration: '6s'}}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-100/15 to-transparent animate-shimmer" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-100/12 to-transparent animate-shimmer" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
          
          {/* 추가 빛 효과 - 더 화려하게 */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-blue-300/25 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-purple-300/25 via-transparent to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-gradient-radial from-cyan-300/20 via-transparent to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/2 left-1/3 w-48 h-48 bg-gradient-radial from-pink-300/20 via-transparent to-transparent rounded-full blur-xl animate-pulse" style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
        </>
      ), [])}
    </div>
  )
})
