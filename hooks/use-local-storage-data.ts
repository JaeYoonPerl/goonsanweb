import { useState, useEffect, useCallback } from "react"

interface UseLocalStorageDataProps<T> {
  storageKey: string
  defaultData: T[]
  mergeWithDefault?: boolean
}

export function useLocalStorageData<T>({
  storageKey,
  defaultData,
  mergeWithDefault = true,
}: UseLocalStorageDataProps<T>) {
  const [data, setData] = useState<T[]>(defaultData)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(() => {
    try {
      const storedData = localStorage.getItem(storageKey)
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        if (Array.isArray(parsedData)) {
          setData(mergeWithDefault ? [...parsedData, ...defaultData] : parsedData)
        } else {
          setData(defaultData)
        }
      } else {
        setData(defaultData)
      }
    } catch (error) {
      console.error(`Failed to load data from ${storageKey}:`, error)
      setData(defaultData)
    } finally {
      setLoading(false)
    }
  }, [storageKey, defaultData, mergeWithDefault])

  const saveData = useCallback((newData: T[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newData))
      setData(mergeWithDefault ? [...newData, ...defaultData] : newData)
    } catch (error) {
      console.error(`Failed to save data to ${storageKey}:`, error)
    }
  }, [storageKey, defaultData, mergeWithDefault])

  const addItem = useCallback((item: T) => {
    const currentStored = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const newData = [item, ...currentStored]
    saveData(newData)
  }, [storageKey, saveData])

  const removeItem = useCallback((id: number) => {
    const currentStored = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const newData = currentStored.filter((item: any) => item.id !== id)
    saveData(newData)
  }, [storageKey, saveData])

  const updateItem = useCallback((id: number, updatedItem: Partial<T>) => {
    const currentStored = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const newData = currentStored.map((item: any) =>
      item.id === id ? { ...item, ...updatedItem } : item
    )
    saveData(newData)
  }, [storageKey, saveData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    loadData,
    saveData,
    addItem,
    removeItem,
    updateItem,
  }
}
