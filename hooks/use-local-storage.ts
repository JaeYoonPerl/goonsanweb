/**
 * 로컬 스토리지 훅
 * - 로컬 스토리지와 React 상태를 동기화
 * - 타입 안전성 보장
 * - 에러 처리 및 기본값 지원
 * - SSR 호환성 고려
 */
import { useState, useEffect, useCallback } from "react"

type SetValue<T> = T | ((val: T) => T)

/**
 * 로컬 스토리지와 동기화되는 상태 훅
 * @param key - 로컬 스토리지 키
 * @param initialValue - 초기값
 * @returns [값, 설정 함수, 제거 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // SSR 호환성을 위한 초기 상태 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 값 설정 함수
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // 다른 탭에서의 변경사항 감지
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * 로컬 스토리지에서 배열을 관리하는 훅
 * @param key - 로컬 스토리지 키
 * @param initialValue - 초기 배열
 * @returns [배열, 추가 함수, 제거 함수, 업데이트 함수, 전체 교체 함수]
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [
  T[],
  (item: T) => void,
  (index: number) => void,
  (index: number, item: T) => void,
  (items: T[]) => void
] {
  const [items, setItems, removeItems] = useLocalStorage<T[]>(key, initialValue)

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [setItems])

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [setItems])

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => prev.map((existingItem, i) => i === index ? item : existingItem))
  }, [setItems])

  const setAllItems = useCallback((newItems: T[]) => {
    setItems(newItems)
  }, [setItems])

  return [items, addItem, removeItem, updateItem, setAllItems]
}
