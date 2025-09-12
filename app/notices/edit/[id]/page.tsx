"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks"
import { RichTextEditor } from "@/components/rich-text-editor"
import Header from "@/components/home/header"

const noticeTypes = ["일반", "중요", "행사"]

export default function EditNoticePage() {
  const params = useParams()
  const router = useRouter()
  const { isAdmin, loading } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState("")
  const [isImportant, setIsImportant] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAdmin) {
      alert("관리자 권한이 필요합니다.")
      router.push("/login")
      return
    }

    // 수정할 데이터 로드
    const editData = localStorage.getItem("editNoticeData")
    if (editData) {
      try {
        const data = JSON.parse(editData)
        setTitle(data.title || "")
        setContent(data.content || "")
        setType(data.type || "")
        setIsImportant(data.isImportant || false)
      } catch (error) {
        console.error("Failed to parse edit data:", error)
        alert("수정할 데이터를 불러올 수 없습니다.")
        router.push("/notices")
      }
    } else {
      alert("수정할 데이터를 찾을 수 없습니다.")
      router.push("/notices")
    }
  }, [isAdmin, loading, router])

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }
    if (!type) {
      alert("공지 유형을 선택해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const noticeId = parseInt(params.id as string)
      const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
      
      // 해당 공지사항 찾아서 업데이트
      const updatedNotices = tempNotices.map((notice: any) => {
        if (notice.id === noticeId) {
          return {
            ...notice,
            title: title.trim(),
            content: content.trim(),
            type: type,
            isImportant: isImportant,
            date: new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/\s/g, '')
          }
        }
        return notice
      })

      localStorage.setItem("tempNotices", JSON.stringify(updatedNotices))
      
      // 수정 데이터 삭제
      localStorage.removeItem("editNoticeData")
      
      alert("공지사항이 수정되었습니다.")
      router.push(`/notices/${noticeId}`)
    } catch (error) {
      console.error("Failed to update notice:", error)
      alert("공지사항 수정에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
      localStorage.removeItem("editNoticeData")
      router.push(`/notices/${params.id}`)
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
                <Link href={`/notices/${params.id}`}>
                  <Button variant="ghost" size="lg" className="gap-2 text-base">
                    <ArrowLeft className="h-5 w-5" />
                    돌아가기
                  </Button>
                </Link>
                <CardTitle className="text-2xl">공지사항 수정</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="type" className="text-xl">공지 유형 *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="text-xl py-3">
                  <SelectValue placeholder="공지 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {noticeTypes.map((noticeType) => (
                    <SelectItem key={noticeType} value={noticeType} className="text-lg">
                      {noticeType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isImportant"
                checked={isImportant}
                onCheckedChange={(checked) => setIsImportant(checked === true)}
              />
              <Label htmlFor="isImportant" className="text-xl">
                중요 공지로 설정
              </Label>
            </div>

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
                <p>• 관리자만 공지사항을 수정할 수 있습니다.</p>
                <p>• 수정된 공지사항은 즉시 반영됩니다.</p>
                <p>• 중요 공지로 설정하면 목록 상단에 고정됩니다.</p>
                <p>• 툴바를 사용하여 텍스트 스타일을 조정할 수 있습니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
