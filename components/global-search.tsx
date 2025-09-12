"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { NOTICES, POSTS, stripHtml } from "@/lib"

interface SearchResult {
  id: string
  title: string
  content: string
  type: 'notice' | 'post'
  author: string
  date: string
  category?: string
  grade?: string
  isImportant?: boolean
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 검색 실행
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // localStorage에서 임시 데이터 가져오기
      const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
      const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
      
      const allNotices = [...NOTICES, ...tempNotices]
      const allPosts = [...POSTS, ...tempPosts]
      
      const searchResults: SearchResult[] = []
      
      // 공지사항 검색
      allNotices.forEach(notice => {
        const titleMatch = notice.title.toLowerCase().includes(searchQuery.toLowerCase())
        const contentMatch = stripHtml(notice.content).toLowerCase().includes(searchQuery.toLowerCase())
        
        if (titleMatch || contentMatch) {
          searchResults.push({
            id: notice.id,
            title: notice.title,
            content: stripHtml(notice.content),
            type: 'notice',
            author: notice.author,
            date: notice.date,
            isImportant: notice.isImportant
          })
        }
      })
      
      // 커뮤니티 게시글 검색
      allPosts.forEach(post => {
        const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
        const contentMatch = stripHtml(post.content).toLowerCase().includes(searchQuery.toLowerCase())
        
        if (titleMatch || contentMatch) {
          searchResults.push({
            id: post.id,
            title: post.title,
            content: stripHtml(post.content),
            type: 'post',
            author: post.author,
            date: post.date,
            category: post.category,
            grade: post.grade
          })
        }
      })
      
      // 중요 공지를 먼저, 그 다음 최신순으로 정렬
      searchResults.sort((a, b) => {
        if (a.type === 'notice' && b.type === 'notice') {
          if (a.isImportant && !b.isImportant) return -1
          if (!a.isImportant && b.isImportant) return 1
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 검색어 변경 시 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // 결과 클릭 시 해당 페이지로 이동
  const handleResultClick = (result: SearchResult) => {
    const path = result.type === 'notice' ? `/notices/${result.id}` : `/community/${result.id}`
    router.push(path)
    onClose()
  }

  // 검색 결과 하이라이트
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-4xl mx-4 max-h-[85vh] overflow-hidden">
        <CardContent className="p-6">
          {/* 검색 헤더 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="공지사항, 커뮤니티 게시글 검색..."
                className="pl-12 text-sm py-3 h-10"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 검색 결과 */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                검색 중...
              </div>
            ) : query.trim() ? (
              results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.type === 'notice' ? 'default' : 'secondary'} className="text-xs">
                            {result.type === 'notice' ? '공지사항' : '커뮤니티'}
                          </Badge>
                          {result.isImportant && (
                            <Badge variant="destructive" className="text-xs">중요</Badge>
                          )}
                          {result.category && (
                            <Badge variant="outline" className="text-xs">{result.category}</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {result.date}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium mb-2 line-clamp-1">
                        {highlightText(result.title, query)}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {highlightText(result.content, query)}
                      </p>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{result.author}</span>
                        {result.grade && <span>({result.grade})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  검색 결과가 없습니다.
                </div>
              )
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                검색어를 입력해주세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
