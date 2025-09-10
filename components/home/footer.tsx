import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">군산중고등학교 총동창회</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              모교의 전통을 이어가며 동문들 간의 소중한 인연을 지속해 나가는 공간입니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">연락처</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>전화: 063)443-5050</p>
              <p>이메일: alumni@gunsan.hs.kr</p>
              <p>주소: 전라북도 군산시 죽성로 13</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">바로가기</h4>
            <div className="space-y-1 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                모교 홈페이지
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                동창회 회칙
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 군산중고등학교 총동창회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
