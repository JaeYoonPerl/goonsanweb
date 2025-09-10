/**
 * 이미지 캐러셀 배너 컴포넌트
 * - 학교 관련 이미지들을 슬라이드로 표시
 * - 닷 네비게이션으로 현재 슬라이드 표시 및 직접 이동 가능
 * - 자동 재생 및 수동 네비게이션 기능
 */
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { CAROUSEL_IMAGES } from "@/lib/data"

interface CarouselBannerProps {
  setCarouselApi: (api: any) => void
}

export function CarouselBanner({ setCarouselApi }: CarouselBannerProps) {
  return (
    <section className="bg-primary/5">
      <div className="container mx-auto px-4 py-6">
        <Carousel opts={{ loop: true }} className="w-full" setApi={setCarouselApi}>
          <CarouselContent>
            {CAROUSEL_IMAGES.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[280px] sm:h-[420px] rounded-xl overflow-hidden">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
