/**
 * 메모리 정리 훅
 * - 컴포넌트 언마운트 시 정리 작업 수행
 * - 메모리 누수 방지
 */
import { useEffect, useRef } from "react"

export function useCleanup(cleanupFn: () => void) {
  const cleanupRef = useRef(cleanupFn)
  
  useEffect(() => {
    cleanupRef.current = cleanupFn
  }, [cleanupFn])

  useEffect(() => {
    return () => {
      cleanupRef.current()
    }
  }, [])
}
