/**
 * 디바운스 훅
 * - 입력값 변경 시 지연된 실행을 위한 커스텀 훅
 * - 검색, API 호출 등에 유용
 * - 메모리 누수 방지를 위한 cleanup 처리
 */
import { useState, useEffect, useRef } from "react"

/**
 * 디바운스된 값을 반환하는 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 디바운스된 콜백 함수를 반환하는 훅
 * @param callback - 디바운스할 콜백 함수
 * @param delay - 지연 시간 (밀리초)
 * @param deps - 의존성 배열
 * @returns 디바운스된 콜백 함수
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // 최신 콜백 함수 참조 유지
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // 의존성이 변경되면 타임아웃 초기화
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, deps)

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }) as T

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}
