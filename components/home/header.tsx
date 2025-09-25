/**
 * 전역 헤더 컴포넌트
 * - 로고, 네비게이션 메뉴, 검색 버튼, 사용자 정보를 포함
 * - 로그인 상태에 따른 메뉴 표시/숨김
 * - 관리자 권한에 따른 추가 메뉴 표시
 * - 전역 검색 모달 기능
 */
import { useState, useCallback, memo } from "react"
import { LogOut, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks"
import { useRouter, usePathname } from "next/navigation"
import { LazyGlobalSearch } from "@/components/lazy-components"

function Header() {
  const { user, isLoggedIn, logout, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  const handleLogoClick = useCallback(() => {
    if (pathname === "/") {
      // 메인 홈에서 클릭하면 새로고침
      window.location.reload()
    } else {
      // 다른 페이지에서 클릭하면 홈으로 이동
      router.push("/")
    }
  }, [pathname, router])

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 relative">
      {/* 헤더 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30"></div>
      <div className="w-full px-4 py-4 relative z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div 
            className="flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <img 
              src="/goonsanChong.webp" 
              alt="군산중고등학교 로고" 
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">군산중고등학교</h1>
              <p className="text-sm text-muted-foreground">총동창회</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/notices" className="text-foreground hover:text-primary transition-colors text-lg font-medium py-2 px-3">
              공지사항
            </a>
            <a href="/community" className="text-foreground hover:text-primary transition-colors text-lg font-medium py-2 px-3">
              동문 커뮤니티
            </a>
            {!loading && isLoggedIn && (
              <a href="/dues" className="text-foreground hover:text-primary transition-colors text-lg font-medium py-2 px-3">
                회비납부
              </a>
            )}
            {!loading && isLoggedIn && isAdmin && (
              <a href="/members" className="text-foreground hover:text-primary transition-colors text-lg font-medium py-2 px-3">
                회원목록
              </a>
            )}
          </nav>
           <div className="flex items-center gap-4">
             {/* 검색 버튼 */}
             <Button
               variant="outline"
               onClick={handleSearchOpen}
               className="h-10 px-4 text-sm gap-2"
             >
               <Search className="h-4 w-4" />
               검색
             </Button>
            
            {loading ? (
              <div className="text-sm text-muted-foreground">로딩 중...</div>
            ) : isLoggedIn ? (
              <>
                <Link href="/mypage" className="hidden md:flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span>{user?.name} ({user?.grade})</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-sm h-10 px-4">
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm h-10 px-4">
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* 전역 검색 모달 */}
      <LazyGlobalSearch 
        isOpen={isSearchOpen} 
        onClose={handleSearchClose} 
      />
    </header>
  )
}

export default memo(Header)
