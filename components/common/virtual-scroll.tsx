/**
 * 성능 최적화된 가상 스크롤링 컴포넌트
 * - 대량의 데이터를 효율적으로 렌더링
 * - 메모리 사용량 최적화
 * - 부드러운 스크롤링 경험
 */
"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { calculateVirtualScroll } from '@/lib/performance'

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
  onScroll?: (scrollTop: number) => void
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // 컨테이너 크기 측정
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // 가상 스크롤 계산
  const virtualScrollInfo = useMemo(() => {
    return calculateVirtualScroll({
      itemHeight,
      containerHeight,
      totalItems: items.length,
      scrollTop,
    })
  }, [items.length, itemHeight, containerHeight, scrollTop])

  // 스크롤 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const newScrollTop = target.scrollTop
    setScrollTop(newScrollTop)
    onScroll?.(newScrollTop)
  }, [onScroll])

  // 렌더링할 아이템들 (overscan 포함)
  const visibleItems = useMemo(() => {
    const start = Math.max(0, virtualScrollInfo.startIndex - overscan)
    const end = Math.min(items.length, virtualScrollInfo.endIndex + overscan)
    
    return items.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
    }))
  }, [items, virtualScrollInfo.startIndex, virtualScrollInfo.endIndex, overscan])

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* 전체 높이를 위한 스크롤 영역 */}
      <div style={{ height: virtualScrollInfo.totalHeight, position: 'relative' }}>
        {/* 실제 렌더링되는 아이템들 */}
        <div
          style={{
            transform: `translateY(${virtualScrollInfo.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 가상 스크롤링을 위한 훅
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const virtualScrollInfo = useMemo(() => {
    return calculateVirtualScroll({
      itemHeight,
      containerHeight,
      totalItems: items.length,
      scrollTop,
    })
  }, [items.length, itemHeight, containerHeight, scrollTop])

  const visibleItems = useMemo(() => {
    const start = Math.max(0, virtualScrollInfo.startIndex - overscan)
    const end = Math.min(items.length, virtualScrollInfo.endIndex + overscan)
    
    return items.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
    }))
  }, [items, virtualScrollInfo.startIndex, virtualScrollInfo.endIndex, overscan])

  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight
    setScrollTop(targetScrollTop)
  }, [itemHeight])

  return {
    scrollTop,
    setScrollTop,
    virtualScrollInfo,
    visibleItems,
    scrollToIndex,
  }
}
