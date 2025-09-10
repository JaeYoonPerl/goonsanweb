/**
 * 공지사항 목록 페이지
 * - 공지사항 목록을 표시하고 검색/필터링 기능 제공
 * - 페이지네이션으로 대량의 데이터 효율적 표시
 * - 관리자 권한에 따른 글 작성/수정 버튼 표시
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Image, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { stripHtml, hasImage } from "@/lib/utils"
import Header from "@/components/home/header"
import { NOTICES } from "@/lib/data"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { SearchSection } from "@/components/common/search-section"

export default function NoticesPage() {
  const itemsPerPage = 3
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("전체")
  const [allNotices, setAllNotices] = useState(NOTICES)
  const { user, isLoggedIn, isAdmin, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 임시 저장된 공지사항 로드
  useEffect(() => {
    const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
    if (tempNotices.length > 0) {
      setAllNotices([...tempNotices, ...NOTICES])
    }
  }, [])

  // 검색 필터링
  const filteredNotices = allNotices.filter((notice) => {
    const matchesSearch = searchTerm === "" || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = searchType === "전체" || notice.type === searchType
    
    return matchesSearch && matchesType
  })

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / itemsPerPage))
  const start = (page - 1) * itemsPerPage
  const currentItems = filteredNotices.slice(start, start + itemsPerPage)

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  // 검색어가 변경되면 첫 페이지로 이동
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setPage(1)
  }, [])

  const handleTypeFilter = useCallback((type: string) => {
    setSearchType(type)
    setPage(1)
  }, [])


  const searchTypes = useMemo(() => ["전체", "중요", "일반", "행사"], [])

  const searchFilters = useMemo(() => 
    searchTypes.map(type => ({
      label: type,
      value: type,
      onClick: handleTypeFilter,
      isActive: searchType === type
    })), [searchTypes, searchType, handleTypeFilter]
  )

  const searchResultsInfo = useMemo(() => {
    if (!searchTerm && searchType === "전체") return null
    return (
      <div className="text-lg text-muted-foreground">
        {searchTerm && `"${searchTerm}" 검색 결과: `}
        {searchType !== "전체" && `${searchType} 공지사항 `}
        총 {filteredNotices.length}개
      </div>
    )
  }, [searchTerm, searchType, filteredNotices.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <BackgroundDecorations />
      
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <SearchSection
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onReset={() => handleSearch("")}
            placeholder="공지사항을 검색하세요..."
            filters={searchFilters}
            resultsInfo={searchResultsInfo}
          />

        {/* Notices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl">
              <span>전체 공지사항 ({filteredNotices.length}건)</span>
              {!loading && isLoggedIn && isAdmin && (
                <Link href="/notices/write">
                  <Button size="lg" className="text-base">글쓰기</Button>
                </Link>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-lg">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {currentItems.map((notice) => (
                  <div key={notice.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-4">
                    <Badge
                      variant={notice.isImportant ? "destructive" : notice.type === "행사" ? "outline" : "secondary"}
                        className="text-sm"
                    >
                      {notice.type}
                    </Badge>
                    <div className="flex-1">
                        <Link href={`/notices/${notice.id}`}>
                          <h3 className="text-3xl font-medium text-foreground mb-3 hover:text-primary cursor-pointer flex items-center gap-2">
                        {notice.title}
                            {hasImage(notice.content) && (
                              <Image className="h-5 w-5 text-muted-foreground" />
                            )}
                      </h3>
                        </Link>
                        <p className="text-xl text-muted-foreground mb-4 line-clamp-2">{stripHtml(notice.content)}</p>
                        <div className="flex items-center justify-between text-lg text-muted-foreground">
                          <div className="flex items-center gap-6">
                          <span>작성자: {notice.author}</span>
                          <span>작성일: {notice.date}</span>
                        </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Eye className="h-5 w-5" />
                          <span>{notice.views}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="h-5 w-5" />
                              <span>{notice.likes || 0}</span>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="lg" onClick={() => goTo(page - 1)} disabled={page === 1} className="text-base">
                  이전
                </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="lg"
                      className="text-base"
                      onClick={() => goTo(p)}
                    >
                      {p}
                </Button>
                  ))}
                  <Button variant="outline" size="lg" onClick={() => goTo(page + 1)} disabled={page === totalPages} className="text-base">
                  다음
                </Button>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      </main>
      </div>
    </div>
  )
}
