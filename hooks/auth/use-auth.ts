/**
 * 인증 관련 커스텀 훅 (Zustand 스토어 사용)
 * - useAuthStore를 래핑하여 기존 인터페이스 유지
 * - 기존 컴포넌트와의 호환성 보장
 */
"use client"

import { useAuthStore } from "@/stores"

export function useAuth() {
  const {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    checkAuth
  } = useAuthStore()

  return {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    checkAuth
  }
}