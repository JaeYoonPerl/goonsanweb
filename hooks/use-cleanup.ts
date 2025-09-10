/**
 * 메모리 누수 방지 및 정리 관리 커스텀 훅
 * - 타이머와 이벤트 리스너를 중앙에서 관리
 * - 컴포넌트 언마운트 시 자동으로 모든 타이머 정리
 * - 메모리 누수 방지 및 성능 최적화
 */
import { useEffect, useRef } from 'react'

// 메모리 누수 방지를 위한 정리 함수 관리
export function useCleanup() {
  const cleanupFunctions = useRef<Array<() => void>>([])

  const addCleanup = (cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup)
  }

  const removeCleanup = (cleanup: () => void) => {
    const index = cleanupFunctions.current.indexOf(cleanup)
    if (index > -1) {
      cleanupFunctions.current.splice(index, 1)
    }
  }

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 모든 정리 함수 실행
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          console.error('Cleanup function error:', error)
        }
      })
      cleanupFunctions.current = []
    }
  }, [])

  return { addCleanup, removeCleanup }
}

// 타이머 관리 훅
export function useTimer() {
  const timers = useRef<Set<NodeJS.Timeout>>(new Set())

  const setTimer = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      callback()
    }, delay)
    timers.current.add(timer)
    return timer
  }

  const clearAllTimers = () => {
    timers.current.forEach(timer => clearTimeout(timer))
    timers.current.clear()
  }

  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  return { setTimer, clearAllTimers }
}

// 이벤트 리스너 관리 훅
export function useEventListener() {
  const listeners = useRef<Array<{ element: EventTarget; event: string; handler: EventListener }>>([])

  const addListener = (element: EventTarget, event: string, handler: EventListener) => {
    element.addEventListener(event, handler)
    listeners.current.push({ element, event, handler })
  }

  const removeListener = (element: EventTarget, event: string, handler: EventListener) => {
    element.removeEventListener(event, handler)
    const index = listeners.current.findIndex(
      l => l.element === element && l.event === event && l.handler === handler
    )
    if (index > -1) {
      listeners.current.splice(index, 1)
    }
  }

  const removeAllListeners = () => {
    listeners.current.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler)
    })
    listeners.current = []
  }

  useEffect(() => {
    return () => {
      removeAllListeners()
    }
  }, [])

  return { addListener, removeListener, removeAllListeners }
}
