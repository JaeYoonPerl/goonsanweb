/**
 * 홈페이지 컴포넌트
 * - 이미지 캐러셀, 공지사항, 동문 커뮤니티 섹션을 포함한 메인 페이지
 * - 배경 장식 요소와 그라데이션으로 시각적 효과 제공
 * - 반응형 레이아웃으로 다양한 화면 크기 지원
 */
"use client"

import { useState, useCallback, memo } from "react"
import Header from "@/components/home/header"
import { CarouselBanner } from "@/components/home/carousel-banner"
import { NoticesBoard } from "@/components/home/notices-board"
import { CommunityBoard } from "@/components/home/community-board"
import SocialMediaLinks from "@/components/home/social-media-links"
import { AcademicCalendar } from "@/components/home/academic-calendar"
import { Footer } from "@/components/home/footer"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { useHomeData } from "@/hooks/use-home-data"
import { useCarousel } from "@/hooks/use-carousel"

function HomePage() {
  const [carouselApi, setCarouselApi] = useState<any>(null)
  const { displayNotices, displayPosts } = useHomeData()
  
  useCarousel(carouselApi)

  const handleCarouselApiChange = useCallback((api: any) => {
    setCarouselApi(api)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
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
