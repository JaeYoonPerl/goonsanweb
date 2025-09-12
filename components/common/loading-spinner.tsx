/**
 * 재사용 가능한 로딩 스피너 컴포넌트
 * - 다양한 크기와 스타일 지원
 * - 접근성을 고려한 애니메이션
 * - 중앙 정렬 및 전체 화면 로딩 지원
 */
import { memo } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export const LoadingSpinner = memo(function LoadingSpinner({
  size = "md",
  className = "",
  text = "로딩 중...",
  fullScreen = false
}: LoadingSpinnerProps) {
  const spinnerElement = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-2",
      fullScreen && "min-h-screen",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  return spinnerElement
})
