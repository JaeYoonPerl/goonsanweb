/**
 * 인증 상태 관리 Zustand 스토어
 * - 사용자 로그인/로그아웃 상태 관리
 * - 로컬 스토리지를 통한 세션 유지
 * - 관리자 권한 확인 기능
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  name: string
  role: "admin" | "user"
  grade: string
  isLoggedIn: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
  isLoggedIn: boolean
  isAdmin: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

// 임시 사용자 데이터 (실제로는 데이터베이스에서 관리)
const users = [
  {
    id: 1,
    email: "admin@goonsan.com",
    password: "admin123",
    name: "관리자",
    role: "admin" as const,
    grade: "관리자",
    isLoggedIn: true
  },
  {
    id: 2,
    email: "user@goonsan.com", 
    password: "user123",
    name: "김동문",
    role: "user" as const,
    grade: "85학번",
    isLoggedIn: true
  }
]

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      loading: true,
      isLoggedIn: false,
      isAdmin: false,

      // 액션들
      login: async (email: string, password: string) => {
        set({ loading: true })
        
        try {
          // 임시 로그인 로직
          const foundUser = users.find(u => u.email === email && u.password === password)
          
          if (foundUser) {
            const userData = {
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              role: foundUser.role,
              grade: foundUser.grade,
              isLoggedIn: true
            }
            
            set({
              user: userData,
              isLoggedIn: true,
              isAdmin: foundUser.role === "admin",
              loading: false
            })
            
            return { success: true }
          } else {
            set({ loading: false })
            return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }
          }
        } catch (error) {
          set({ loading: false })
          return { success: false, error: "로그인 중 오류가 발생했습니다." }
        }
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          isAdmin: false,
          loading: false
        })
      },

      checkAuth: () => {
        set({ loading: true })
        
        try {
          // 로컬 스토리지에서 사용자 정보 확인
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            set({
              user: userData,
              isLoggedIn: true,
              isAdmin: userData.role === "admin",
              loading: false
            })
          } else {
            set({ loading: false })
          }
        } catch (error) {
          console.error("인증 확인 오류:", error)
          set({ loading: false })
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      }
    }),
    {
      name: "auth-storage", // 로컬 스토리지 키
      partialize: (state) => ({ user: state.user }), // user만 저장
    }
  )
)
