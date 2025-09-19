/**
 * 인증 상태 제공자 컴포넌트
 * - 앱 전체에서 인증 상태를 초기화하고 유지
 * - 페이지 이동 시에도 로그인 상태가 유지되도록 보장
 */
"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}
