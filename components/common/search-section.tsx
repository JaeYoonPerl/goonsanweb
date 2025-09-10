/**
 * 검색 섹션 공통 컴포넌트
 * - 검색 입력창, 필터 버튼들, 검색 결과 정보를 포함
 * - 여러 페이지에서 재사용 가능한 통합 검색 UI
 * - 검색어 입력, 필터 선택, 초기화 기능 제공
 */
import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchSectionProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onReset: () => void
  placeholder?: string
  filters?: {
    label: string
    value: string
    onClick: (value: string) => void
    isActive: boolean
  }[]
  resultsInfo?: React.ReactNode
}

export const SearchSection = memo(function SearchSection({
  searchTerm,
  onSearchChange,
  onReset,
  placeholder = "검색어를 입력하세요...",
  filters = [],
  resultsInfo
}: SearchSectionProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground" />
              <Input 
                placeholder={placeholder}
                className="pl-16 text-2xl py-6 h-18"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button onClick={onReset} size="lg" className="text-lg h-14 px-6">
              초기화
            </Button>
          </div>

          {/* Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <Button 
                  key={filter.value} 
                  variant={filter.isActive ? "default" : "outline"} 
                  size="lg"
                  className="text-xl h-14 px-8"
                  onClick={() => filter.onClick(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          )}

          {/* Search Results Info */}
          {resultsInfo}
        </div>
      </CardContent>
    </Card>
  )
})
