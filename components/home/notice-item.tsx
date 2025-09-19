/**
 * 공지사항 개별 아이템 컴포넌트
 * - 공지사항의 제목, 내용, 작성자, 날짜, 조회수, 좋아요 수를 표시
 * - 중요 공지의 경우 빨간색 배지로 표시
 * - 클릭 시 상세 페이지로 이동
 */
import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageCircle, Pin, Star, Bookmark } from "lucide-react"
import Link from "next/link"
import { stripHtml } from "@/lib/utils"
import { Notice } from "@/lib/data"

interface NoticeItemProps {
  notice: Notice
}

export const NoticeItem = memo(function NoticeItem({ notice }: NoticeItemProps) {
  const getBadgeVariant = (notice: Notice) => {
    if (notice.isImportant) return "destructive"
    if (notice.type === "행사") return "outline"
    return "secondary"
  }

  return (
    <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Badge variant={getBadgeVariant(notice)} className="text-lg">
          {notice.type}
        </Badge>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/notices/${notice.id}`}>
              <h4 className="text-2xl font-medium text-foreground hover:text-primary cursor-pointer flex items-center gap-2">
                {notice.title}
                {notice.isPinned && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-xs font-medium text-primary">고정</span>
                  </div>
                )}
              </h4>
            </Link>
          </div>
          <p className="text-xl text-muted-foreground mb-3">
            {stripHtml(notice.content)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg text-muted-foreground">{notice.author}</span>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-5 w-5" />
                <span>{notice.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5" />
                <span>{notice.likes || 0}</span>
              </div>
              <span>{notice.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
