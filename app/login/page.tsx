/**
 * 로그인 페이지
 * - 이메일과 비밀번호로 사용자 인증
 * - 로그인 성공 시 로컬 스토리지에 세션 저장
 * - 회원가입 페이지로 이동 링크 제공
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

// 임시 사용자 데이터 (실제로는 데이터베이스에서 관리)
const users = [
  {
    id: 1,
    email: "admin@gunsan.hs.kr",
    password: "admin123",
    name: "관리자",
    role: "admin",
    grade: "관리자",
  },
  {
    id: 2,
    email: "user1@example.com",
    password: "user123",
    name: "김○○",
    role: "user",
    grade: "85학번",
  },
  {
    id: 3,
    email: "user2@example.com",
    password: "user123",
    name: "이○○",
    role: "user",
    grade: "78학번",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 회원 목록에서 사용자 찾기
      const storedMembers = JSON.parse(localStorage.getItem('members') || '[]')
      
      // 임시 사용자와 저장된 회원 모두 확인
      const allUsers = [...users, ...storedMembers]
      const user = allUsers.find(
        (u) => u.email === email && u.password === password && u.isActive !== false
      )

      if (user) {
        // 로그인 성공 - useAuth 훅의 login 함수 사용
        login({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          grade: user.grade,
          isLoggedIn: true,
        })
        
        // 홈페이지로 리다이렉트
        router.push("/")
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">군산중고등학교 총동창회</CardTitle>
          <p className="text-muted-foreground">로그인하여 서비스를 이용하세요</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xl h-14"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xl h-14 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-xl" 
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>계정이 없으신가요?</p>
              <Link href="/signup" className="text-primary hover:underline">
                회원가입
              </Link>
            </div>
          </form>

          {/* 임시 계정 정보 (개발용) */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">임시 계정 정보 (개발용)</h4>
            <div className="space-y-1 text-sm">
              <p><strong>관리자:</strong> admin@gunsan.hs.kr / admin123</p>
              <p><strong>일반회원:</strong> user1@example.com / user123</p>
              <p><strong>일반회원:</strong> user2@example.com / user123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
