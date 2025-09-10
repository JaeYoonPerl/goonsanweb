/**
 * 캐러셀 자동 재생 관리 커스텀 훅
 * - 캐러셀의 자동 재생 기능을 제어
 * - 마우스 호버 시 자동 재생 일시정지
 * - 컴포넌트 언마운트 시 타이머 정리
 */
import { useEffect, useRef, useCallback } from "react"
import { CONFIG } from "@/lib/data"
import { useTimer } from "./use-cleanup"

export function useCarousel(carouselApi: any) {
  const { setTimer, clearAllTimers } = useTimer()
  const isActive = useRef(true)
  const currentTimer = useRef<NodeJS.Timeout | null>(null)
  
  const scheduleNext = useCallback(() => {
    if (!isActive.current || !carouselApi) return
    
    currentTimer.current = setTimer(() => {
      try {
        if (carouselApi && isActive.current) {
          carouselApi.scrollNext()
          scheduleNext() // 다음 스케줄링
        }
      } catch (error) {
        console.warn("Carousel scroll error:", error)
      }
    }, CONFIG.CAROUSEL_AUTOPLAY_DELAY)
  }, [carouselApi, setTimer])
  
  useEffect(() => {
    if (!carouselApi) return
    
    isActive.current = true
    scheduleNext()
    
    return () => {
      isActive.current = false
      clearAllTimers()
    }
  }, [carouselApi, scheduleNext, clearAllTimers])
  
  // 페이지 가시성 변경 시 일시정지/재개
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive.current = false
        clearAllTimers()
      } else {
        isActive.current = true
        scheduleNext()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [scheduleNext, clearAllTimers])
}
