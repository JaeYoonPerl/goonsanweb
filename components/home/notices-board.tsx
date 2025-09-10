/**
 * 공지사항 게시판 컴포넌트
 * - 홈페이지에 표시될 공지사항 목록을 렌더링
 * - 중요 공지 우선 정렬 및 최대 4개 표시
 * - 전체 공지사항 보기 버튼 포함
 */
import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { NoticeItem } from "./notice-item"
import { Notice } from "@/lib/data"

interface NoticesBoardProps {
  notices: Notice[]
}

export const NoticesBoard = memo(function NoticesBoard({ notices }: NoticesBoardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-3xl">
          <Bell className="h-8 w-8 text-primary" />
          공지사항
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          {notices.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} />
          ))}
        </div>
        <Button variant="outline" size="lg" className="w-full mt-6 bg-transparent text-2xl py-4" asChild>
          <a href="/notices">전체 공지사항 보기</a>
        </Button>
      </CardContent>
    </Card>
  )
})
