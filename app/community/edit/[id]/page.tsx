"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks"
import { RichTextEditor } from "@/components/rich-text-editor"
import Header from "@/components/home/header"

const categories = ["동기회", "모교소식", "사업소개", "취업정보", "모임제안", "기타"]

export default function EditCommunityPostPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoggedIn, loading } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    // 수정할 데이터 로드
    const editData = localStorage.getItem("editPostData")
    if (editData) {
      try {
        const data = JSON.parse(editData)
        setTitle(data.title || "")
        setContent(data.content || "")
        setCategory(data.category || "")
      } catch (error) {
        console.error("Failed to parse edit data:", error)
        alert("수정할 데이터를 불러올 수 없습니다.")
        router.push("/community")
      }
    } else {
      alert("수정할 데이터를 찾을 수 없습니다.")
      router.push("/community")
    }
  }, [isLoggedIn, loading, router])

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }
    if (!category) {
      alert("카테고리를 선택해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const postId = parseInt(params.id as string)
      const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
      
      // 해당 게시글 찾아서 업데이트
      const updatedPosts = tempPosts.map((post: any) => {
        if (post.id === postId) {
          return {
            ...post,
            title: title.trim(),
            content: content.trim(),
            category: category,
            date: new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/\s/g, '')
          }
        }
        return post
      })

      localStorage.setItem("tempPosts", JSON.stringify(updatedPosts))
      
      // 수정 데이터 삭제
      localStorage.removeItem("editPostData")
      
      alert("게시글이 수정되었습니다.")
      router.push(`/community/${postId}`)
    } catch (error) {
      console.error("Failed to update post:", error)
      alert("게시글 수정에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
      localStorage.removeItem("editPostData")
      router.push(`/community/${params.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">로딩 중...</p>
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
                <Link href={`/community/${params.id}`}>
                  <Button variant="ghost" size="lg" className="gap-2 text-base">
                    <ArrowLeft className="h-5 w-5" />
                    돌아가기
                  </Button>
                </Link>
                <CardTitle className="text-2xl">게시글 수정</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xl">카테고리 *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-xl py-3">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-lg">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 text-xl py-3"
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "저장 중..." : "저장"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-xl py-3 px-6"
              >
                <X className="h-5 w-5 mr-2" />
                취소
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-xl">수정 안내</h4>
              <div className="text-lg text-muted-foreground space-y-1">
                <p>• 본인이 작성한 게시글만 수정할 수 있습니다.</p>
                <p>• 수정된 게시글은 즉시 반영됩니다.</p>
                <p>• 툴바를 사용하여 텍스트 스타일을 조정할 수 있습니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
