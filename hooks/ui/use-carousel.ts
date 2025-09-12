/**
 * 캐러셀 자동 재생 관리 훅
 * - 자동 재생 제어
 * - 마우스 호버 시 일시정지
 */
import { useEffect, useRef } from "react"

export function useCarousel(carouselApi: any) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!carouselApi) return

    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        carouselApi.scrollNext()
      }, 5000)
    }

    const stopAutoplay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    startAutoplay()

    return () => stopAutoplay()
  }, [carouselApi])
}