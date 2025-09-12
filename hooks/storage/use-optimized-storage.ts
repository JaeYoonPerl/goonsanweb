/**
 * 최적화된 로컬 스토리지 훅
 * - 디바운스된 저장으로 성능 최적화
 * - 메모리 누수 방지
 * - 에러 처리 포함
 */
import { useCallback, useRef } from "react"

interface UseOptimizedStorageOptions {
  debounceMs?: number
}

export function useOptimizedStorage<T>(
  key: string,
  initialValue: T,
  options: UseOptimizedStorageOptions = {}
) {
  const { debounceMs = 300 } = options
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const setValue = useCallback((value: T) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Storage error for key "${key}":`, error)
      }
    }, debounceMs)
  }, [key, debounceMs])

  const getValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Storage error for key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  return { setValue, getValue }
}