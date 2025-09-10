/**
 * 전역 헤더 컴포넌트
 * - 로고, 네비게이션 메뉴, 검색 버튼, 사용자 정보를 포함
 * - 로그인 상태에 따른 메뉴 표시/숨김
 * - 관리자 권한에 따른 추가 메뉴 표시
 * - 전역 검색 모달 기능
 */
import { useState, useCallback, memo } from "react"
import { GraduationCap, LogOut, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
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
    <header className="bg-card border-b border-border">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div 
            className="flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <GraduationCap className="h-14 w-14 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">군산중고등학교</h1>
              <p className="text-lg text-muted-foreground">총동창회</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-12">
            <a href="/notices" className="text-foreground hover:text-primary transition-colors text-2xl font-medium py-2 px-4">
              공지사항
            </a>
            <a href="/community" className="text-foreground hover:text-primary transition-colors text-2xl font-medium py-2 px-4">
              동문 커뮤니티
            </a>
            {!loading && isLoggedIn && isAdmin && (
              <a href="/members" className="text-foreground hover:text-primary transition-colors text-2xl font-medium py-2 px-4">
                회원목록
              </a>
            )}
          </nav>
           <div className="flex items-center gap-6">
             {/* 검색 버튼 */}
             <Button
               variant="outline"
               onClick={handleSearchOpen}
               className="h-12 px-6 text-lg gap-2"
             >
               <Search className="h-5 w-5" />
               검색
             </Button>
            
            {!loading && isLoggedIn ? (
              <>
                <Link href="/mypage" className="hidden md:flex items-center gap-4 text-lg hover:text-primary transition-colors">
                  <User className="h-6 w-6" />
                  <span>{user?.name} ({user?.grade})</span>
                </Link>
                <Button variant="outline" size="lg" onClick={handleLogout} className="gap-3 text-lg h-12 px-6">
                  <LogOut className="h-6 w-6" />
                  로그아웃
                </Button>
              </>
            ) : !loading && (
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg h-12 px-6">
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
