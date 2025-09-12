import { memo, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Youtube, ExternalLink } from "lucide-react"
import { SOCIAL_MEDIA_DATA } from "@/lib/data"

// 스타일 맵을 컴포넌트 외부로 이동하여 재생성 방지
const BUTTON_STYLES = {
  blue: "gap-6 px-40 py-8 text-2xl font-semibold border-2 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-700",
  red: "gap-6 px-40 py-8 text-2xl font-semibold border-2 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-700",
  gray: "gap-6 px-40 py-8 text-2xl font-semibold border-2 bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-700",
} as const

// 아이콘 맵을 컴포넌트 외부로 이동하여 재생성 방지
const ICON_MAP = {
  Facebook: <Facebook className="h-10 w-10" />,
  Youtube: <Youtube className="h-10 w-10" />,
  ExternalLink: <ExternalLink className="h-10 w-10" />,
} as const

function SocialMediaLinks() {
  const getButtonStyles = useMemo(() => (color: string) => {
    return BUTTON_STYLES[color as keyof typeof BUTTON_STYLES] || BUTTON_STYLES.gray
  }, [])

  const getIcon = useMemo(() => (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || null
  }, [])

  return (
    <div className="flex justify-center mb-12">
      <div className="flex gap-8">
        {SOCIAL_MEDIA_DATA.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className={getButtonStyles(link.color)}>
              {getIcon(link.icon)}
              <span>{link.name}</span>
              <ExternalLink className="h-6 w-6" />
            </Button>
          </a>
        ))}
      </div>
    </div>
  )
}

export default memo(SocialMediaLinks)
