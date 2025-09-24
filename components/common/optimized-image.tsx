/**
 * 성능 최적화된 이미지 컴포넌트
 * - 지연 로딩
 * - WebP 지원
 * - 네트워크 상태에 따른 품질 조절
 * - 에러 처리
 */
"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getImageQuality, supportsWebP, getOptimizedImageUrl } from '@/lib/performance'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: string
  fallback?: string
  quality?: number
  lazy?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=',
  fallback,
  quality,
  lazy = true,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 이미지 품질 결정
  const imageQuality = quality ?? getImageQuality()
  
  // 최적화된 이미지 URL 생성
  const optimizedSrc = getOptimizedImageUrl(src, width, height, imageQuality)
  
  // WebP 지원 확인
  const webpSupported = supportsWebP()
  const finalSrc = webpSupported && optimizedSrc.includes('.jpg') 
    ? optimizedSrc.replace('.jpg', '.webp')
    : optimizedSrc

  // Intersection Observer 설정 (지연 로딩용)
  useEffect(() => {
    if (!lazy || priority || isInView) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, priority, isInView])

  // 이미지 로드 핸들러
  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  // 이미지 에러 핸들러
  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-gray-100",
        className
      )}
      style={{ width, height }}
    >
      {/* 플레이스홀더 */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
        />
      )}

      {/* 실제 이미지 */}
      {isInView && (
        <img
          src={hasError && fallback ? fallback : finalSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* 에러 상태 */}
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
          이미지를 불러올 수 없습니다
        </div>
      )}
    </div>
  )
}
