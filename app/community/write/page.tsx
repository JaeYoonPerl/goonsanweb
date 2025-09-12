"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks"
import { RichTextEditor } from "@/components/rich-text-editor"
import Header from "@/components/home/header"

const categories = ["동기회", "모교소식", "사업소개", "취업정보", "모임제안", "기타"]

export default function CommunityWritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("동기회")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoggedIn, loading } = useAuth()
  const router = useRouter()

  // 로그인 확인
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login")
      return
    }
  }, [isLoggedIn, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    setIsLoading(true)

    // 임시 저장 로직 (실제로는 API 호출)
    setTimeout(() => {
      const newPost = {
        id: Date.now(), // 임시 ID
        title: title.trim(),
        content: content.trim(),
        category,
        author: user?.name || "사용자",
        grade: user?.grade || "학번",
        date: new Date().toLocaleDateString("ko-KR"),
        views: 0,
        likes: 0,
        comments: [],
      }

      // 로컬 스토리지에 임시 저장 (실제로는 데이터베이스에 저장)
      const existingPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
      existingPosts.unshift(newPost)
      localStorage.setItem("tempPosts", JSON.stringify(existingPosts))

      alert("게시글이 등록되었습니다.")
      router.push("/community")
    }, 1000)
  }

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?")) {
        router.push("/community")
      }
    } else {
      router.push("/community")
    }
  }

  // 로딩 중이거나 로그인하지 않은 경우
  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {loading ? (
            <p className="text-lg text-muted-foreground">로딩 중...</p>
          ) : (
            <>
              <p className="text-lg text-muted-foreground">로그인이 필요합니다.</p>
              <Link href="/login">
                <Button className="mt-4">로그인하기</Button>
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
                <Link href="/community">
                  <Button variant="ghost" size="sm" className="gap-2 text-lg">
                    <ArrowLeft className="h-5 w-5" />
                    목록으로
                  </Button>
                </Link>
                <CardTitle className="text-3xl">커뮤니티 글쓰기</CardTitle>
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
                  placeholder="게시글 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-xl py-3"
                />
              </div>

              {/* 카테고리 */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xl">카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="text-xl py-3">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 내용 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-xl">내용 *</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="게시글 내용을 입력하세요. 툴바를 사용하여 텍스트 스타일을 조정하고 이미지를 첨부할 수 있습니다."
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
