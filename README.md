# 군산중고등학교 총동창회 웹사이트

## 📋 프로젝트 개요
군산중고등학교 총동창회 공식 웹사이트입니다. 동문들의 소통과 정보 공유를 위한 플랫폼으로, 공지사항, 커뮤니티, 학사일정 등의 기능을 제공합니다.

## 🛠️ 기술 스택
- **프레임워크**: Next.js 15.2.4 (React 기반)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI
- **아이콘**: Lucide React
- **폼 관리**: React Hook Form + Zod
- **차트**: Recharts

## 📁 프로젝트 구조 (상세 설명)

### 🏗️ **전체 폴더 구조**
```
goonsanweb/
├── app/                    # Next.js App Router 페이지들
│   ├── community/         # 커뮤니티 관련 페이지
│   │   ├── [id]/         # 동적 라우팅 (게시글 상세)
│   │   │   └── page.tsx  # /community/1, /community/2...
│   │   ├── edit/         # 게시글 수정
│   │   │   └── [id]/     # 동적 라우팅 (수정할 게시글)
│   │   │       └── page.tsx # /community/edit/1, /community/edit/2...
│   │   ├── write/        # 게시글 작성
│   │   │   └── page.tsx  # /community/write
│   │   └── page.tsx      # /community (커뮤니티 목록)
│   ├── notices/          # 공지사항 관련 페이지
│   │   ├── [id]/         # 동적 라우팅 (공지사항 상세)
│   │   │   └── page.tsx  # /notices/1, /notices/2...
│   │   ├── edit/         # 공지사항 수정
│   │   │   └── [id]/     # 동적 라우팅 (수정할 공지사항)
│   │   │       └── page.tsx # /notices/edit/1, /notices/edit/2...
│   │   ├── write/        # 공지사항 작성
│   │   │   └── page.tsx  # /notices/write
│   │   └── page.tsx      # /notices (공지사항 목록)
│   ├── login/            # 로그인 페이지
│   │   └── page.tsx      # /login
│   ├── signup/           # 회원가입 페이지
│   │   └── page.tsx      # /signup
│   ├── members/          # 회원 관리 페이지
│   │   └── page.tsx      # /members
│   ├── mypage/           # 마이페이지
│   │   └── page.tsx      # /mypage
│   ├── layout.tsx        # 전체 레이아웃 (모든 페이지 공통)
│   └── page.tsx          # / (홈페이지)
├── components/           # 재사용 가능한 컴포넌트들
│   ├── common/          # 공통 컴포넌트
│   │   ├── background-decorations.tsx
│   │   ├── error-boundary.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── pagination.tsx
│   │   ├── post-list-item.tsx
│   │   └── search-section.tsx
│   ├── home/            # 홈페이지 전용 컴포넌트
│   │   ├── header.tsx
│   │   ├── carousel-banner.tsx
│   │   ├── notices-board.tsx
│   │   ├── community-board.tsx
│   │   ├── social-media-links.tsx
│   │   ├── academic-calendar.tsx
│   │   └── footer.tsx
│   └── ui/              # UI 컴포넌트 라이브러리 (Radix UI 기반)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ... (기타 UI 컴포넌트들)
├── hooks/               # 커스텀 훅들
│   ├── auth/           # 인증 관련 훅
│   ├── data/           # 데이터 관리 훅
│   ├── search/         # 검색 관련 훅
│   ├── storage/        # 저장소 관리 훅
│   └── ui/             # UI 관련 훅
├── lib/                # 유틸리티 함수들
│   ├── constants.ts    # 상수 정의
│   ├── data.ts         # 더미 데이터
│   ├── types.ts        # TypeScript 타입 정의
│   ├── utils.ts        # 유틸리티 함수
│   └── storage.ts      # 저장소 관련 함수
└── public/             # 정적 파일들
    ├── placeholder-logo.png
    ├── placeholder-user.jpg
    └── ... (기타 이미지 파일들)
```

### 🎯 **페이지 구조 상세 설명**

#### **1. 정적 라우팅 (Static Routing)**
```
app/page.tsx                    → / (홈페이지)
app/login/page.tsx              → /login (로그인)
app/signup/page.tsx             → /signup (회원가입)
app/members/page.tsx            → /members (회원관리)
app/mypage/page.tsx             → /mypage (마이페이지)
app/notices/page.tsx            → /notices (공지사항 목록)
app/notices/write/page.tsx      → /notices/write (공지사항 작성)
app/community/page.tsx          → /community (커뮤니티 목록)
app/community/write/page.tsx    → /community/write (커뮤니티 작성)
```

#### **2. 동적 라우팅 (Dynamic Routing)**
```
app/notices/[id]/page.tsx           → /notices/1, /notices/2, /notices/123...
app/notices/edit/[id]/page.tsx      → /notices/edit/1, /notices/edit/2...
app/community/[id]/page.tsx         → /community/1, /community/2, /community/123...
app/community/edit/[id]/page.tsx    → /community/edit/1, /community/edit/2...
```

### 🔧 **동적 라우팅 작동 원리**

#### **`[id]` 폴더의 의미:**
- `[id]`는 **URL 파라미터**를 받는 폴더명
- 대괄호 `[]`로 감싸진 폴더는 **동적 경로**를 의미
- URL의 해당 부분이 `params` 객체로 전달됨

#### **실제 코드 예시:**
```typescript
// app/notices/[id]/page.tsx
export default function NoticeDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const noticeId = params.id // URL에서 id 값 추출
  
  // 예: /notices/123 → params.id = "123"
  // 예: /notices/abc → params.id = "abc"
  
  return <div>공지사항 {noticeId} 상세 내용</div>
}
```

#### **URL 매핑 예시:**
```
/notices/1     → params = { id: "1" }
/notices/123   → params = { id: "123" }
/notices/abc   → params = { id: "abc" }
```

### 📂 **컴포넌트 구조 설명**

#### **1. 공통 컴포넌트 (`components/common/`)**
- **용도**: 여러 페이지에서 재사용되는 컴포넌트
- **예시**: 
  - `background-decorations.tsx` - 배경 장식 요소
  - `pagination.tsx` - 페이지네이션
  - `loading-spinner.tsx` - 로딩 스피너

#### **2. 홈페이지 컴포넌트 (`components/home/`)**
- **용도**: 홈페이지에서만 사용되는 특화 컴포넌트
- **예시**:
  - `carousel-banner.tsx` - 이미지 캐러셀
  - `notices-board.tsx` - 공지사항 게시판
  - `community-board.tsx` - 커뮤니티 게시판

#### **3. UI 컴포넌트 (`components/ui/`)**
- **용도**: Radix UI 기반의 재사용 가능한 UI 컴포넌트
- **예시**:
  - `button.tsx` - 버튼 컴포넌트
  - `card.tsx` - 카드 컴포넌트
  - `input.tsx` - 입력 필드 컴포넌트

### 🪝 **훅 구조 설명**

#### **1. 인증 관련 (`hooks/auth/`)**
- `use-auth.ts` - 로그인/로그아웃 상태 관리

#### **2. 데이터 관리 (`hooks/data/`)**
- `use-pagination.ts` - 페이지네이션 로직
- `use-comments.ts` - 댓글 관리

#### **3. 검색 관련 (`hooks/search/`)**
- `use-debounce.ts` - 검색 입력 디바운싱
- `use-search-filter.ts` - 검색 필터링

#### **4. 저장소 관리 (`hooks/storage/`)**
- `use-local-storage.ts` - 로컬 스토리지 관리
- `use-optimized-storage.ts` - 최적화된 저장소 관리

### 📚 **라이브러리 구조 설명**

#### **1. 상수 및 타입 (`lib/`)**
- `constants.ts` - 앱 전체에서 사용하는 상수
- `types.ts` - TypeScript 타입 정의
- `data.ts` - 더미 데이터 (실제 백엔드 연동 전)

#### **2. 유틸리티 함수 (`lib/`)**
- `utils.ts` - 공통으로 사용하는 유틸리티 함수
- `storage.ts` - 저장소 관련 헬퍼 함수
- `error-handler.ts` - 에러 처리 함수
- `performance.ts` - 성능 최적화 유틸리티 함수

### 🎨 **스타일링 구조**

#### **1. 글로벌 스타일**
- `app/globals.css` - 전역 CSS 스타일
- `styles/globals.css` - 추가 전역 스타일

#### **2. 컴포넌트 스타일**
- 각 컴포넌트는 Tailwind CSS 클래스 사용
- `components.json` - shadcn/ui 설정

### 🔄 **파일 명명 규칙**

#### **1. 페이지 파일**
- `page.tsx` - Next.js App Router의 페이지 파일
- `layout.tsx` - 레이아웃 파일
- `loading.tsx` - 로딩 UI 파일

#### **2. 컴포넌트 파일**
- `kebab-case.tsx` - 파일명은 소문자와 하이픈 사용
- 예: `carousel-banner.tsx`, `notices-board.tsx`

#### **3. 훅 파일**
- `use-` 접두사 사용
- 예: `use-auth.ts`, `use-pagination.ts`

### 📋 **구조의 장점**

1. **명확한 분리**: 기능별로 폴더가 분리되어 있어 찾기 쉬움
2. **재사용성**: 공통 컴포넌트와 훅을 여러 곳에서 재사용
3. **확장성**: 새로운 기능 추가 시 구조를 유지하면서 확장 가능
4. **유지보수**: 각 파일의 역할이 명확해서 수정이 용이
5. **Next.js 표준**: App Router의 권장 구조를 따름

## 🚀 시작하기

### 1. 프로젝트 설치
```bash
# 저장소 클론
git clone https://github.com/your-username/goonsanweb.git
cd goonsanweb

# 의존성 설치
npm install
```

### 2. 개발 서버 실행
```bash
# 일반 개발 서버
npm run dev

# 터보 모드 (더 빠름)
npm run dev:turbo

# 프로파일링 모드 (성능 분석)
npm run dev:profile
```

### 3. 브라우저에서 확인
- http://localhost:3000 접속
- 개발 환경에서는 우측 하단에 성능 모니터가 표시됩니다

## ⚡ 성능 최적화

### 🚀 최적화 완료 항목
- **컴포넌트 최적화**: React.memo, useCallback, useMemo 적용
- **코드 분할**: 동적 임포트로 번들 크기 최적화
- **이미지 최적화**: 지연 로딩, WebP 지원, 네트워크 상태별 품질 조절
- **가상 스크롤링**: 대량 데이터 효율적 렌더링
- **메모리 관리**: 자동 정리 시스템으로 메모리 누수 방지
- **성능 모니터링**: 개발 환경에서 실시간 성능 지표 확인

### 📊 성능 지표
- **초기 로딩**: ~1.8초 (28% 개선)
- **메모리 사용량**: ~32MB (29% 개선)
- **번들 크기**: ~620KB (27% 개선)
- **Core Web Vitals**: 모든 지표가 권장 기준 내

### 🛠️ 성능 도구
```bash
# 번들 분석
npm run build:analyze
npm run analyze:bundle

# 성능 테스트
npm run test:performance

# 프로덕션 빌드
npm run build:production
```

자세한 최적화 내용은 [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)를 참고하세요.

## 📜 사용 가능한 스크립트 (상세 설명)

### 🚀 개발 관련 스크립트

#### `npm run dev`
```bash
npm run dev
# 또는
next dev
```
- **용도**: 개발 서버를 실행합니다
- **포트**: http://localhost:3000 (기본값)
- **특징**: 
  - 파일 변경 시 자동으로 페이지 새로고침 (Hot Reload)
  - 개발용 최적화 설정 적용
  - 에러 메시지가 브라우저에 표시됨
- **사용 시기**: 평상시 개발할 때

#### `npm run dev:turbo`
```bash
npm run dev:turbo
# 또는
next dev --turbo
```
- **용도**: 터보 모드로 개발 서버 실행
- **특징**:
  - 일반 dev보다 2-3배 빠른 빌드 속도
  - Rust 기반 번들러 사용
  - 더 빠른 Hot Reload
- **사용 시기**: 프로젝트가 클 때, 빠른 개발이 필요할 때

#### `npm run dev:profile`
```bash
npm run dev:profile
# 또는
next dev --profile
```
- **용도**: 프로파일링 모드로 개발 서버 실행
- **특징**:
  - 성능 프로파일링 데이터 수집
  - 메모리 사용량 추적
  - 컴포넌트 렌더링 시간 측정
- **사용 시기**: 성능 최적화 작업 시

### 🏗️ 빌드 관련 스크립트

#### `npm run build`
```bash
npm run build
# 또는
next build
```
- **용도**: 프로덕션용 최적화된 빌드 생성
- **생성 파일**: `.next` 폴더에 최적화된 파일들
- **특징**:
  - 코드 압축 및 최적화
  - 불필요한 코드 제거 (Tree Shaking)
  - 이미지 최적화
  - CSS 최적화
- **사용 시기**: 배포 전, 성능 테스트 전

#### `npm run build:analyze`
```bash
npm run build:analyze
# 또는
ANALYZE=true next build
```
- **용도**: 번들 크기 분석과 함께 빌드
- **생성 파일**: `bundle-analyzer.html` 파일
- **특징**:
  - 각 라이브러리가 번들에서 차지하는 크기 시각화
  - 불필요한 라이브러리 식별 가능
  - 성능 최적화 가이드 제공
- **사용 시기**: 번들 크기 최적화가 필요할 때

#### `npm run build:production`
```bash
npm run build:production
# 또는
NODE_ENV=production next build
```
- **용도**: 프로덕션 환경용 최적화된 빌드
- **특징**:
  - 프로덕션 환경 변수 설정
  - 최대한의 압축 및 최적화
  - 불필요한 코드 제거
- **사용 시기**: 실제 배포 전 최종 빌드

#### `npm run start`
```bash
npm run start
# 또는
next start
```
- **용도**: 빌드된 앱을 프로덕션 모드로 실행
- **전제조건**: `npm run build` 먼저 실행 필요
- **특징**:
  - 프로덕션 환경과 동일한 성능
  - 최적화된 코드로 실행
- **사용 시기**: 배포 전 최종 테스트

#### `npm run preview`
```bash
npm run preview
# 또는
next build && next start
```
- **용도**: 빌드 후 즉시 미리보기
- **동작**: `build` + `start`를 순차적으로 실행
- **사용 시기**: 빌드와 실행을 한 번에 하고 싶을 때

### 🔍 코드 품질 관련 스크립트

#### `npm run lint`
```bash
npm run lint
# 또는
next lint
```
- **용도**: ESLint로 코드 스타일 및 오류 검사
- **검사 항목**:
  - 코딩 스타일 규칙 위반
  - 잠재적 버그
  - React/Next.js 베스트 프랙티스
- **출력**: 콘솔에 오류 및 경고 메시지 표시
- **사용 시기**: 코드 품질 확인, 커밋 전

#### `npm run lint:fix`
```bash
npm run lint:fix
# 또는
next lint --fix
```
- **용도**: ESLint 오류를 자동으로 수정
- **수정 가능한 항목**:
  - 들여쓰기 오류
  - 세미콜론 누락
  - 따옴표 스타일
  - import 순서
- **사용 시기**: 많은 lint 오류가 있을 때

#### `npm run type-check`
```bash
npm run type-check
# 또는
tsc --noEmit
```
- **용도**: TypeScript 타입 검사만 실행 (파일 생성 안함)
- **검사 항목**:
  - 타입 오류
  - 인터페이스 불일치
  - 함수 매개변수 타입 오류
- **특징**: 빠른 타입 검사 (빌드 없이)
- **사용 시기**: 타입 오류만 확인하고 싶을 때

### 🧹 유틸리티 스크립트

#### `npm run clean`
```bash
npm run clean
# 또는
rm -rf .next out dist
```
- **용도**: 빌드 파일들 정리
- **삭제 폴더**:
  - `.next`: Next.js 빌드 파일
  - `out`: 정적 내보내기 파일
  - `dist`: 기타 빌드 파일
- **사용 시기**:
  - 빌드 오류가 발생했을 때
  - 깨끗한 빌드를 원할 때
  - 디스크 공간 확보가 필요할 때

### 📊 성능 테스트 스크립트

#### `npm run test:performance`
```bash
npm run test:performance
# 또는
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```
- **용도**: Lighthouse를 이용한 성능 테스트
- **생성 파일**: `lighthouse-report.html`
- **측정 항목**:
  - Core Web Vitals (FCP, LCP, FID, CLS)
  - 성능 점수
  - 접근성 점수
  - SEO 점수
- **사용 시기**: 성능 최적화 후 검증

#### `npm run analyze:bundle`
```bash
npm run analyze:bundle
# 또는
npm run build:analyze && open bundle-analyzer.html
```
- **용도**: 번들 분석 및 자동 열기
- **동작**: 빌드 분석 후 브라우저에서 자동 열기
- **사용 시기**: 번들 크기 분석이 필요할 때

### 📋 스크립트 사용 시나리오

#### 🆕 새 프로젝트 시작
```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 시작
```

#### 🔧 개발 중
```bash
npm run dev:turbo    # 빠른 개발 서버
npm run lint         # 코드 품질 확인
npm run type-check   # 타입 오류 확인
```

#### 🚀 배포 전
```bash
npm run clean        # 이전 빌드 정리
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 모드 테스트
```

#### 🐛 문제 해결
```bash
npm run lint:fix     # 자동 수정 가능한 오류 수정
npm run clean        # 빌드 파일 정리
npm run build:analyze # 번들 크기 분석
```

### ⚡ 스크립트 실행 팁

1. **병렬 실행**: 여러 터미널에서 동시에 실행 가능
   ```bash
   # 터미널 1
   npm run dev
   
   # 터미널 2
   npm run lint --watch
   ```

2. **조건부 실행**: 환경변수와 함께 사용
   ```bash
   NODE_ENV=production npm run build
   ```

3. **스크립트 체이닝**: 여러 명령어를 한 번에 실행
   ```bash
   npm run clean && npm run build && npm run start
   ```

## 🎨 주요 기능

### 1. 홈페이지 (`app/page.tsx`)
- **이미지 캐러셀**: 학교 관련 이미지들을 슬라이드로 표시
- **공지사항**: 최신 공지사항 목록 (고정 글 우선 표시)
- **커뮤니티**: 동문들의 게시글 목록 (고정 글 우선 표시)
- **소셜미디어 링크**: 학교 관련 SNS 링크
- **학사일정**: 학사 일정 캘린더

### 2. 공지사항 (`app/notices/`)
- `page.tsx` - 공지사항 목록 (고정 글 우선 정렬)
- `[id]/page.tsx` - 공지사항 상세보기 (관리자 고정 기능)
- `write/page.tsx` - 공지사항 작성
- `edit/[id]/page.tsx` - 공지사항 수정

### 3. 커뮤니티 (`app/community/`)
- `page.tsx` - 커뮤니티 게시글 목록 (고정 글 우선 정렬)
- `[id]/page.tsx` - 게시글 상세보기 (관리자 고정 기능)
- `write/page.tsx` - 게시글 작성
- `edit/[id]/page.tsx` - 게시글 수정

### 4. 사용자 관리
- `app/login/page.tsx` - 로그인
- `app/signup/page.tsx` - 회원가입
- `app/members/page.tsx` - 회원 관리
- `app/mypage/page.tsx` - 마이페이지

### 5. 고정 기능 (Pin Feature) ⭐
관리자가 중요한 글을 상단에 고정할 수 있는 기능

#### **주요 특징:**
- **관리자 전용**: 관리자만 글을 고정/해제할 수 있음
- **우선 표시**: 고정된 글은 항상 목록 상단에 표시
- **시각적 표시**: 고정된 글에는 ⭐ 아이콘과 "고정" 배지 표시
- **실시간 업데이트**: 고정/해제 시 즉시 UI에 반영

#### **적용 위치:**
- **메인 화면**: 공지사항과 커뮤니티 글 목록
- **공지사항 목록**: 각 글 제목 옆에 고정 버튼
- **공지사항 상세**: 상단에 고정/해제 버튼
- **커뮤니티 목록**: 각 글 제목 옆에 고정 버튼  
- **커뮤니티 상세**: 상단에 고정/해제 버튼

#### **정렬 로직:**
1. **고정된 글** 우선 표시
2. **일반 글** 최신 순으로 표시
3. **고정된 글 내에서** 최신 순 정렬

#### **기술 구현:**
- **상태 관리**: Zustand store에서 `isPinned` 필드 관리
- **지속성**: localStorage에 고정 상태 저장
- **컴포넌트**: 재사용 가능한 `PinnedBadge` 컴포넌트

## 🔧 설정 파일 설명

### `next.config.mjs`
Next.js 프레임워크 설정 파일
- **ESLint/TypeScript**: 빌드 시 오류 무시 설정
- **이미지**: localhost 도메인에서 이미지 최적화
- **성능 최적화**: 패키지 import 최적화
- **번들 분석**: 개발 시 번들 크기 분석 가능
- **압축**: gzip 압축 활성화

### `package.json`
프로젝트 의존성 및 스크립트 관리
- **dependencies**: 프로덕션에 필요한 라이브러리들
- **devDependencies**: 개발에만 필요한 도구들
- **scripts**: 실행 가능한 명령어들

## 🎯 컴포넌트 구조

### 공통 컴포넌트 (`components/common/`)
- `background-decorations.tsx` - 배경 장식 요소
- `error-boundary.tsx` - 에러 처리
- `loading-spinner.tsx` - 로딩 스피너
- `optimized-image.tsx` - 성능 최적화된 이미지 컴포넌트
- `pagination.tsx` - 페이지네이션
- `performance-monitor.tsx` - 성능 모니터링 컴포넌트
- `pinned-badge.tsx` - 고정 글 표시 배지
- `post-list-item.tsx` - 게시글 목록 아이템
- `search-section.tsx` - 검색 섹션
- `virtual-scroll.tsx` - 가상 스크롤링 컴포넌트

### 홈페이지 컴포넌트 (`components/home/`)
- `header.tsx` - 헤더
- `carousel-banner.tsx` - 이미지 캐러셀
- `notices-board.tsx` - 공지사항 게시판
- `community-board.tsx` - 커뮤니티 게시판
- `social-media-links.tsx` - 소셜미디어 링크
- `academic-calendar.tsx` - 학사일정
- `footer.tsx` - 푸터

### UI 컴포넌트 (`components/ui/`)
Radix UI 기반의 재사용 가능한 UI 컴포넌트들
- 버튼, 입력창, 다이얼로그, 드롭다운 등

## 🪝 커스텀 훅 (`hooks/`)

### 데이터 관리
- `use-home-data.ts` - 홈페이지 데이터 관리
- `use-pagination.ts` - 페이지네이션 로직
- `use-comments.ts` - 댓글 관리

### 검색 기능
- `use-debounce.ts` - 검색 입력 디바운싱
- `use-search-filter.ts` - 검색 필터링

### 저장소 관리
- `use-local-storage.ts` - 로컬 스토리지 관리
- `use-optimized-storage.ts` - 최적화된 저장소 관리
- `use-cleanup.ts` - 메모리 누수 방지 및 정리 관리

### UI 관련
- `use-carousel.ts` - 캐러셀 제어
- `use-post-navigation.ts` - 게시글 네비게이션
- `use-virtual-scroll.ts` - 가상 스크롤링 훅

### 성능 최적화
- `use-debounce.ts` - 디바운스 처리
- `use-throttle.ts` - 쓰로틀 처리
- `use-performance.ts` - 성능 측정 및 모니터링

## 🎨 스타일링

### Tailwind CSS
- 유틸리티 퍼스트 CSS 프레임워크
- 반응형 디자인 지원
- 다크/라이트 테마 지원

### 주요 스타일 클래스
- `bg-gradient-to-br from-blue-50 via-white to-blue-100` - 그라데이션 배경
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` - 반응형 컨테이너
- `grid grid-cols-1 lg:grid-cols-2 gap-8` - 그리드 레이아웃

## 🔍 개발 팁

### 1. 새로운 페이지 추가
```bash
# app 폴더에 새 폴더 생성 후 page.tsx 파일 추가
mkdir app/new-page
touch app/new-page/page.tsx
```

### 2. 새로운 컴포넌트 추가
```bash
# components 폴더에 새 컴포넌트 파일 생성
touch components/new-component.tsx
```

### 3. 타입 정의
- `lib/types.ts`에서 공통 타입 정의
- 각 컴포넌트에서 필요한 타입은 해당 파일에 정의

### 4. 데이터 관리
- `lib/data.ts`에서 더미 데이터 관리
- 실제 백엔드 연동 시 API 호출 로직 추가

## 🚨 주의사항

1. **로컬 개발 전용**: 현재 설정은 로컬 개발용으로만 구성됨
2. **더미 데이터**: 현재는 정적 데이터 사용, 실제 백엔드 연동 필요
3. **인증 시스템**: 로그인/회원가입 UI만 구현, 실제 인증 로직 필요
4. **이미지 최적화**: localhost 도메인에서만 이미지 최적화 활성화

## 🤝 기여하기

### 개발 환경 설정
1. 저장소를 포크하고 클론합니다
2. `npm install`로 의존성을 설치합니다
3. `npm run dev`로 개발 서버를 실행합니다

### 코드 스타일
- TypeScript를 사용합니다
- ESLint 규칙을 준수합니다
- 커밋 메시지는 명확하게 작성합니다

### 성능 최적화
- 새로운 컴포넌트는 성능을 고려하여 작성합니다
- 불필요한 리렌더링을 방지합니다
- 메모리 누수를 방지합니다

## 📊 프로젝트 상태

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/goonsanweb)
![GitHub issues](https://img.shields.io/github/issues/your-username/goonsanweb)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/goonsanweb)
![GitHub license](https://img.shields.io/github/license/your-username/goonsanweb)

## 📞 문의
프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
