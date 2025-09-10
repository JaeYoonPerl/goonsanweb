/**
 * 마이페이지
 * - 사용자 개인정보 수정 및 관리
 * - 내가 작성한 글 목록 표시
 * - 비밀번호 변경 기능
 * - 회원 탈퇴 기능
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Edit, Trash2, MessageCircle, Eye, Heart, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/home/header"
import { stripHtml } from "@/lib/utils"

export default function MyPage() {
  const { user, isLoggedIn, loading } = useAuth()
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userNotices, setUserNotices] = useState<any[]>([])
  const [userComments, setUserComments] = useState<any[]>([])
  const [postTitles, setPostTitles] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (!isLoggedIn || !user) return

    // 사용자가 작성한 게시글 로드
    const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
    const userPosts = tempPosts.filter((post: any) => 
      post.author === user.name && post.grade === user.grade
    )
    setUserPosts(userPosts)

    // 사용자가 작성한 공지사항 로드
    const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
    const userNotices = tempNotices.filter((notice: any) => 
      notice.author === user.name
    )
    setUserNotices(userNotices)

    // 사용자가 작성한 댓글 로드
    const allComments: any[] = []
    
    // 모든 댓글 키를 찾아서 로드
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('comments_post_') || key.startsWith('comments_notice_'))) {
        try {
          const comments = JSON.parse(localStorage.getItem(key) || '[]')
          allComments.push(...comments)
        } catch (error) {
          console.error(`Failed to parse comments from ${key}:`, error)
        }
      }
    }

    const userComments = allComments.filter((comment: any) => 
      comment.author === user.name && comment.grade === user.grade
    )
    setUserComments(userComments)

    // 게시글 제목 매핑 생성
    const titles: {[key: string]: string} = {}
    
    // 커뮤니티 게시글 제목
    const allPosts = [...tempPosts, ...JSON.parse(localStorage.getItem("tempPosts") || "[]")]
    allPosts.forEach((post: any) => {
      titles[`post_${post.id}`] = post.title
    })
    
    // 공지사항 제목
    const allNotices = [...tempNotices, ...JSON.parse(localStorage.getItem("tempNotices") || "[]")]
    allNotices.forEach((notice: any) => {
      titles[`notice_${notice.id}`] = notice.title
    })
    
    setPostTitles(titles)
  }, [user, isLoggedIn])

  const handleDeletePost = useCallback((postId: number, type: 'post' | 'notice') => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    const storageKey = type === 'post' ? 'tempPosts' : 'tempNotices'
    const currentData = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const updatedData = currentData.filter((item: any) => item.id !== postId)
    localStorage.setItem(storageKey, JSON.stringify(updatedData))

    if (type === 'post') {
      setUserPosts(prev => prev.filter(post => post.id !== postId))
    } else {
      setUserNotices(prev => prev.filter(notice => notice.id !== postId))
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">로그인이 필요합니다</h2>
              <p className="text-muted-foreground mb-6">
                마이페이지를 이용하려면 먼저 로그인해주세요.
              </p>
              <Link href="/login">
                <Button size="lg">로그인하기</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 사용자 정보 카드 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                내 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.grade}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={user?.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user?.role === 'admin' ? '관리자' : '일반회원'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 탭 메뉴 */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                내가 쓴 글
              </TabsTrigger>
              <TabsTrigger value="notices" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                내가 쓴 공지
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                내가 쓴 댓글
              </TabsTrigger>
            </TabsList>

            {/* 내가 쓴 글 */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">커뮤니티 게시글 ({userPosts.length}개)</h3>
                <Link href="/community/write">
                  <Button size="sm">글쓰기</Button>
                </Link>
              </div>
              
              {userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/community/${post.id}`}>
                              <h4 className="text-lg font-medium hover:text-primary transition-colors mb-2">
                                {post.title}
                              </h4>
                            </Link>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {stripHtml(post.content)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {post.likes || 0}
                              </div>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link href={`/community/edit/${post.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePost(post.id, 'post')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Edit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">작성한 글이 없습니다</h4>
                    <p className="text-muted-foreground mb-4">
                      첫 번째 게시글을 작성해보세요!
                    </p>
                    <Link href="/community/write">
                      <Button>글쓰기</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 내가 쓴 공지 */}
            <TabsContent value="notices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">공지사항 ({userNotices.length}개)</h3>
                {user?.role === 'admin' && (
                  <Link href="/notices/write">
                    <Button size="sm">공지 작성</Button>
                  </Link>
                )}
              </div>
              
              {userNotices.length > 0 ? (
                <div className="space-y-4">
                  {userNotices.map((notice) => (
                    <Card key={notice.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/notices/${notice.id}`}>
                              <h4 className="text-lg font-medium hover:text-primary transition-colors mb-2">
                                {notice.title}
                              </h4>
                            </Link>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {stripHtml(notice.content)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {notice.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {notice.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {notice.likes || 0}
                              </div>
                              {notice.isImportant && (
                                <Badge variant="destructive">중요</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link href={`/notices/edit/${notice.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePost(notice.id, 'notice')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">작성한 공지가 없습니다</h4>
                    <p className="text-muted-foreground">
                      {user?.role === 'admin' ? '첫 번째 공지사항을 작성해보세요!' : '관리자만 공지사항을 작성할 수 있습니다.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 내가 쓴 댓글 */}
            <TabsContent value="comments" className="space-y-4">
              <h3 className="text-lg font-semibold">댓글 ({userComments.length}개)</h3>
              
              {userComments.length > 0 ? (
                <div className="space-y-4">
                  {userComments.map((comment, index) => {
                    const postKey = `${comment.postType}_${comment.postId}`
                    const postTitle = postTitles[postKey] || '게시글을 찾을 수 없습니다'
                    
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2">
                                <Link 
                                  href={`/${comment.postType === 'post' ? 'community' : 'notices'}/${comment.postId}`}
                                  className="text-sm font-medium text-primary hover:underline"
                                >
                                  {postTitle}
                                </Link>
                              </div>
                              <p className="text-base mb-2">{comment.content}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {comment.date}
                                </div>
                                <Badge variant="outline">
                                  {comment.postType === 'post' ? '커뮤니티' : '공지사항'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-medium mb-2">작성한 댓글이 없습니다</h4>
                    <p className="text-muted-foreground">
                      게시글에 댓글을 작성해보세요!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
