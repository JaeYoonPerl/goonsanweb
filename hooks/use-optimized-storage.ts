/**
 * 최적화된 로컬 스토리지 관리 커스텀 훅
 * - 로컬 스토리지 데이터를 효율적으로 관리
 * - 디바운스 기능으로 빈번한 저장 작업 최적화
 * - 에러 처리 및 로딩 상태 관리
 * - 메모리 누수 방지를 위한 타이머 정리
 */
import { useState, useEffect, useCallback, useRef } from "react"

interface UseOptimizedStorageOptions<T> {
  key: string
  defaultValue: T
  debounceMs?: number
}

export function useOptimizedStorage<T>({
  key,
  defaultValue,
  debounceMs = 300
}: UseOptimizedStorageOptions<T>) {
  const [data, setData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialized = useRef(false)

  // 데이터 로드
  const loadData = useCallback(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        setData(JSON.parse(stored))
      }
    } catch (error) {
      console.error(`Failed to load data from ${key}:`, error)
    } finally {
      setLoading(false)
    }
  }, [key])

  // 데이터 저장 (디바운스 적용)
  const saveData = useCallback((newData: T) => {
    setData(newData)
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(newData))
      } catch (error) {
        console.error(`Failed to save data to ${key}:`, error)
      }
    }, debounceMs)
  }, [key, debounceMs])

  // 초기 로드
  useEffect(() => {
    if (!isInitialized.current) {
      loadData()
      isInitialized.current = true
    }
  }, [loadData])

  // 컴포넌트 언마운트 시 디바운스 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return { data, setData: saveData, loading, reload: loadData }
}
