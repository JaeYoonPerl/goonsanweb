/**
 * 동문 커뮤니티 목록 페이지
 * - 동문 커뮤니티 게시글 목록을 표시하고 검색/카테고리 필터링 기능 제공
 * - 페이지네이션으로 대량의 데이터 효율적 표시
 * - 로그인한 사용자만 글 작성 가능
 * - 최적화된 성능과 타입 안정성 보장
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Eye, Heart, Image } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { stripHtml, hasImage } from "@/lib/utils"
import Header from "@/components/home/header"
import { POSTS } from "@/lib/data"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { COMMUNITY_CATEGORIES, PAGINATION_CONFIG } from "@/lib/constants"
import { postStorage } from "@/lib/storage"
import { CommunityPost, CommunityCategory, LegacyPost } from "@/lib/types"

export default function CommunityPage() {
  // 상태 관리
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("전체")
  const [allPosts, setAllPosts] = useState<CommunityPost[]>(POSTS as CommunityPost[])
  const { user, isLoggedIn, loading } = useAuth()

  // 임시 저장된 게시글 로드
  useEffect(() => {
    const tempPosts = postStorage.loadTempPosts()
    if (tempPosts.length > 0) {
      setAllPosts([...tempPosts, ...(POSTS as CommunityPost[])])
    }
  }, [])

  // 검색 및 필터링 로직 (메모이제이션)
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch = searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.grade.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [allPosts, searchTerm, selectedCategory])

  // 페이지네이션 계산 (메모이제이션)
  const paginationInfo = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGINATION_CONFIG.ITEMS_PER_PAGE))
    const start = (page - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE
    const currentItems = filteredPosts.slice(start, start + PAGINATION_CONFIG.ITEMS_PER_PAGE)
    
    return { totalPages, currentItems }
  }, [filteredPosts, page])

  // 이벤트 핸들러들 (useCallback으로 최적화)
  const goTo = useCallback((p: number) => {
    if (p < 1 || p > paginationInfo.totalPages) return
    setPage(p)
  }, [paginationInfo.totalPages])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setPage(1)
  }, [])

  const handleCategoryFilter = useCallback((category: CommunityCategory) => {
    setSelectedCategory(category)
    setPage(1)
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <BackgroundDecorations />
      
      <div className="relative z-10">
        <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Categories */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="게시글을 검색하세요..." 
                    className="pl-12 text-sm py-3 h-10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSearch("")} size="sm" className="text-sm h-10 px-4">초기화</Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {COMMUNITY_CATEGORIES.map((category) => (
                  <Button 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "outline"} 
                    size="sm"
                    className="text-sm h-8 px-4"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Search Results Info */}
              {(searchTerm || selectedCategory !== "전체") && (
                <div className="text-sm text-muted-foreground">
                  {searchTerm && `"${searchTerm}" `}
                  {selectedCategory !== "전체" && `${selectedCategory} 카테고리 `}
                  검색 결과: {filteredPosts.length}건
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>커뮤니티 게시글 ({filteredPosts.length}건)</span>
              {!loading && isLoggedIn && (
                <Link href="/community/write">
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
                {paginationInfo.currentItems.map((post) => (
                  <div key={post.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex-1">
                        <Link href={`/community/${post.id}`}>
                          <h3 className="text-xl font-medium text-foreground mb-2 hover:text-primary cursor-pointer flex items-center gap-2">
                        {post.title}
                            {hasImage(post.content) && (
                              <Image className="h-4 w-4 text-muted-foreground" />
                            )}
                      </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{stripHtml(post.content)}</p>

                      {/* Author and Date */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-4">
                          <span>
                            작성자: {post.author} ({post.grade})
                          </span>
                          <span>작성일: {post.date}</span>
                        </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
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
