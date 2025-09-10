/**
 * 인증 관련 커스텀 훅
 * - 사용자 로그인/로그아웃 상태 관리
 * - 로컬 스토리지를 통한 세션 유지
 * - 관리자 권한 확인 기능
 * - 로그인 상태에 따른 UI 제어
 */
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

interface User {
  id: number
  email: string
  name: string
  role: "admin" | "user"
  grade: string
  isLoggedIn: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 사용자 정보 확인
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (userData && userData.isLoggedIn) {
            setUser(userData)
          } else {
            localStorage.removeItem("user")
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback((userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Failed to save user data:", error)
    }
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Failed to remove user data:", error)
    }
  }, [])

  const isLoggedIn = useMemo(() => !!user?.isLoggedIn, [user?.isLoggedIn])
  const isAdmin = useMemo(() => user?.role === "admin", [user?.role])

  return useMemo(() => ({
    user,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  }), [user, loading, isLoggedIn, isAdmin, login, logout])
}
