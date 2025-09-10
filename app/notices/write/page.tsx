"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { RichTextEditor } from "@/components/rich-text-editor"
import Header from "@/components/home/header"

export default function NoticeWritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("일반")
  const [isImportant, setIsImportant] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoggedIn, isAdmin, loading } = useAuth()
  const router = useRouter()

  // 권한 확인
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login")
        return
      }
      if (!isAdmin) {
        router.push("/notices")
        return
      }
    }
  }, [isLoggedIn, isAdmin, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    setIsLoading(true)

    // 임시 저장 로직 (실제로는 API 호출)
    setTimeout(() => {
      const newNotice = {
        id: Date.now(), // 임시 ID
        title: title.trim(),
        content: content.trim(),
        type,
        isImportant,
        author: user?.name || "관리자",
        date: new Date().toLocaleDateString("ko-KR"),
        views: 0,
      }

      // 로컬 스토리지에 임시 저장 (실제로는 데이터베이스에 저장)
      const existingNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
      existingNotices.unshift(newNotice)
      localStorage.setItem("tempNotices", JSON.stringify(existingNotices))

      alert("공지사항이 등록되었습니다.")
      router.push("/notices")
    }, 1000)
  }

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?")) {
        router.push("/notices")
      }
    } else {
      router.push("/notices")
    }
  }

  // 로딩 중이거나 권한이 없는 경우
  if (loading || !isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {loading ? (
            <p className="text-lg text-muted-foreground">로딩 중...</p>
          ) : (
            <>
              <p className="text-lg text-muted-foreground">접근 권한이 없습니다.</p>
              <Link href="/notices">
                <Button className="mt-4">목록으로 돌아가기</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/notices">
                  <Button variant="ghost" size="sm" className="gap-2 text-lg">
                    <ArrowLeft className="h-5 w-5" />
                    목록으로
                  </Button>
                </Link>
                <CardTitle className="text-3xl">공지사항 작성</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="text-lg py-3 px-6">
                  <X className="h-5 w-5 mr-2" />
                  취소
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="text-lg py-3 px-6">
                  <Save className="h-5 w-5 mr-2" />
                  {isLoading ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xl">제목 *</Label>
                <Input
                  id="title"
                  placeholder="공지사항 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-xl py-3"
                />
              </div>

              {/* 유형 및 중요도 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xl">유형</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="text-xl py-3">
                      <SelectValue placeholder="유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반">일반</SelectItem>
                      <SelectItem value="중요">중요</SelectItem>
                      <SelectItem value="행사">행사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xl">중요 공지사항</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="important"
                      checked={isImportant}
                      onCheckedChange={(checked) => setIsImportant(checked as boolean)}
                    />
                    <Label htmlFor="important" className="text-lg">
                      중요 공지사항으로 설정
                    </Label>
                  </div>
                </div>
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-xl">내용 *</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="공지사항 내용을 입력하세요. 툴바를 사용하여 텍스트 스타일을 조정하고 이미지를 첨부할 수 있습니다."
                  className="min-h-[400px]"
                />
                <p className="text-lg text-muted-foreground">
                  툴바를 사용하여 텍스트 스타일을 조정하고 이미지를 첨부할 수 있습니다.
                </p>
              </div>

              {/* 작성자 정보 */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 text-xl">작성자 정보</h4>
                <div className="text-lg text-muted-foreground">
                  <p>작성자: {user?.name} ({user?.grade})</p>
                  <p>작성일: {new Date().toLocaleDateString("ko-KR")}</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
