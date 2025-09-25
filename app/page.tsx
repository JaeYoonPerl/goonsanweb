/**
 * 홈페이지 컴포넌트
 * - 이미지 캐러셀, 공지사항, 동문 커뮤니티 섹션을 포함한 메인 페이지
 * - 배경 장식 요소와 그라데이션으로 시각적 효과 제공
 * - 반응형 레이아웃으로 다양한 화면 크기 지원
 */
"use client"

import { useState, useCallback, memo, useEffect } from "react"
import Header from "@/components/home/header"
import { CarouselBanner } from "@/components/home/carousel-banner"
import { NoticesBoard } from "@/components/home/notices-board"
import { CommunityBoard } from "@/components/home/community-board"
import SocialMediaLinks from "@/components/home/social-media-links"
import { AcademicCalendar } from "@/components/home/academic-calendar"
import { Footer } from "@/components/home/footer"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { useHomeData, useCarousel } from "@/hooks"

function HomePage() {
  const [carouselApi, setCarouselApi] = useState<any>(null)
  const { displayNotices, displayPosts } = useHomeData()
  
  useCarousel(carouselApi)

  // 페이지 포커스 시 데이터 새로고침 (클라이언트 사이드에서만)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocus = () => {
      // 페이지가 다시 포커스될 때 데이터 새로고침을 트리거
      window.dispatchEvent(new Event('storage'))
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleCarouselApiChange = useCallback((api: any) => {
    setCarouselApi(api)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 메인 배경 - 더 풍부한 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-shift"></div>
      
      {/* 추가 배경 레이어들 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/50 via-transparent to-pink-50/50"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50/30 via-transparent to-blue-50/30"></div>
      
      {/* 미묘한 패턴 오버레이 */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <BackgroundDecorations />
      <div className="relative z-10">
        <Header />
        <CarouselBanner setCarouselApi={handleCarouselApiChange} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NoticesBoard notices={displayNotices} />
            <CommunityBoard posts={displayPosts} />
          </div>
        </main>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SocialMediaLinks />
          <AcademicCalendar />
        </section>

        <Footer />
      </div>
    </div>
  )
}

export default memo(HomePage)
