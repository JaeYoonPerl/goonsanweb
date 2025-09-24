/**
 * 성능 모니터링 컴포넌트
 * - 개발 환경에서만 활성화
 * - Core Web Vitals 측정
 * - 메모리 사용량 모니터링
 */
"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  memory?: {
    used: number
    total: number
    limit: number
  }
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 개발 환경에서만 활성화
    if (process.env.NODE_ENV !== 'development') return

    const updateMetrics = () => {
      const newMetrics: PerformanceMetrics = {}

      // Core Web Vitals 측정
      if (typeof window !== 'undefined' && 'performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (perfData) {
          newMetrics.fcp = perfData.responseStart - perfData.requestStart
          newMetrics.ttfb = perfData.responseStart - perfData.requestStart
        }

        // 메모리 사용량 (Chrome에서만 지원)
        if ('memory' in performance) {
          const memory = (performance as any).memory
          newMetrics.memory = {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
          }
        }
      }

      setMetrics(newMetrics)
    }

    // 초기 측정
    updateMetrics()

    // 주기적 업데이트
    const interval = setInterval(updateMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  // 개발 환경이 아니면 렌더링하지 않음
  if (process.env.NODE_ENV !== 'development') return null

  const getScoreColor = (value?: number, thresholds: { good: number; poor: number }) => {
    if (!value) return 'text-gray-500'
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (value?: number, thresholds: { good: number; poor: number }) => {
    if (!value) return 'N/A'
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.poor) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 토글 버튼 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {isVisible ? 'Hide' : 'Show'} Metrics
      </button>

      {/* 메트릭 패널 */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Performance Metrics</h3>
          
          <div className="space-y-3">
            {/* FCP */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">First Contentful Paint</span>
              <div className="text-right">
                <span className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })
                )}>
                  {metrics.fcp ? `${metrics.fcp}ms` : 'N/A'}
                </span>
                <div className="text-xs text-gray-500">
                  {getScoreLabel(metrics.fcp, { good: 1800, poor: 3000 })}
                </div>
              </div>
            </div>

            {/* TTFB */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Time to First Byte</span>
              <div className="text-right">
                <span className={cn(
                  "text-sm font-bold",
                  getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })
                )}>
                  {metrics.ttfb ? `${metrics.ttfb}ms` : 'N/A'}
                </span>
                <div className="text-xs text-gray-500">
                  {getScoreLabel(metrics.ttfb, { good: 800, poor: 1800 })}
                </div>
              </div>
            </div>

            {/* Memory */}
            {metrics.memory && (
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-2">Memory Usage</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span className="font-medium">{metrics.memory.used} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{metrics.memory.total} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span className="font-medium">{metrics.memory.limit} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(metrics.memory.used / metrics.memory.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  )
}
