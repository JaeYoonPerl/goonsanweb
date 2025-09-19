/**
 * 고정 배지 컴포넌트
 * - 고정된 글을 표시하는 재사용 가능한 배지
 * - 일관된 디자인과 접근성 지원
 */
import { memo } from "react"
import { Star } from "lucide-react"

interface PinnedBadgeProps {
  className?: string
}

export const PinnedBadge = memo(function PinnedBadge({ className = "" }: PinnedBadgeProps) {
  return (
    <div className={`flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full ${className}`}>
      <Star className="h-4 w-4 text-primary fill-primary" />
      <span className="text-xs font-medium text-primary">고정</span>
    </div>
  )
})
