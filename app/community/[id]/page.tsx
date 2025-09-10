"use client"

/**
 * 동문 커뮤니티 상세 페이지
 * - 개별 게시글의 상세 내용을 표시
 * - 댓글 기능과 좋아요/조회수 표시
 * - 이전/다음 글 네비게이션 기능
 * - 작성자 권한에 따른 수정/삭제 버튼 표시
 */

// 정적 생성용 함수
export async function generateStaticParams() {
  const { POSTS } = await import('@/lib/data')
  return POSTS.map((post) => ({
    id: post.id.toString(),
  }))
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, Heart, MessageCircle, User, Send, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import Header from "@/components/home/header"
import { usePostNavigation } from "@/hooks/use-post-navigation"
import { useComments } from "@/hooks/use-comments"

// 기존 커뮤니티 게시글 더미 데이터
const posts = [
  {
    id: 1,
    title: "85학번 동기회 모임 후기",
    content: `
      <h2>85학번 동기회 모임 후기</h2>
      <p>지난 주말 85학번 동기회 모임이 성황리에 마무리되었습니다.</p>
      
      <h3>📅 모임 일시</h3>
      <p>2024년 11월 23일 (토요일) 오후 6시</p>
      
      <h3>📍 모임 장소</h3>
      <p>군산 시내 한식당 "옛날밥상"</p>
      
      <h3>👥 참석 인원</h3>
      <p>총 30명이 참석하여 즐거운 시간을 보냈습니다.</p>
      
      <h3>🍽️ 모임 내용</h3>
      <ul>
        <li>오후 6시: 등록 및 인사</li>
        <li>오후 7시: 만찬 및 대화</li>
        <li>오후 8시: 각자 근황 공유</li>
        <li>오후 9시: 다음 모임 계획 논의</li>
        <li>오후 10시: 기념사진 촬영 및 마무리</li>
      </ul>
      
      <h3>💬 주요 대화 내용</h3>
      <ul>
        <li>각자의 현재 직장과 가족 상황 공유</li>
        <li>모교 시절 추억 이야기</li>
        <li>자녀들의 교육 문제 토론</li>
        <li>건강 관리 방법 공유</li>
      </ul>
      
      <h3>📸 특별한 순간들</h3>
      <ul>
        <li>30년 만에 만난 동기들의 반가운 얼굴</li>
        <li>옛날 사진들을 보며 추억에 잠긴 순간</li>
        <li>각자의 성공담을 들으며 자랑스러워한 순간</li>
        <li>다음 모임을 기대하며 헤어지는 순간</li>
      </ul>
      
      <h3>🎯 다음 모임 계획</h3>
      <p>다음 모임은 2025년 봄에 가족들과 함께하는 피크닉으로 계획했습니다.</p>
      
      <h3>💝 감사 인사</h3>
      <p>모임 준비에 수고해주신 김○○, 이○○ 동기에게 특별히 감사드립니다.</p>
      
      <p><strong>다음에는 더 많은 동기들이 참석했으면 좋겠네요!</strong></p>
    `,
    author: "김○○",
    grade: "85학번",
    date: "2024.11.27",
    views: 89,
    likes: 12,
    comments: [
      {
        id: 1,
        author: "박○○",
        grade: "85학번",
        content: "정말 즐거운 시간이었습니다! 다음 모임도 기대되네요.",
        date: "2024.11.27",
      },
      {
        id: 2,
        author: "최○○",
        grade: "85학번",
        content: "30년 만에 만난 동기들 반가웠어요. 건강하세요!",
        date: "2024.11.27",
      },
    ],
    category: "동기회",
  },
  {
    id: 2,
    title: "모교 근황 공유합니다",
    content: `
      <h2>모교 근황 공유합니다</h2>
      <p>최근 모교를 방문했는데 많은 변화가 있더군요.</p>
      
      <h3>🏫 새로운 변화들</h3>
      <ul>
        <li><strong>새로운 건물:</strong> 과학관이 새롭게 지어졌습니다</li>
        <li><strong>운동장 개선:</strong> 인조잔디로 교체되어 깔끔해졌습니다</li>
        <li><strong>도서관 확장:</strong> 2층으로 확장되어 더 넓어졌습니다</li>
        <li><strong>카페테리아:</strong> 학생들을 위한 카페가 생겼습니다</li>
      </ul>
      
      <h3>👨‍🏫 교직원 변화</h3>
      <ul>
        <li>새로운 교장선생님 취임</li>
        <li>젊은 교사들이 많이 부임</li>
        <li>기존 선생님들도 건강하게 계시는 모습</li>
      </ul>
      
      <h3>📚 교육 환경</h3>
      <ul>
        <li>스마트 교실로 모든 교실이 개선</li>
        <li>컴퓨터실 시설 현대화</li>
        <li>체육관 시설 개선</li>
        <li>음악실 악기들 새로 구입</li>
      </ul>
      
      <h3>🎓 학생들 모습</h3>
      <p>후배들이 우리 때보다 훨씬 활발하고 자신감 있어 보였습니다.</p>
      <ul>
        <li>동아리 활동이 매우 활발</li>
        <li>학생회 활동도 체계적으로 운영</li>
        <li>스포츠 활동도 열심히 참여</li>
      </ul>
      
      <h3>🌳 학교 주변</h3>
      <ul>
        <li>학교 앞 상가들이 많이 바뀜</li>
        <li>새로운 카페와 식당들이 많이 생김</li>
        <li>교통편도 더 편리해짐</li>
      </ul>
      
      <h3>💭 소감</h3>
      <p>우리 때와는 정말 많이 달라졌지만, 여전히 그곳은 우리의 소중한 추억이 담긴 곳이었습니다.</p>
      <p>후배들이 좋은 환경에서 공부할 수 있어서 기쁘고, 우리 모교가 더욱 발전하는 모습이 자랑스러웠습니다.</p>
      
      <h3>📸 사진</h3>
      <p>새로 지어진 과학관과 개선된 운동장 사진을 첨부했습니다.</p>
      
      <p><strong>다른 동문들도 기회가 되시면 모교를 방문해보세요!</strong></p>
    `,
    author: "이○○",
    grade: "78학번",
    date: "2024.11.26",
    views: 156,
    likes: 18,
    comments: [
      {
        id: 1,
        author: "정○○",
        grade: "78학번",
        content: "정말 많이 변했네요. 저도 한번 가보고 싶습니다.",
        date: "2024.11.26",
      },
      {
        id: 2,
        author: "김○○",
        grade: "80학번",
        content: "과학관이 새로 지어졌다니 대단하네요. 후배들이 부럽습니다.",
        date: "2024.11.26",
      },
    ],
    category: "모교소식",
  },
  {
    id: 3,
    title: "동창 사업체 소개",
    content: `
      <h2>동창 사업체 소개</h2>
      <p>안녕하세요, 92학번 박○○입니다.</p>
      <p>군산에서 카페를 운영하고 있어서 동창분들께 소개드립니다.</p>
      
      <h3>🏪 사업체 정보</h3>
      <ul>
        <li><strong>상호명:</strong> "커피향기"</li>
        <li><strong>업종:</strong> 카페</li>
        <li><strong>주소:</strong> 전북 군산시 ○○구 ○○로 789</li>
        <li><strong>연락처:</strong> 063-XXX-XXXX</li>
        <li><strong>영업시간:</strong> 매일 08:00 ~ 22:00</li>
      </ul>
      
      <h3>☕ 메뉴 소개</h3>
      <ul>
        <li><strong>커피:</strong> 아메리카노, 라떼, 카푸치노, 에스프레소</li>
        <li><strong>논커피:</strong> 녹차라떼, 초코라떼, 과일주스</li>
        <li><strong>디저트:</strong> 케이크, 마카롱, 쿠키</li>
        <li><strong>식사:</strong> 샌드위치, 파스타, 샐러드</li>
      </ul>
      
      <h3>🎁 동창 할인 혜택</h3>
      <p>동창분들께는 특별한 혜택을 드립니다!</p>
      <ul>
        <li><strong>음료 20% 할인</strong></li>
        <li><strong>디저트 10% 할인</strong></li>
        <li><strong>동창임을 말씀해주시면 추가 서비스</strong></li>
      </ul>
      
      <h3>🏢 매장 특징</h3>
      <ul>
        <li>넓고 쾌적한 실내 공간</li>
        <li>무료 Wi-Fi 제공</li>
        <li>콘센트 완비</li>
        <li>주차 공간 확보</li>
        <li>반려동물 동반 가능</li>
      </ul>
      
      <h3>📅 이벤트</h3>
      <ul>
        <li>매주 수요일: 동창의 날 (추가 할인)</li>
        <li>생일자: 생일 케이크 무료 제공</li>
        <li>단체 주문: 10% 추가 할인</li>
      </ul>
      
      <h3>💼 사업 시작 계기</h3>
      <p>회사를 다니다가 커피에 대한 열정이 생겨서 카페를 시작하게 되었습니다.</p>
      <p>군산에서 동창분들과 함께하는 공간을 만들고 싶었습니다.</p>
      
      <h3>📞 문의</h3>
      <p>예약이나 단체 주문은 사전에 연락주세요.</p>
      <p>전화: 063-XXX-XXXX</p>
      <p>카카오톡: @coffee_aroma</p>
      
      <p><strong>많은 동창분들의 방문을 기다리겠습니다!</strong></p>
    `,
    author: "박○○",
    grade: "92학번",
    date: "2024.11.25",
    views: 234,
    likes: 25,
    comments: [
      {
        id: 1,
        author: "최○○",
        grade: "90학번",
        content: "군산에 이런 카페가 있었군요! 다음에 가보겠습니다.",
        date: "2024.11.25",
      },
      {
        id: 2,
        author: "김○○",
        grade: "88학번",
        content: "동창 할인 혜택이 정말 좋네요. 꼭 가보겠습니다!",
        date: "2024.11.25",
      },
    ],
    category: "사업소개",
  },
  {
    id: 4,
    title: "취업 정보 공유",
    content: `
      <h2>취업 정보 공유</h2>
      <p>안녕하세요, 88학번 최○○입니다.</p>
      <p>저희 회사에서 신입사원을 모집하고 있어서 후배들에게 정보를 공유합니다.</p>
      
      <h3>🏢 회사 정보</h3>
      <ul>
        <li><strong>회사명:</strong> (주)테크솔루션</li>
        <li><strong>업종:</strong> IT 소프트웨어 개발</li>
        <li><strong>주소:</strong> 서울시 강남구 ○○로 123</li>
        <li><strong>규모:</strong> 중소기업 (직원 50명)</li>
      </ul>
      
      <h3>💼 모집 직무</h3>
      <ul>
        <li><strong>신입 개발자</strong> (2명)</li>
        <li><strong>경력:</strong> 무관 (신입 우대)</li>
        <li><strong>학력:</strong> 대졸 이상</li>
        <li><strong>전공:</strong> 컴퓨터공학, 정보통신공학 등 IT 관련 전공</li>
      </ul>
      
      <h3>🛠️ 필요 기술</h3>
      <ul>
        <li><strong>언어:</strong> Java, Python, JavaScript</li>
        <li><strong>프레임워크:</strong> Spring, React, Django</li>
        <li><strong>데이터베이스:</strong> MySQL, PostgreSQL</li>
        <li><strong>기타:</strong> Git, Docker, AWS</li>
        <li><strong>우대사항:</strong> 프로젝트 경험, 자격증</li>
      </ul>
      
      <h3>💰 복리후생</h3>
      <ul>
        <li><strong>연봉:</strong> 3,000만원 ~ 3,500만원</li>
        <li><strong>근무시간:</strong> 09:00 ~ 18:00 (유연근무제)</li>
        <li><strong>휴가:</strong> 연차 15일, 반차 제도</li>
        <li><strong>보험:</strong> 4대보험, 퇴직연금</li>
        <li><strong>교육:</strong> 교육비 지원, 컨퍼런스 참가 지원</li>
        <li><strong>기타:</strong> 점심식대, 교통비, 야근수당</li>
      </ul>
      
      <h3>📅 지원 일정</h3>
      <ul>
        <li><strong>접수기간:</strong> 2024년 12월 1일 ~ 12월 31일</li>
        <li><strong>서류전형:</strong> 2025년 1월 5일</li>
        <li><strong>1차 면접:</strong> 2025년 1월 10일</li>
        <li><strong>2차 면접:</strong> 2025년 1월 15일</li>
        <li><strong>최종 발표:</strong> 2025년 1월 20일</li>
      </ul>
      
      <h3>📋 지원 방법</h3>
      <ol>
        <li>이력서 및 자기소개서 작성</li>
        <li>포트폴리오 준비 (프로젝트 경험)</li>
        <li>회사 이메일로 제출: hr@techsolution.co.kr</li>
        <li>제목: "[신입채용] 성명_학번"</li>
      </ol>
      
      <h3>💡 면접 팁</h3>
      <ul>
        <li>기술 면접: 코딩 테스트, 알고리즘 문제</li>
        <li>인성 면접: 팀워크, 커뮤니케이션 능력</li>
        <li>프로젝트 경험에 대해 자세히 설명할 수 있도록 준비</li>
        <li>회사에 대한 이해도와 관심을 보여주세요</li>
      </ul>
      
      <h3>📞 문의</h3>
      <p>궁금한 점이 있으시면 언제든 연락주세요.</p>
      <p>이메일: choi@techsolution.co.kr</p>
      <p>전화: 02-XXX-XXXX (내선: 123)</p>
      
      <h3>🎯 동창 우대</h3>
      <p>동창분들은 서류전형에서 가산점을 받을 수 있습니다!</p>
      
      <p><strong>많은 후배들의 지원을 기다리겠습니다!</strong></p>
    `,
    author: "최○○",
    grade: "88학번",
    date: "2024.11.24",
    views: 312,
    likes: 31,
    comments: [
      {
        id: 1,
        author: "김○○",
        grade: "90학번",
        content: "정말 좋은 기회네요! 지원해보겠습니다.",
        date: "2024.11.24",
      },
      {
        id: 2,
        author: "이○○",
        grade: "92학번",
        content: "동창 우대가 있다니 더욱 좋네요. 꼭 지원하겠습니다!",
        date: "2024.11.24",
      },
    ],
    category: "취업정보",
  },
  {
    id: 5,
    title: "동창회 골프 모임 제안",
    content: `
      <h2>동창회 골프 모임 제안</h2>
      <p>안녕하세요, 82학번 정○○입니다.</p>
      <p>정기적으로 골프 모임을 가져보면 어떨까 해서 제안드립니다.</p>
      
      <h3>🏌️ 모임 목적</h3>
      <ul>
        <li>동창들과의 친목 도모</li>
        <li>건강한 여가 활동</li>
        <li>비즈니스 네트워킹</li>
        <li>골프 실력 향상</li>
      </ul>
      
      <h3>📅 모임 계획</h3>
      <ul>
        <li><strong>빈도:</strong> 월 1회 (둘째 주 토요일)</li>
        <li><strong>시간:</strong> 오전 7시 티오프</li>
        <li><strong>장소:</strong> 군산 골프클럽 (회전제)</li>
        <li><strong>인원:</strong> 20명 내외</li>
      </ul>
      
      <h3>💰 비용</h3>
      <ul>
        <li><strong>골프장 이용료:</strong> 8만원 (동창 할인 적용)</li>
        <li><strong>카트비:</strong> 2만원</li>
        <li><strong>점심식사:</strong> 1만원</li>
        <li><strong>총 비용:</strong> 11만원</li>
      </ul>
      
      <h3>🎯 참가 대상</h3>
      <ul>
        <li>골프를 즐기는 모든 동창</li>
        <li>초보자도 환영 (레슨 가능)</li>
        <li>연령 제한 없음</li>
        <li>남녀 모두 참가 가능</li>
      </ul>
      
      <h3>🏆 대회 형식</h3>
      <ul>
        <li><strong>개인전:</strong> 넷 스코어</li>
        <li><strong>팀전:</strong> 4인 1조 스크램블</li>
        <li><strong>상금:</strong> 1등 10만원, 2등 5만원, 3등 3만원</li>
        <li><strong>특별상:</strong> 최장타, 최단타, 파상</li>
      </ul>
      
      <h3>📋 운영 방식</h3>
      <ol>
        <li>매월 첫째 주: 참가 신청 접수</li>
        <li>둘째 주: 조 편성 및 안내</li>
        <li>셋째 주: 골프 모임 진행</li>
        <li>넷째 주: 결과 발표 및 다음 모임 안내</li>
      </ol>
      
      <h3>🎁 특별 혜택</h3>
      <ul>
        <li>골프장 회원권 할인</li>
        <li>골프용품 할인</li>
        <li>레슨비 할인</li>
        <li>골프 여행 할인</li>
      </ul>
      
      <h3>📞 참가 신청</h3>
      <p>관심 있는 분들은 댓글로 의견을 남겨주세요.</p>
      <p>구체적인 일정과 규칙은 참가자들과 상의해서 결정하겠습니다.</p>
      
      <h3>💭 기대 효과</h3>
      <ul>
        <li>정기적인 동창 모임으로 친목 증진</li>
        <li>건강한 운동과 스트레스 해소</li>
        <li>비즈니스 기회 창출</li>
        <li>골프 실력 향상</li>
      </ul>
      
      <p><strong>많은 동창분들의 참여를 기다리겠습니다!</strong></p>
    `,
    author: "정○○",
    grade: "82학번",
    date: "2024.11.23",
    views: 178,
    likes: 14,
    comments: [
      {
        id: 1,
        author: "박○○",
        grade: "80학번",
        content: "정말 좋은 아이디어네요! 저도 참가하고 싶습니다.",
        date: "2024.11.23",
      },
      {
        id: 2,
        author: "김○○",
        grade: "85학번",
        content: "골프 초보인데 괜찮을까요? 레슨도 받을 수 있나요?",
        date: "2024.11.23",
      },
    ],
    category: "모임제안",
  },
]

export default function CommunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const { user, isLoggedIn, isAdmin } = useAuth()
  const [isTempPost, setIsTempPost] = useState(false)
  
  // 이전글/다음글 네비게이션
  const { prevPost, nextPost } = usePostNavigation(parseInt(params.id as string), 'post')
  
  // 댓글 관리
  const { comments, newComment, setNewComment, addComment } = useComments(parseInt(params.id as string), 'post')

  useEffect(() => {
    const postId = parseInt(params.id as string)
    
    // 임시 저장된 게시글들 로드
    const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
    
    // 모든 게시글 합치기 (임시 + 기존)
    const allPosts = [...tempPosts, ...posts]
    
    // 해당 ID의 게시글 찾기
    const foundPost = allPosts.find((p: any) => p.id === postId)
    
    if (foundPost) {
      // 조회수 업데이트
      const viewKey = `post_view_${postId}`
      const lastViewTime = localStorage.getItem(viewKey)
      const now = Date.now()
      
      // 24시간(86400000ms) 내에 다시 방문한 경우 조회수 증가하지 않음
      if (!lastViewTime || (now - parseInt(lastViewTime)) > 86400000) {
        const updatedPost = { ...foundPost }
        
        // 임시 게시글인 경우
        if (tempPosts.find((p: any) => p.id === postId)) {
          updatedPost.views += 1
          const updatedTempPosts = tempPosts.map((p: any) => 
            p.id === postId ? updatedPost : p
          )
          localStorage.setItem("tempPosts", JSON.stringify(updatedTempPosts))
        } else {
          // 기존 게시글인 경우 (실제로는 백엔드에서 처리해야 함)
          updatedPost.views += 1
        }
        
        setPost(updatedPost)
        localStorage.setItem(viewKey, now.toString())
      } else {
        setPost(foundPost)
      }

      // 소유권/임시글 여부 저장
      const isTemp = tempPosts.some((p: any) => p.id === postId)
      setIsTempPost(isTemp)
    }
    setLoading(false)
  }, [params.id])

  const handleLike = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.")
      return
    }
    setIsLiked(!isLiked)
    // 실제로는 API 호출하여 좋아요 처리
  }

  const handleComment = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.")
      return
    }
    
    const comment = {
      id: Date.now(),
      author: user?.name || "사용자",
      grade: user?.grade || "학번",
      content: newComment.trim(),
      date: new Date().toLocaleDateString("ko-KR"),
      postId: parseInt(params.id as string),
      postType: 'post'
    }
    
    addComment(comment)
  }

  const handleDelete = () => {
    const isOwner = isLoggedIn && post && user && post.author === user.name && post.grade === user.grade
    const canDelete = isAdmin || (isOwner && isTempPost)
    if (!canDelete) {
      alert("삭제 권한이 없습니다.")
      return
    }

    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      const postId = parseInt(params.id as string)
      
      // 임시 저장된 게시글에서 삭제
      const tempPosts = JSON.parse(localStorage.getItem("tempPosts") || "[]")
      const updatedTempPosts = tempPosts.filter((p: any) => p.id !== postId)
      localStorage.setItem("tempPosts", JSON.stringify(updatedTempPosts))
      
      alert("게시글이 삭제되었습니다.")
      router.push("/community")
    }
  }

  const handleEdit = () => {
    const isOwner = isLoggedIn && post && user && post.author === user.name && post.grade === user.grade
    const canEdit = isAdmin || (isOwner && isTempPost)
    if (!canEdit) {
      alert("수정 권한이 없습니다.")
      return
    }

    // 수정 페이지로 이동 (현재 게시글 데이터를 쿼리 파라미터로 전달)
    const editData = {
      id: post?.id,
      title: post?.title,
      content: post?.content,
      category: post?.category
    }
    
    // 수정할 데이터를 localStorage에 임시 저장
    localStorage.setItem("editPostData", JSON.stringify(editData))
    router.push(`/community/edit/${params.id}`)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">게시글을 찾을 수 없습니다.</p>
          <Link href="/community">
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
                    <Badge variant="outline" className="text-sm">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                </div>
              </div>
              <div className="flex gap-2">
                {(isAdmin || (isLoggedIn && post && user && isTempPost && post.author === user.name && post.grade === user.grade)) && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 게시글 정보 */}
            <div className="flex items-center gap-8 text-base text-muted-foreground mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>작성자: {post.author} ({post.grade})</span>
              </div>
              <div className="flex items-center gap-2">
                <span>작성일: {post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>조회수: {post.views}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>좋아요: {post.likes || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>댓글: {comments.length}</span>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div 
              className="prose prose-lg max-w-none mb-10 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 좋아요 버튼 */}
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="lg"
                onClick={handleLike}
                className="gap-2 text-base"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                좋아요 {post.likes + (isLiked ? 1 : 0)}
              </Button>
            </div>

            {/* 댓글 섹션 */}
            <div className="space-y-8">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                댓글 ({comments.length}개)
              </h3>

              {/* 댓글 작성 */}
              {isLoggedIn && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="text-base"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleComment} className="gap-2 text-base" size="lg">
                      <Send className="h-5 w-5" />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              )}

              {/* 댓글 목록 */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-6 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-base">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">({comment.grade})</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-base">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex justify-between items-start gap-4">
                {/* 이전 글 */}
                <div className="flex-1">
                  {prevPost ? (
                    <Link href={`/community/${prevPost.id}`} className="block">
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
                  <Link href="/community">
                    <Button variant="outline" size="lg" className="text-base">
                      목록
                    </Button>
                  </Link>
                </div>

                {/* 다음 글 */}
                <div className="flex-1">
                  {nextPost ? (
                    <Link href={`/community/${nextPost.id}`} className="block">
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
