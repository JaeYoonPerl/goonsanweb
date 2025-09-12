
/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * - 페이지 이동 기능 제공
 * - 현재 페이지 하이라이트
 * - 이전/다음 버튼 비활성화 처리
 * - 반응형 디자인 지원
 */
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: PaginationProps) {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // 최대 표시할 페이지 수
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지를 중심으로 페이지 번호 생성
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <div className="flex items-center gap-2">
        {/* 이전 버튼 */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          이전
        </Button>

        {/* 페이지 번호들 */}
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className="text-sm min-w-[40px]"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {/* 다음 버튼 */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="text-sm"
        >
          다음
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
})
