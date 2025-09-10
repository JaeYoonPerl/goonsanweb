/**
 * 동문 커뮤니티 목록 페이지
 * - 동문 커뮤니티 게시글 목록을 표시하고 검색/카테고리 필터링 기능 제공
 * - 페이지네이션으로 대량의 데이터 효율적 표시
 * - 로그인한 사용자만 글 작성 가능
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Eye, Heart, MessageCircle, Image } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { stripHtml, hasImage } from "@/lib/utils"
import Header from "@/components/home/header"
import { POSTS } from "@/lib/data"
import { BackgroundDecorations } from "@/components/common/background-decorations"
import { SearchSection } from "@/components/common/search-section"

const categories = ["전체", "동기회", "모교소식", "사업소개", "취업정보", "모임제안", "기타"]

export default function CommunityPage() {
  const itemsPerPage = 3
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [allPosts, setAllPosts] = useState(POSTS)
  const { user, isLoggedIn, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 임시 저장된 게시글 로드
  useEffect(() => {
    const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
    if (tempPosts.length > 0) {
      setAllPosts([...tempPosts, ...POSTS])
    }
  }, [])

  // 검색 필터링
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.grade.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage))
  const start = (page - 1) * itemsPerPage
  const currentItems = filteredPosts.slice(start, start + itemsPerPage)

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  // 검색어가 변경되면 첫 페이지로 이동
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setPage(1)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* 장식적 요소들 */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Categories */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground" />
                  <Input 
                    placeholder="게시글을 검색하세요..." 
                    className="pl-16 text-2xl py-6 h-18"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSearch("")} size="lg" className="text-lg h-14 px-6">초기화</Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "outline"} 
                    size="lg"
                    className="text-xl h-14 px-8"
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Search Results Info */}
              {(searchTerm || selectedCategory !== "전체") && (
                <div className="text-base text-muted-foreground">
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
            <CardTitle className="flex items-center justify-between text-xl">
              <span>커뮤니티 게시글 ({filteredPosts.length}건)</span>
              {!loading && isLoggedIn && (
                <Link href="/community/write">
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
              <div className="space-y-8">
                {currentItems.map((post) => (
                  <div key={post.id} className="border-b border-border pb-8 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <Badge variant="outline" className="text-sm">
                      {post.category}
                    </Badge>
                    <div className="flex-1">
                        <Link href={`/community/${post.id}`}>
                          <h3 className="text-3xl font-medium text-foreground mb-3 hover:text-primary cursor-pointer flex items-center gap-2">
                        {post.title}
                            {hasImage(post.content) && (
                              <Image className="h-5 w-5 text-muted-foreground" />
                            )}
                      </h3>
                        </Link>
                        <p className="text-xl text-muted-foreground mb-4 line-clamp-2">{stripHtml(post.content)}</p>

                      {/* Author and Date */}
                        <div className="flex items-center justify-between text-lg text-muted-foreground mb-4">
                          <div className="flex items-center gap-6">
                          <span>
                            작성자: {post.author} ({post.grade})
                          </span>
                          <span>작성일: {post.date}</span>
                        </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Eye className="h-5 w-5" />
                          <span>{post.views}</span>
                        </div>
                            <div className="flex items-center gap-2">
                              <Heart className="h-5 w-5" />
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
