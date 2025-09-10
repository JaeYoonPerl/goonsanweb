/**
 * 회원가입 페이지
 * - 이메일, 비밀번호, 이름, 학생구분, 기수, 생년월일 입력
 * - 폼 검증 및 에러 메시지 표시
 * - 로컬 스토리지에 회원 정보 저장
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, User, Mail, Lock, Calendar, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/home/header"

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  studentType: 'current' | 'graduate'
  birthDate: string
  grade: string
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    studentType: 'graduate',
    birthDate: '',
    grade: ''
  })
  const [errors, setErrors] = useState<Partial<SignupForm>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupForm> = {}

    // 이메일 검증
    if (!form.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    }

    // 비밀번호 검증
    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (form.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.'
    }

    // 비밀번호 확인 검증
    if (!form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검증
    if (!form.name) {
      newErrors.name = '이름을 입력해주세요.'
    } else if (form.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.'
    }

    // 생년월일 검증
    if (!form.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.'
    }

    // 학번 검증
    if (!form.grade) {
      newErrors.grade = '학번을 입력해주세요.'
    } else if (!/^\d{2}학번$/.test(form.grade)) {
      newErrors.grade = '올바른 학번 형식을 입력해주세요. (예: 85학번)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // 기존 회원 목록 가져오기
      const existingMembers = JSON.parse(localStorage.getItem('members') || '[]')
      
      // 이메일 중복 확인
      const emailExists = existingMembers.some((member: any) => member.email === form.email)
      if (emailExists) {
        setErrors({ email: '이미 사용 중인 이메일입니다.' })
        setLoading(false)
        return
      }

      // 새 회원 정보 생성
      const newMember = {
        id: Date.now(),
        email: form.email,
        password: form.password, // 실제로는 해시화해야 함
        name: form.name,
        studentType: form.studentType,
        birthDate: form.birthDate,
        grade: form.grade,
        role: 'user',
        isLoggedIn: false,
        createdAt: new Date().toISOString(),
        isActive: true
      }

      // 회원 목록에 추가
      const updatedMembers = [...existingMembers, newMember]
      localStorage.setItem('members', JSON.stringify(updatedMembers))

      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      router.push('/login')
    } catch (error) {
      console.error('회원가입 오류:', error)
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">회원가입</CardTitle>
              <p className="text-muted-foreground">
                군산중고등학교 총동창회에 오신 것을 환영합니다
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`text-xl h-14 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="6자 이상 입력해주세요"
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`text-xl h-14 ${errors.password ? 'border-destructive' : ''}`}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    비밀번호 확인
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`text-xl h-14 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* 이름 */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    이름
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="실명을 입력해주세요"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`text-xl h-14 ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* 재학생/졸업생 구분 */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    구분
                  </Label>
                  <Select
                    value={form.studentType}
                    onValueChange={(value: 'current' | 'graduate') => 
                      handleInputChange('studentType', value)
                    }
                  >
                    <SelectTrigger className="text-xl h-14">
                      <SelectValue placeholder="구분을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">재학생</SelectItem>
                      <SelectItem value="graduate">졸업생</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 학번 */}
                <div className="space-y-2">
                  <Label htmlFor="grade" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    학번
                  </Label>
                  <Input
                    id="grade"
                    type="text"
                    placeholder="예: 85학번"
                    value={form.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className={`text-xl h-14 ${errors.grade ? 'border-destructive' : ''}`}
                  />
                  {errors.grade && (
                    <p className="text-sm text-destructive">{errors.grade}</p>
                  )}
                </div>

                {/* 생년월일 */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    생년월일
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={`text-xl h-14 ${errors.birthDate ? 'border-destructive' : ''}`}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-destructive">{errors.birthDate}</p>
                  )}
                </div>

                {/* 제출 버튼 */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-xl" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? '가입 중...' : '회원가입'}
                </Button>
              </form>

              {/* 로그인 링크 */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    로그인하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
