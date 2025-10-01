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
import { useAuth } from "@/hooks"


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
      // useAuth 훅의 login 함수 사용
      const result = await login(email, password)
      if (result.success) {
        // 홈페이지로 리다이렉트
        router.push("/")
      } else {
        setError(result.error || "로그인에 실패했습니다.")
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-14 text-xl font-medium"
              style={{ backgroundColor: '#FEE500', color: '#000000' }}
              onClick={() => {
                alert('카카오톡 로그인 기능은 준비 중입니다.')
              }}
            >
              <svg 
                className="mr-2 h-5 w-5" 
                viewBox="0 0 208 191"
                fill="currentColor"
              >
                <path d="M104,0C46.562,0,0,36.793,0,82.139c0,28.927,19.031,54.347,47.636,68.765c-2.13,7.802-13.681,48.878-13.951,52.013c-0.347,4.032,1.508,3.988,3.169,2.917c1.324-0.856,21.327-14.524,39.638-26.896c8.763,1.197,17.768,1.836,26.908,1.836c57.438,0,104-36.793,104-82.139S161.438,0,104,0"/>
              </svg>
              카카오 로그인
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
