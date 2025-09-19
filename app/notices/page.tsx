/**
 * 공지사항 목록 페이지
 * - 공지사항 목록을 표시하고 검색/필터링 기능 제공
 * - 페이지네이션으로 대량의 데이터 효율적 표시
 * - 관리자 권한에 따른 글 작성/수정 버튼 표시
 * - 최적화된 성능과 타입 안정성 보장
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Image, Heart, Pin, PinOff } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks"
import { stripHtml, hasImage } from "@/lib/utils"
import Header from "@/components/home/header"
import { NOTICES } from "@/lib/data"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { SearchSection } from "@/components/common/search-section"
import { NOTICE_TYPES, PAGINATION_CONFIG, noticeStorage, Notice, NoticeType } from "@/lib"
import { useDataStore } from "@/stores"

export default function NoticesPage() {
  // 상태 관리
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<NoticeType>("전체")
  const [allNotices, setAllNotices] = useState<Notice[]>(NOTICES.map(notice => ({
    ...notice,
    grade: notice.author // 기존 데이터에 grade 필드가 없으므로 author로 매핑
  })) as Notice[])
  const { user, isLoggedIn, isAdmin, loading } = useAuth()
  const { togglePinNotice } = useDataStore()

  // 임시 저장된 공지사항 로드
  useEffect(() => {
    const tempNotices = noticeStorage.loadTempNotices()
    if (tempNotices.length > 0) {
      const legacyNotices = NOTICES.map(notice => ({
        ...notice,
        grade: notice.author
      })) as Notice[]
      setAllNotices([...tempNotices, ...legacyNotices])
    }
  }, [])

  // 검색 및 필터링 로직 (메모이제이션)
  const filteredNotices = useMemo(() => {
    return allNotices
      .filter((notice) => {
        const matchesSearch = searchTerm === "" || 
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.author.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesType = searchType === "전체" || notice.type === searchType
        
        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        // 고정된 글 우선
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        
        // 그 다음 최신 순으로 정렬 (id가 클수록 최신)
        return b.id - a.id
      })
  }, [allNotices, searchTerm, searchType])

  // 페이지네이션 계산 (메모이제이션)
  const paginationInfo = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGINATION_CONFIG.ITEMS_PER_PAGE))
    const start = (page - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE
    const currentItems = filteredNotices.slice(start, start + PAGINATION_CONFIG.ITEMS_PER_PAGE)
    
    return { totalPages, currentItems }
  }, [filteredNotices, page])

  // 이벤트 핸들러들 (useCallback으로 최적화)
  const goTo = useCallback((p: number) => {
    if (p < 1 || p > paginationInfo.totalPages) return
    setPage(p)
  }, [paginationInfo.totalPages])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setPage(1)
  }, [])

  const handleTypeFilter = useCallback((type: NoticeType) => {
    setSearchType(type)
    setPage(1)
  }, [])

  // 검색 필터 설정 (메모이제이션)
  const searchFilters = useMemo(() => 
    NOTICE_TYPES.map(type => ({
      label: type,
      value: type,
      onClick: () => handleTypeFilter(type),
      isActive: searchType === type
    })), [searchType, handleTypeFilter]
  )

  // 검색 결과 정보 (메모이제이션)
  const searchResultsInfo = useMemo(() => {
    if (!searchTerm && searchType === "전체") return null
    return (
      <div className="text-sm text-muted-foreground">
        {searchTerm && `"${searchTerm}" `}
        {searchType !== "전체" && `${searchType} 공지사항 `}
        검색 결과: {filteredNotices.length}건
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
            <CardTitle className="flex items-center justify-between text-lg">
              <span>전체 공지사항 ({filteredNotices.length}건)</span>
              {!loading && isLoggedIn && isAdmin && (
                <Link href="/notices/write">
                  <Button size="sm" className="text-sm">글쓰기</Button>
                </Link>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paginationInfo.currentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {paginationInfo.currentItems.map((notice) => (
                  <div key={notice.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                    <Badge
                      variant={notice.isImportant ? "destructive" : notice.type === "행사" ? "outline" : "secondary"}
                        className="text-xs"
                    >
                      {notice.type}
                    </Badge>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link href={`/notices/${notice.id}`}>
                            <h3 className="text-xl font-medium text-foreground hover:text-primary cursor-pointer flex items-center gap-2">
                              {notice.title}
                              {hasImage(notice.content) && (
                                <Image className="h-4 w-4 text-muted-foreground" />
                              )}
                            </h3>
                          </Link>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                togglePinNotice(notice.id)
                                setAllNotices(prev => prev.map(n => 
                                  n.id === notice.id ? { ...n, isPinned: !n.isPinned } : n
                                ))
                              }}
                              className="h-6 w-6 p-0"
                            >
                              {notice.isPinned ? (
                                <PinOff className="h-4 w-4 text-primary" />
                              ) : (
                                <Pin className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{stripHtml(notice.content)}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                          <span>작성자: {notice.author}</span>
                          <span>작성일: {notice.date}</span>
                        </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                          <span>{notice.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
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
            {paginationInfo.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goTo(page - 1)} 
                    disabled={page === 1} 
                    className="text-sm"
                  >
                    이전
                  </Button>
                  {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className="text-sm"
                      onClick={() => goTo(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goTo(page + 1)} 
                    disabled={page === paginationInfo.totalPages} 
                    className="text-sm"
                  >
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
