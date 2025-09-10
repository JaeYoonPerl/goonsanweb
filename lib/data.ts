/**
 * 웹사이트에서 사용하는 더미 데이터 및 설정
 * - 공지사항, 커뮤니티 게시글, 캐러셀 이미지 데이터
 * - 소셜 미디어 링크 및 웹사이트 설정
 * - 타입 정의 및 인터페이스 포함
 */

export interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  likes: number
  comments: number
  type: string
  isImportant: boolean
}

export interface Post {
  id: number
  title: string
  content: string
  author: string
  grade: string
  date: string
  views: number
  likes: number
  comments: number
  category: string
}

export const NOTICES: Notice[] = [
  {
    id: 1,
    title: "2024년 정기 총회 개최 안내",
    content: "12월 15일(일) 오후 2시, 모교 강당에서 정기 총회가 개최됩니다. 많은 참석 부탁드립니다.",
    author: "관리자",
    date: "2024.11.28",
    views: 156,
    likes: 23,
    comments: 2,
    type: "중요",
    isImportant: true,
  },
  {
    id: 2,
    title: "장학금 신청 접수 시작",
    content: "2025년도 장학금 신청을 받습니다. 신청 기간: 12월 1일 ~ 12월 31일",
    author: "관리자",
    date: "2024.11.25",
    views: 89,
    likes: 12,
    comments: 0,
    type: "일반",
    isImportant: false,
  },
  {
    id: 3,
    title: "동창회 회비 납부 안내",
    content: "2024년도 동창회 회비 납부를 안내드립니다. 계좌번호: 농협 123-456-789012",
    author: "관리자",
    date: "2024.11.20",
    views: 234,
    likes: 18,
    comments: 1,
    type: "일반",
    isImportant: false,
  },
  {
    id: 4,
    title: "송년회 개최 안내",
    content: "12월 25일 송년회를 개최합니다. 장소: 군산 롯데호텔 2층 연회장",
    author: "관리자",
    date: "2024.11.18",
    views: 178,
    likes: 31,
    comments: 3,
    type: "행사",
    isImportant: false,
  },
]

export const POSTS: Post[] = [
  {
    id: 1,
    title: "85학번 동기회 모임 후기",
    content: "지난 주말 85학번 동기회 모임이 성황리에 마무리되었습니다. 30여 명이 참석해서 즐거운 시간을 보냈습니다.",
    author: "김○○",
    grade: "85학번",
    date: "2024.11.27",
    views: 89,
    likes: 12,
    comments: 5,
    category: "동기회",
  },
  {
    id: 2,
    title: "모교 근황 공유합니다",
    content: "최근 모교를 방문했는데 많은 변화가 있더군요. 새로운 건물도 생기고 운동장도 새롭게 단장되었습니다.",
    author: "이○○",
    grade: "78학번",
    date: "2024.11.26",
    views: 156,
    likes: 18,
    comments: 12,
    category: "모교소식",
  },
  {
    id: 3,
    title: "동창 사업체 소개",
    content: "군산에서 카페를 운영하고 있습니다. 동창분들께 할인 혜택을 드리니 언제든 놀러오세요.",
    author: "박○○",
    grade: "92학번",
    date: "2024.11.25",
    views: 234,
    likes: 25,
    comments: 8,
    category: "사업소개",
  },
  {
    id: 4,
    title: "취업 정보 공유",
    content: "저희 회사에서 신입사원을 모집합니다. 관심 있는 후배들은 연락주세요. 자세한 내용은 개인 메시지로 문의해주세요.",
    author: "최○○",
    grade: "88학번",
    date: "2024.11.24",
    views: 312,
    likes: 31,
    comments: 15,
    category: "취업정보",
  },
]

// 캐러셀 이미지 데이터
export const CAROUSEL_IMAGES = [
  { src: "/dumImg01.jpg", alt: "배너 1" },
  { src: "/dumImg02.jpg", alt: "배너 2" },
  { src: "/dumImg03.jpg", alt: "배너 3" },
]

// 소셜 미디어 링크 데이터
export const SOCIAL_LINKS = [
  {
    name: "페이스북",
    url: "https://www.facebook.com/share/1AwpSz6oma/",
    icon: "Facebook",
    color: "blue",
  },
  {
    name: "유튜브",
    url: "https://m.youtube.com/@gunsango-jo2er",
    icon: "Youtube",
    color: "red",
  },
  {
    name: "구 홈페이지",
    url: "http://www.kunwon.org/",
    icon: "ExternalLink",
    color: "gray",
  },
]

// 설정 상수
export const CONFIG = {
  CAROUSEL_AUTOPLAY_DELAY: 4000,
  DATA_REFRESH_INTERVAL: 30000,
  DISPLAY_ITEMS_COUNT: 4,
} as const
