/**
 * 성능 최적화 유틸리티 함수들
 * - 이미지 최적화
 * - 메모리 관리
 * - 성능 모니터링
 */

/**
 * 이미지 지연 로딩을 위한 Intersection Observer 설정
 */
export const createImageObserver = () => {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            img.classList.remove('lazy')
          }
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  )
}

/**
 * 디바운스된 함수 생성
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 쓰로틀된 함수 생성
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 성능 측정을 위한 함수
 */
export function measurePerformance(name: string, fn: () => void) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name}: ${end - start}ms`)
  } else {
    fn()
  }
}

/**
 * 메모리 사용량 모니터링
 */
export function logMemoryUsage() {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log('Memory Usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
    })
  }
}

/**
 * 가상 스크롤링을 위한 계산 함수
 */
export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  totalItems: number
  scrollTop: number
}

export function calculateVirtualScroll({
  itemHeight,
  containerHeight,
  totalItems,
  scrollTop,
}: VirtualScrollOptions) {
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount, totalItems)
  
  return {
    startIndex,
    endIndex,
    visibleCount,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight,
  }
}

/**
 * 이미지 최적화 URL 생성
 */
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  if (!src) return ''
  
  // Next.js Image Optimization API 사용
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  return `/api/image?src=${encodeURIComponent(src)}&${params.toString()}`
}

/**
 * WebP 지원 확인
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * 네트워크 상태 확인
 */
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return { effectiveType: '4g', downlink: 10 }
  }
  
  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || 10,
  }
}

/**
 * 성능 기반 이미지 품질 결정
 */
export function getImageQuality(): number {
  const networkInfo = getNetworkInfo()
  
  switch (networkInfo.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 50
    case '3g':
      return 60
    case '4g':
    default:
      return 75
  }
}
