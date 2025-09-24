/**
 * 회원 관리 페이지 (관리자 전용)
 * - 등록된 모든 회원 목록 표시
 * - 회원 검색 및 필터링 기능
 * - 회원 활성화/비활성화 관리
 * - 회원 정보 수정 및 삭제 기능
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, Filter, UserCheck, UserX, Mail, Calendar, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/hooks"
import Header from "@/components/home/header"
import { Footer } from "@/components/home/footer"

interface Member {
  id: number
  email: string
  name: string
  studentType: 'current' | 'graduate'
  birthDate: string
  grade: string
  role: 'admin' | 'user'
  isActive: boolean
  createdAt: string
}

export default function MembersPage() {
  const { user, isLoggedIn, isAdmin, loading: authLoading } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'current' | 'graduate'>('all')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      loadMembers()
    }
  }, [authLoading])

  const filteredMembers = useMemo(() => {
    let filtered = members

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.grade.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 재학생/졸업생 필터링
    if (filterType !== 'all') {
      filtered = filtered.filter(member => member.studentType === filterType)
    }

    // 역할 필터링
    if (filterRole !== 'all') {
      filtered = filtered.filter(member => member.role === filterRole)
    }

    return filtered
  }, [members, searchTerm, filterType, filterRole])

  const loadMembers = () => {
    try {
      const storedMembers = JSON.parse(localStorage.getItem('members') || '[]')
      setMembers(storedMembers)
    } catch (error) {
      console.error('회원 목록 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }


  const toggleMemberStatus = useCallback((memberId: number) => {
    if (!isAdmin) return

    const updatedMembers = members.map(member =>
      member.id === memberId
        ? { ...member, isActive: !member.isActive }
        : member
    )

    setMembers(updatedMembers)
    localStorage.setItem('members', JSON.stringify(updatedMembers))
  }, [members, isAdmin])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }, [])

  const calculateAge = useCallback((birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }, [])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">
                회원목록을 보려면 먼저 로그인해주세요.
              </p>
              <Link href="/login">
                <Button size="lg">로그인하기</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">회원목록</h1>
            </div>
            <p className="text-muted-foreground">
              총 {filteredMembers.length}명의 회원이 있습니다.
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{members.length}</p>
                    <p className="text-sm text-muted-foreground">전체 회원</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {members.filter(m => m.studentType === 'graduate').length}
                    </p>
                    <p className="text-sm text-muted-foreground">졸업생</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {members.filter(m => m.studentType === 'current').length}
                    </p>
                    <p className="text-sm text-muted-foreground">재학생</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <UserX className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {members.filter(m => !m.isActive).length}
                    </p>
                    <p className="text-sm text-muted-foreground">비활성 회원</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 필터 및 검색 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="이름, 이메일, 학번으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="graduate">졸업생</SelectItem>
                      <SelectItem value="current">재학생</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="admin">관리자</SelectItem>
                      <SelectItem value="user">일반회원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 회원 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                회원 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>학번</TableHead>
                      <TableHead>구분</TableHead>
                      <TableHead>나이</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>가입일</TableHead>
                      {isAdmin && <TableHead>관리</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {member.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.grade}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.studentType === 'graduate' ? 'default' : 'secondary'}>
                              {member.studentType === 'graduate' ? '졸업생' : '재학생'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {calculateAge(member.birthDate)}세
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.role === 'admin' ? 'destructive' : 'secondary'}>
                              {member.role === 'admin' ? '관리자' : '일반회원'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.isActive ? 'default' : 'secondary'}>
                              {member.isActive ? '활성' : '비활성'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(member.createdAt)}</TableCell>
                          {isAdmin && (
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleMemberStatus(member.id)}
                                disabled={member.id === user?.id} // 본인은 비활성화 불가
                              >
                                {member.isActive ? '비활성화' : '활성화'}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
