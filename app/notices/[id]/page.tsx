"use client"

// 정적 생성용 함수
export async function generateStaticParams() {
  const { NOTICES } = await import('@/lib/data')
  return NOTICES.map((notice) => ({
    id: notice.id.toString(),
  }))
}

/**
 * 공지사항 상세 페이지
 * - 개별 공지사항의 상세 내용을 표시
 * - 댓글 기능과 좋아요/조회수 표시
 * - 이전/다음 글 네비게이션 기능
 * - 관리자 권한에 따른 수정/삭제 버튼 표시
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Calendar, User, Trash2, Edit, MessageCircle, Send, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/home/header"
import { usePostNavigation } from "@/hooks/use-post-navigation"
import { useComments } from "@/hooks/use-comments"

// 기존 공지사항 더미 데이터
const notices = [
  {
    id: 1,
    title: "2024년 정기 총회 개최 안내",
    content: `
      <h2>2024년 정기 총회 개최 안내</h2>
      <p>안녕하세요, 군산중고등학교 총동창회 회원 여러분.</p>
      <p>2024년 정기 총회를 다음과 같이 개최하오니 많은 참석 부탁드립니다.</p>
      
      <h3>📅 일시</h3>
      <ul>
        <li>날짜: 2024년 12월 15일 (일요일)</li>
        <li>시간: 오후 2시 ~ 5시</li>
      </ul>
      
      <h3>📍 장소</h3>
      <ul>
        <li>군산중고등학교 강당</li>
        <li>주소: 전북 군산시 ○○구 ○○로 123</li>
      </ul>
      
      <h3>📋 안건</h3>
      <ol>
        <li>2024년도 사업보고</li>
        <li>2024년도 결산 승인</li>
        <li>2025년도 사업계획 승인</li>
        <li>2025년도 예산 승인</li>
        <li>기타 안건</li>
      </ol>
      
      <h3>📞 문의</h3>
      <p>참석 여부나 문의사항이 있으시면 사무국으로 연락주세요.</p>
      <ul>
        <li>전화: 063-XXX-XXXX</li>
        <li>이메일: alumni@gunsan.hs.kr</li>
      </ul>
      
      <p><strong>많은 동문들의 참석을 기다리겠습니다.</strong></p>
    `,
    author: "관리자",
    date: "2024.11.28",
    views: 156,
    likes: 23,
    type: "중요",
    isImportant: true,
    comments: [
      {
        id: 1,
        author: "김동문",
        grade: "85회",
        content: "총회 참석하겠습니다!",
        date: "2024-11-21"
      },
      {
        id: 2,
        author: "이선배",
        grade: "80회",
        content: "좋은 안건들이 많네요. 많은 분들이 참석하시길 바랍니다.",
        date: "2024-11-21"
      }
    ],
  },
  {
    id: 2,
    title: "장학금 신청 접수 시작",
    content: `
      <h2>2025년도 장학금 신청 안내</h2>
      <p>군산중고등학교 총동창회에서는 2025년도 장학금 신청을 받습니다.</p>
      
      <h3>🎓 지원 대상</h3>
      <ul>
        <li>군산중고등학교 졸업생의 자녀</li>
        <li>현재 대학교에 재학 중인 학생</li>
        <li>성적 우수자 (평점 3.5 이상)</li>
      </ul>
      
      <h3>💰 지원 금액</h3>
      <ul>
        <li>1학년: 100만원</li>
        <li>2학년: 80만원</li>
        <li>3학년: 60만원</li>
        <li>4학년: 40만원</li>
      </ul>
      
      <h3>📅 신청 기간</h3>
      <p><strong>2024년 12월 1일 ~ 12월 31일</strong></p>
      
      <h3>📋 제출 서류</h3>
      <ol>
        <li>장학금 신청서</li>
        <li>재학증명서</li>
        <li>성적증명서</li>
        <li>가족관계증명서</li>
        <li>소득증빙서류</li>
      </ol>
      
      <h3>📞 문의</h3>
      <p>신청 방법이나 자세한 내용은 사무국으로 문의하세요.</p>
    `,
    author: "관리자",
    date: "2024.11.25",
    views: 89,
    likes: 12,
    type: "일반",
    isImportant: false,
    comments: [],
  },
  {
    id: 3,
    title: "동창회 회비 납부 안내",
    content: `
      <h2>2024년도 동창회 회비 납부 안내</h2>
      <p>동창회 운영을 위한 회비 납부를 안내드립니다.</p>
      
      <h3>💰 회비 금액</h3>
      <ul>
        <li>연회비: 30,000원</li>
        <li>평생회비: 500,000원 (일시납)</li>
      </ul>
      
      <h3>🏦 납부 계좌</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <p><strong>농협은행</strong></p>
        <p><strong>계좌번호: 123-456-789012</strong></p>
        <p><strong>예금주: 군산중고등학교 총동창회</strong></p>
      </div>
      
      <h3>📅 납부 기간</h3>
      <p>2024년 12월 31일까지</p>
      
      <h3>📋 납부 방법</h3>
      <ol>
        <li>온라인 뱅킹 또는 ATM을 통한 이체</li>
        <li>은행 창구를 통한 현금 납부</li>
        <li>모바일 뱅킹 앱을 통한 이체</li>
      </ol>
      
      <h3>⚠️ 주의사항</h3>
      <ul>
        <li>납부 시 입금자명을 "성명(학번)"으로 표기해주세요.</li>
        <li>예시: 김철수(85학번)</li>
        <li>납부 확인을 위해 입금 후 사무국으로 연락주세요.</li>
      </ul>
      
      <h3>📞 문의</h3>
      <p>회비 납부 관련 문의사항이 있으시면 사무국으로 연락주세요.</p>
    `,
    author: "관리자",
    date: "2024.11.20",
    views: 234,
    likes: 18,
    type: "일반",
    isImportant: false,
    comments: [],
  },
  {
    id: 4,
    title: "송년회 개최 안내",
    content: `
      <h2>2024년 송년회 개최 안내</h2>
      <p>한 해를 마무리하며 동문들과 함께하는 송년회를 개최합니다.</p>
      
      <h3>📅 일시</h3>
      <p><strong>2024년 12월 25일 (수요일) 오후 6시</strong></p>
      
      <h3>📍 장소</h3>
      <ul>
        <li>군산 롯데호텔 2층 연회장</li>
        <li>주소: 전북 군산시 ○○구 ○○로 456</li>
        <li>주차: 호텔 지하주차장 이용 가능</li>
      </ul>
      
      <h3>💰 참가비</h3>
      <ul>
        <li>일반: 50,000원</li>
        <li>학생: 30,000원</li>
        <li>평생회원: 무료</li>
      </ul>
      
      <h3>🍽️ 식사</h3>
      <ul>
        <li>코스 요리</li>
        <li>음료 및 주류 제공</li>
        <li>특별 메뉴: 군산 특산물 활용</li>
      </ul>
      
      <h3>🎤 행사 내용</h3>
      <ol>
        <li>개회사 및 축사</li>
        <li>2024년도 활동 보고</li>
        <li>우수 동문 표창</li>
        <li>네트워킹 타임</li>
        <li>경품 추첨</li>
        <li>폐회사</li>
      </ol>
      
      <h3>📞 참가 신청</h3>
      <p>참가를 원하시는 분은 12월 20일까지 사무국으로 연락주세요.</p>
      <ul>
        <li>전화: 063-XXX-XXXX</li>
        <li>이메일: alumni@gunsan.hs.kr</li>
      </ul>
      
      <p><strong>많은 동문들의 참석을 기다리겠습니다!</strong></p>
    `,
    author: "관리자",
    date: "2024.11.18",
    views: 178,
    likes: 31,
    type: "행사",
    isImportant: false,
    comments: [],
  },
]

export default function NoticeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [notice, setNotice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user, isLoggedIn, isAdmin } = useAuth()
  
  // 이전글/다음글 네비게이션
  const { prevPost, nextPost } = usePostNavigation(parseInt(params.id as string), 'notice')
  
  // 댓글 관리
  const { comments, newComment, setNewComment, addComment } = useComments(parseInt(params.id as string), 'notice')

  useEffect(() => {
    const noticeId = parseInt(params.id as string)
    
    // 임시 저장된 공지사항들 로드
    const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
    
    // 모든 공지사항 합치기 (임시 + 기존)
    const allNotices = [...tempNotices, ...notices]
    
    // 해당 ID의 공지사항 찾기
    const foundNotice = allNotices.find((n: any) => n.id === noticeId)
    
    if (foundNotice) {
      // 조회수 업데이트
      const viewKey = `notice_view_${noticeId}`
      const lastViewTime = localStorage.getItem(viewKey)
      const now = Date.now()
      
      // 24시간(86400000ms) 내에 다시 방문한 경우 조회수 증가하지 않음
      if (!lastViewTime || (now - parseInt(lastViewTime)) > 86400000) {
        const updatedNotice = { ...foundNotice }
        
        // 임시 공지사항인 경우
        if (tempNotices.find((n: any) => n.id === noticeId)) {
          updatedNotice.views += 1
          const updatedTempNotices = tempNotices.map((n: any) => 
            n.id === noticeId ? updatedNotice : n
          )
          localStorage.setItem("tempNotices", JSON.stringify(updatedTempNotices))
        } else {
          // 기존 공지사항인 경우 (실제로는 백엔드에서 처리해야 함)
          updatedNotice.views += 1
        }
        
        setNotice(updatedNotice)
        localStorage.setItem(viewKey, now.toString())
      } else {
        setNotice(foundNotice)
      }
    }
    setLoading(false)
  }, [params.id])

  const handleDelete = () => {
    if (!isAdmin) {
      alert("삭제 권한이 없습니다.")
      return
    }

    if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      const noticeId = parseInt(params.id as string)
      
      // 임시 저장된 공지사항에서 삭제
      const tempNotices = JSON.parse(localStorage.getItem("tempNotices") || "[]")
      const updatedTempNotices = tempNotices.filter((n: any) => n.id !== noticeId)
      localStorage.setItem("tempNotices", JSON.stringify(updatedTempNotices))
      
      alert("공지사항이 삭제되었습니다.")
      router.push("/notices")
    }
  }

  const handleEdit = () => {
    if (!isAdmin) {
      alert("수정 권한이 없습니다.")
      return
    }

    // 수정 페이지로 이동
    const editData = {
      id: notice?.id,
      title: notice?.title,
      content: notice?.content,
      type: notice?.type,
      isImportant: notice?.isImportant
    }
    
    // 수정할 데이터를 localStorage에 임시 저장
    localStorage.setItem("editNoticeData", JSON.stringify(editData))
    router.push(`/notices/edit/${params.id}`)
  }


  const handleAddComment = () => {
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.")
      return
    }

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    if (!user) return

    const comment = {
      id: Date.now(),
      author: user.name,
      grade: user.grade,
      content: newComment.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      postId: parseInt(params.id as string),
      postType: 'notice'
    }

    addComment(comment)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">공지사항을 찾을 수 없습니다.</p>
          <Link href="/notices">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={notice.isImportant ? "destructive" : notice.type === "행사" ? "outline" : "secondary"}
                      className="text-sm"
                    >
                      {notice.type}
                    </Badge>
                    {notice.isImportant && (
                      <Badge variant="destructive" className="text-sm">
                        중요
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{notice.title}</CardTitle>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleEdit}
                    className="gap-2 text-base"
                  >
                    <Edit className="h-5 w-5" />
                    수정
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    onClick={handleDelete}
                    className="gap-2 text-base"
                  >
                    <Trash2 className="h-5 w-5" />
                    삭제
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* 공지사항 정보 */}
            <div className="flex items-center gap-8 text-base text-muted-foreground mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>작성자: {notice.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>작성일: {notice.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>조회수: {notice.views}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>좋아요: {notice.likes || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>댓글: {comments.length}</span>
              </div>
            </div>

            {/* 공지사항 내용 */}
            <div 
              className="prose prose-lg max-w-none text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />

            {/* 댓글 섹션 */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">댓글 ({comments.length})</h3>
              </div>

              {/* 댓글 작성 폼 */}
              {isLoggedIn ? (
                <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user?.name} ({user?.grade})</span>
                  </div>
                  <Textarea
                    placeholder="댓글을 작성해주세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3 text-base"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment} className="gap-2 text-base">
                      <Send className="h-4 w-4" />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-muted-foreground mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      로그인
                    </Button>
                  </Link>
                </div>
              )}

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-base">{comment.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.grade}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
                  </div>
                )}
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex justify-between items-start gap-4">
                {/* 이전 글 */}
                <div className="flex-1">
                  {prevPost ? (
                    <Link href={`/notices/${prevPost.id}`} className="block">
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 text-base text-muted-foreground mb-2">
                          <ChevronLeft className="h-5 w-5" />
                          이전 글
                        </div>
                        <h4 className="text-base font-medium line-clamp-2 text-left">
                          {prevPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 border rounded-lg bg-muted/30 opacity-50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ChevronLeft className="h-4 w-4" />
                        이전 글
                      </div>
                      <p className="text-base text-muted-foreground">이전 글이 없습니다</p>
                    </div>
                  )}
                </div>

                {/* 목록 버튼 */}
                <div className="flex items-center">
                  <Link href="/notices">
                    <Button variant="outline" size="lg" className="text-base">
                      목록
                    </Button>
                  </Link>
                </div>

                {/* 다음 글 */}
                <div className="flex-1">
                  {nextPost ? (
                    <Link href={`/notices/${nextPost.id}`} className="block">
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 text-base text-muted-foreground mb-2 justify-end">
                          다음 글
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <h4 className="text-base font-medium line-clamp-2 text-right">
                          {nextPost.title}
                        </h4>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-4 border rounded-lg bg-muted/30 opacity-50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 justify-end">
                        다음 글
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-base text-muted-foreground text-right">다음 글이 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
